import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import fetcher from '../../../utils/ApiService';
import Loader from '../../../components/Loader';
import MainBackground from '../../../components/MainBackground';
import Spacing from '../../../components/Spacing';
import {HomeScreenStyles} from './Styles/HomeScreenStyles';
import HomeMidHeader from '../../../components/HomeMidHeader';
import LogoHeader from '../../../components/LogoHeader';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

import CustomMapCard from '../../../components/CustomMapCard';

const HomeScreen = ({navigation, liveLocation}) => {
  // Add liveLocation as a prop
  const [selected, setSelected] = useState('Week');
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

  const {data: deviceData, isLoading} = useQuery({
    queryKey: ['deviceDetails'],
    // queryFn: () => fetcher({method: 'GET', url: 'devices/getDevices'}),
  });

  const handleGeoFenceSelect = item => {
    console.log('***************************', item);
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

  if (isLocationLoading) {
    return (
      <MainBackground style={{backgroundColor: theme.otpBox}}>
        <Loader />
      </MainBackground>
    );
  }

  // if (
  //   !locationData?.data.results ||
  //   !Array.isArray(locationData?.data.results) ||
  //   locationData?.data?.results?.length === 0
  // ) {
  //   return (
  //     <MainBackground style={{backgroundColor: theme.otpBox}}>
  //       <LogoHeader onPress={() => navigation.navigate('NotificationScreen')} />
  //       <View style={{alignItems: 'center'}}>
  //         <Text style={{color: theme.text, fontSize: 16}}>
  //           No Data Found, Please Select Device in settings
  //         </Text>
  //       </View>
  //     </MainBackground>
  //   );
  // }

  return (
    <MainBackground style={{backgroundColor: theme.otpBox, padding: 0}}>
      <View style={{flex: 1}}>
        <CustomMapCard
          deviceData={deviceData}
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
      </View>
    </MainBackground>
  );
};

export default HomeScreen;
