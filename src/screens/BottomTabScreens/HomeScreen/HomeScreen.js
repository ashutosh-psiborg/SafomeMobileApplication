import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {useQuery} from '@tanstack/react-query';
import fetcher from '../../../utils/ApiService';
import Loader from '../../../components/Loader';
import MainBackground from '../../../components/MainBackground';
import Spacing from '../../../components/Spacing';
import AddressIcon from '../../../assets/icons/AddressIcon';
import RefreshIcon from '../../../assets/icons/RefreshIcon';
import {HomeScreenStyles} from './Styles/HomeScreenStyles';
import FilterContainer from '../../../components/FilterContainer';
import StatisticsCards from '../../../components/StatisticsCards';
import ContactCards from '../../../components/ContactCards';
import HomeMidHeader from '../../../components/HomeMidHeader';
import LogoHeader from '../../../components/LogoHeader';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import CustomCard from '../../../components/CustomCard';
import TimeLineIcon from '../../../assets/icons/TimeLineIcon';

const HomeScreen = ({navigation}) => {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState('Week');
  const [showAllLocations, setShowAllLocations] = useState(false);

  const options = ['Today', 'Week', 'Month', 'Custom'];
  const [deviceId, setDeviceId] = useState('');
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = HomeScreenStyles(theme);

  const locationRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [mapKey, setMapKey] = useState(0);
  const getSelectedDevice = async () => {
    try {
      const deviceId = await AsyncStorage.getItem('selectedDeviceId');
      setDeviceId(deviceId);
      console.log('Selected Device ID:', deviceId);
    } catch (error) {
      console.error('Error retrieving device ID:', error);
    }
  };
  const getDateRange = () => {
    const today = moment().format('DD-MM-YYYY');

    if (selected?.label === 'Custom') {
      return {
        startDate: moment(selected.startDate).format('DD-MM-YYYY'),
        endDate: today,
      };
    }

    switch (selected) {
      case 'Today':
        return {startDate: today, endDate: today};
      case 'Week':
        return {
          startDate: moment().subtract(7, 'days').format('DD-MM-YYYY'),
          endDate: today,
        };
      case 'Month':
        return {
          startDate: moment().subtract(30, 'days').format('DD-MM-YYYY'),
          endDate: today,
        };
      default:
        return {startDate: today, endDate: today};
    }
  };
  console.log(deviceId);
  const {startDate, endDate} = getDateRange();
  console.log(startDate, endDate);
  useFocusEffect(
    useCallback(() => {
      getSelectedDevice();
      refetchFitness();
      refetchLocation();
    }, []),
  );
  const {
    data: fitnessData,
    isLoading: isFitnessLoading,
    refetch: refetchFitness,
  } = useQuery({
    queryKey: ['fitness', selected],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/healthData/${
          deviceId || 6907390711
        }?startDate=${startDate}&endDate=${endDate}`,
      }),
  });
  console.log('====', fitnessData);
  const {
    data: locationData,
    isLoading: isLocationLoading,
    refetch: refetchLocation,
  } = useQuery({
    queryKey: ['location'],
    queryFn: async () => {
      const response = await fetcher({
        method: 'GET',
        url: `deviceDataResponse/locations/${deviceId || 6907390711}`,
      });
      return response;
    },
    onSuccess: data => {
      const latestLocation = data?.data?.[0];
      if (latestLocation?.latitude && latestLocation?.longitude) {
        const lat = parseFloat(latestLocation?.latitude);
        const long = parseFloat(latestLocation?.longitude);

        if (!isNaN(lat) && !isNaN(long)) {
          const newLocation = {latitude: lat, longitude: long};
          locationRef.current = newLocation;
          setLocation(newLocation);
          setMapKey(prevKey => prevKey + 1); // Force re-render of MapView
        }
      }
    },
  });

  console.log('longitude', locationData?.data[0]?.longitude);
  console.log('latitude', locationData?.data[0]?.latitude);

  useEffect(() => {
    const latestLocation = locationData?.data?.[0];
    if (latestLocation?.latitude && latestLocation?.longitude) {
      const lat = parseFloat(latestLocation?.latitude);
      const long = parseFloat(latestLocation?.longitude);

      if (!isNaN(lat) && !isNaN(long)) {
        const newLocation = {latitude: lat, longitude: long};
        locationRef.current = newLocation;
        setLocation(newLocation);
        setMapKey(prevKey => prevKey + 1);
      }
    }
  }, [locationData]);

  const handleRefresh = async () => {
    await refetchLocation();
    await refetchFitness();
  };

  if (isLocationLoading) {
    return (
      <MainBackground style={{backgroundColor: theme.otpBox}}>
        <Loader />
      </MainBackground>
    );
  }

  if (
    !locationData?.data ||
    !Array.isArray(locationData?.data) ||
    locationData?.data?.length === 0
  ) {
    return (
      <MainBackground style={{backgroundColor: theme.otpBox}}>
        <LogoHeader onPress={() => navigation.navigate('NotificationScreen')} />
        <View style={{alignItems: 'center'}}>
          <Text style={{color: theme.text, fontSize: 16}}>
            No Data Found, Please Select Device in settings
          </Text>
        </View>
      </MainBackground>
    );
  }

  return (
    <MainBackground style={{backgroundColor: theme.otpBox}}>
      <LogoHeader onPress={() => navigation.navigate('NotificationScreen')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacing height={DimensionConstants.twentyFour} />
        <View style={styles.addressContainer}>
          <View style={styles.rowContainer}>
            <AddressIcon />
            <Text
              style={styles.placeText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {locationData?.data?.[0]?.placeName || 'Location not available'}
            </Text>
          </View>
          <View style={styles.refreshContainer}>
            <TouchableOpacity
              onPress={handleRefresh}
              style={styles.refreshButton}>
              <Text style={styles.refreshText}>Refresh</Text>
              <RefreshIcon />
            </TouchableOpacity>
          </View>
        </View>

        <Spacing height={DimensionConstants.fifteen} />
        <View style={styles.mapContainer}>
          {location ? (
            <MapView
              key={mapKey} // Force re-render of MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <Marker
                coordinate={location}
                title="Your Location"
                description={
                  locationData?.data?.[0]?.placeName || 'Location not available'
                }
              />
            </MapView>
          ) : (
            <Loader />
          )}
        </View>
        <Spacing height={DimensionConstants.twentyFour} />
        <HomeMidHeader
          title={'Recent Location'}
          showViewAll={locationData?.data?.length > 3}
          onPress={() => setShowAllLocations(prev => !prev)}
          viewAllLabel={showAllLocations ? 'Collapse' : 'View All'}
        />
        <Spacing height={DimensionConstants.ten} />

        <CustomCard>
          {(showAllLocations
            ? locationData?.data
            : locationData?.data?.slice(0, 3)
          ).map((item, index, arr) => (
            <View
              key={index}
              style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              {/* Timeline column */}
              <View style={{width: 20, alignItems: 'center'}}>
                <TimeLineIcon />
                {index !== arr.length - 1 && (
                  <View
                    style={{
                      width: 1,
                      flex: 1,
                      backgroundColor: 'transparent',
                      borderLeftWidth: 1,
                      borderLeftColor: '#FF310C',
                      borderStyle: 'dashed',
                      marginTop: 2,
                    }}
                  />
                )}
              </View>

              {/* Content section */}
              <View style={{marginLeft: 10, paddingBottom: 20}}>
                <Text style={{fontWeight: 'bold'}}>
                  {moment(item?.createdAt).format('DD-MM-YYYY')}
                </Text>
                <Text style={{color: '#666'}}>
                  {moment(item?.createdAt).format('hh:mm A')}
                </Text>
                <Text style={{marginTop: 4}}>{item?.placeName}</Text>
              </View>
            </View>
          ))}
        </CustomCard>

        <Spacing height={DimensionConstants.twentyFour} />
        <HomeMidHeader title="Statistics" showViewAll={false} />
        <Spacing height={20} />
        <FilterContainer
          options={options}
          selected={selected}
          onSelect={setSelected}
          theme={theme}
        />

        <StatisticsCards data={fitnessData} loading={isFitnessLoading} />
        {/* <Spacing height={DimensionConstants.twentyFour} /> */}
        {/* <HomeMidHeader title="Recent Notifications" onPress={() => setExpanded(!expanded)} />
        <CardStack expanded={expanded} /> */}
        <Spacing height={DimensionConstants.twentyFour} />
        <HomeMidHeader
          title="My Contacts"
          onPress={() => navigation.navigate('MainApp', {screen: 'Saviours'})}
        />
        <Spacing height={DimensionConstants.ten} />
        <ContactCards
          familyCardPress={() =>
            navigation.navigate('FamilyScreen', {type: 'family'})
          }
          friendCardPress={() =>
            navigation.navigate('FamilyScreen', {type: 'friends'})
          }
        />
      </ScrollView>
    </MainBackground>
  );
};

export default HomeScreen;
