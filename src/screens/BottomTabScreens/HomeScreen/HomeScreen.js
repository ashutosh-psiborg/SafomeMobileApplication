import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useQuery} from '@tanstack/react-query';
import fetcher from '../../../utils/ApiService';
import Loader from '../../../components/Loader';
import MainBackground from '../../../components/MainBackground';
import Spacing from '../../../components/Spacing';
import AddressIcon from '../../../assets/icons/AddressIcon';
import RefreshIcon from '../../../assets/icons/RefreshIcon';
import {HomeScreenStyles} from './Styles/HomeScreenStyles';
import StatisticsCards from '../../../components/StatisticsCards';
import HomeMidHeader from '../../../components/HomeMidHeader';
import LogoHeader from '../../../components/LogoHeader';
import {
  DimensionConstants,
  height,
  width,
} from '../../../constants/DimensionConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import CustomCard from '../../../components/CustomCard';
import TimeLineIcon from '../../../assets/icons/TimeLineIcon';
import CustomMapCard from '../../../components/CustomMapCard';

const HomeScreen = ({navigation, liveLocation}) => {
  // Add liveLocation as a prop
  const [selected, setSelected] = useState('Week');
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [devId, setDevId] = useState('');
  const [location, setLocation] = useState(null);
  const [mapKey, setMapKey] = useState(0);
  const [selectedGeoFence, setSelectedGeoFence] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const mapRef = useRef(null);
  const [selectedGeoFenceId, setSelectedGeoFenceId] = useState(null);

  const locationRef = useRef(null);
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = HomeScreenStyles(theme);

  const getSelectedDevice = async () => {
    try {
      const deviceId = await AsyncStorage.getItem('selectedDeviceId');
      setDeviceId(deviceId);
    } catch (error) {
      console.error('Error retrieving device ID:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const getStoredDeviceId = async () => {
        try {
          const storedMongoId = await AsyncStorage.getItem(
            'selectedDeviceMongoId',
          );
          if (storedMongoId) setDevId(storedMongoId);
        } catch (error) {
          console.error('Failed to retrieve stored device data:', error);
        }
      };
      getStoredDeviceId();
      getSelectedDevice();
      refetchFitness();
      refetchLocation();
      refetchGeoFence();
    }, [deviceId]),
  );

  const handleGeoFenceSelect = item => {
    setSelectedGeoFenceId(item.value);
    const selected = geoFenceData?.data?.results.find(
      fence => fence._id === item.value,
    );
    if (selected) {
      setSelectedGeoFence(selected);
      if (selected.type === 'Circle') {
        const latitude = selected.location.coordinates[0].latitude;
        const longitude = selected.location.coordinates[0].longitude;
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
            1000,
          );
        }
      } else if (selected.type === 'Polygon') {
        const polygonCoordinates = selected.location.coordinates.map(coord => ({
          latitude: coord.latitude,
          longitude: coord.longitude,
        }));
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(polygonCoordinates, {
            edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
            animated: true,
          });
        }
      }
    }
  };

  const handleLiveLocationPress = () => {
    if (liveLocation && liveLocation.latitude && liveLocation.longitude) {
      const {latitude, longitude} = liveLocation;
      setLocation({latitude, longitude});
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000,
        );
      }
    } else {
      Alert.alert('Error', 'Live location data is not available.');
    }
  };

  const {
    data: stepData,
    isLoading: stepLoading,
    refetch: refetchStepData,
  } = useQuery({
    queryKey: ['steps'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getStepData/6907390711`,
      }),
  });

  const {
    data: fitnessData,
    isLoading: isFitnessLoading,
    refetch: refetchFitness,
  } = useQuery({
    queryKey: ['fitness', selected],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/healthData/${deviceId}`,
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
        url: `deviceDataResponse/locations/${deviceId}`,
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
          setMapKey(prevKey => prevKey + 1);
        }
      }
    },
  });

  const {
    data: geoFenceData,
    isLoading: isGeoFenceLoading,
    refetch: refetchGeoFence,
  } = useQuery({
    queryKey: ['geoFence', devId],
    queryFn: async () => {
      const response = await fetcher({
        method: 'GET',
        url: `geoFence/getFence/${devId}`,
      });
      return response;
    },
  });

  useEffect(() => {
    const latestLocation = locationData?.data?.results?.[0];
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
    !locationData?.data.results ||
    !Array.isArray(locationData?.data.results) ||
    locationData?.data?.results?.length === 0
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
              {locationData?.data?.results?.[0]?.placeName ||
                'Location not available'}
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

        {/* <LocationInfoCard /> */}
        {/* <Spacing height={DimensionConstants.ten} /> */}
        <CustomMapCard
          location={location}
          isGeoFenceLoading={isGeoFenceLoading}
          geoFenceData={geoFenceData}
          selectedGeoFence={selectedGeoFence}
          handleGeoFenceSelect={handleGeoFenceSelect}
          mapRef={mapRef}
          mapKey={mapKey}
          mapRegion={mapRegion}
          onLiveLocationPress={handleLiveLocationPress}
          liveLocation={location}
        />

        <Spacing height={DimensionConstants.ten} />
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#FF310C',
            padding: 10,
            borderRadius: 20,
            marginBottom: 10,
            borderStyle: 'dashed',
            width: width / 2,
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('GeofenceScreen')}>
          <Text style={{color: '#000', fontWeight: '600'}}>
            + Add geofence details
          </Text>
        </TouchableOpacity>

        <HomeMidHeader
          title={'Recent Location'}
          onPress={() => navigation.navigate('MainApp', {screen: 'Location'})}
        />
        <Spacing height={DimensionConstants.ten} />

        <CustomCard>
          {(showAllLocations
            ? locationData?.data.results
            : locationData?.data?.results?.slice(0, 3)
          ).map((item, index, arr) => (
            <View
              key={index}
              style={{flexDirection: 'row', alignItems: 'flex-start'}}>
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
        <StatisticsCards
          data={fitnessData}
          loading={isFitnessLoading}
          stepData={stepData}
          navigation={navigation}
        />
      </ScrollView>
    </MainBackground>
  );
};

export default HomeScreen;
