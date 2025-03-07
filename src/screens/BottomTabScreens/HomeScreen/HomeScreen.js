import React, {useState, useEffect, useRef} from 'react';
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

const HomeScreen = ({navigation}) => {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState('Week');
  const options = ['Today', 'Week', 'Month'];

  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = HomeScreenStyles(theme);

  const locationRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [mapKey, setMapKey] = useState(0);

  const {
    data: fitnessData,
    isLoading: isFitnessLoading,
    refetch: refetchFitness,
  } = useQuery({
    queryKey: ['fitness', selected],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/fitness-health/6907390711?range=${selected.toLowerCase()}`,
      }),
  });

  const {
    data: locationData,
    isLoading: isLocationLoading,
    refetch: refetchLocation,
  } = useQuery({
    queryKey: ['location'],
    queryFn: async () => {
      const response = await fetcher({
        method: 'GET',
        url: `deviceDataResponse/locations/6907390711`,
      });
      return response;
    },
    onSuccess: data => {
      if (data?.data?.latitude && data?.data?.longitude) {
        const lat = parseFloat(data.data.latitude);
        const long = parseFloat(data.data.longitude);

        if (!isNaN(lat) && !isNaN(long)) {
          const newLocation = {latitude: lat, longitude: long};
          locationRef.current = newLocation;
          setLocation(newLocation);
          setMapKey(prevKey => prevKey + 1); // Force re-render of MapView
        }
      }
    },
  });

  useEffect(() => {
    if (locationData?.data?.latitude && locationData?.data?.longitude) {
      const lat = parseFloat(locationData.data.latitude);
      const long = parseFloat(locationData.data.longitude);

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

  if (isLocationLoading || !locationData?.data) {
    return (
      <MainBackground style={{backgroundColor: theme.otpBox}}>
        <Loader />
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
              {locationData?.data?.placeName || 'Location not available'}
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
                description={locationData?.data?.placeName}
              />
            </MapView>
          ) : (
            <Loader />
          )}
        </View>
        <Spacing height={DimensionConstants.twentyFour} />
        <HomeMidHeader title="Statistics" showViewAll={false} />
        <Spacing height={20} />
        <FilterContainer
          options={options}
          selected={selected}
          onSelect={setSelected}
          theme={theme}
        />
        {isFitnessLoading ? <Loader /> : <StatisticsCards data={fitnessData} />}
        {/* <Spacing height={DimensionConstants.twentyFour} /> */}
        {/* <HomeMidHeader title="Recent Notifications" onPress={() => setExpanded(!expanded)} />
        <CardStack expanded={expanded} /> */}
        <Spacing height={DimensionConstants.twentyFour} />
        <HomeMidHeader title="My Contacts" />
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
