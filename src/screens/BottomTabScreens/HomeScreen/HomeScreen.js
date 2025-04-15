import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Alert, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import fetcher from '../../../utils/ApiService';
import Loader from '../../../components/Loader';
import MainBackground from '../../../components/MainBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {io} from 'socket.io-client';
import CustomMapCard from '../../../components/CustomMapCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({navigation, liveLocation}) => {
  const [deviceId, setDeviceId] = useState('');
  const [devId, setDevId] = useState('');
  const [location, setLocation] = useState(null);
  const [mapKey, setMapKey] = useState(0);
  const [selectedGeoFence, setSelectedGeoFence] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const mapRef = useRef(null);
  const [selectedGeoFenceId, setSelectedGeoFenceId] = useState(null);
  const locationRef = useRef(null);
  const queryClient = useQueryClient();
  const [serverDataList, setServerDataList] = useState([]);

  useEffect(() => {
    const socket = io('ws://52.65.120.67:8001', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');

      socket.emit('joinRoom', {
        deviceId: deviceId,
        commandLetter: 'UD_LTE',
      });
    });

    socket.on('serverData', data => {
      console.log('📡 Received:', data);
      setServerDataList(prev => [...prev, data]);
    });

    socket.on('errorMessage', msg => {
      console.error('❌ Server error:', msg);
    });

    return () => socket.disconnect();
  }, [deviceId]);
  console.log('________>>>>>>>>>>', deviceId);
  console.log('________>>>>>>>>>>', serverDataList);
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

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
          console.log('storedMongoId', storedMongoId);
          if (storedMongoId) setDevId(storedMongoId);
        } catch (error) {
          console.error('Failed to retrieve stored device data:', error);
        }
      };
      getStoredDeviceId();
      getSelectedDevice();

      refetchLocation();
      refetchGeoFence();
      setSelectedGeoFence(null);
      deviceDataRefetch();
    }, [deviceId, devId]),
  );

  const {
    data: deviceData,
    isLoading,
    error,
    refetch: deviceDataRefetch,
  } = useQuery({
    queryKey: ['deviceData', devId, deviceId],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `/devices/deviceDetails/${devId}`,
      }),
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
  const handleDeviceSelect = async device => {
    console.log('0&&&&&&&&&&&&&&&&&', device.deviceId);

    setDeviceId(device.deviceId);
    setDevId(device._id);
    setSelectedGeoFence(null); // Reset selected geofence
    setSelectedGeoFenceId(null);
    try {
      await AsyncStorage.setItem('selectedDeviceId', device.deviceId);
      await AsyncStorage.setItem('selectedDeviceMongoId', device._id);

      refetchLocation();
      refetchGeoFence();
    } catch (error) {
      console.error('Failed to save device selection:', error);
    }
  };

  const handleGeoFenceDelete = () => {
    // Refetch all data after geofence deletion
    setSelectedGeoFence(null); // Reset selected geofence
    setSelectedGeoFenceId(null); // Reset geofence ID
    refetchGeoFence();
    refetchLocation();
    // Optionally refetch device data if needed
    queryClient.invalidateQueries(['deviceDetails']);
  };

  const {
    data: locationData,
    isLoading: isLocationLoading,
    refetch: refetchLocation,
  } = useQuery({
    queryKey: ['location', devId, deviceId],
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
  console.log('++++++++++++++++++++++++++++++++++++', locationData);
  const {
    data: geoFenceData,
    isLoading: isGeoFenceLoading,
    refetch: refetchGeoFence,
  } = useQuery({
    queryKey: ['geoFence', devId, deviceId],
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

  if (!devId && !deviceId) {
    return (
      <MainBackground style={{backgroundColor: theme.otpBox}}>
        <View style={styles.emptyStateContainer}>
          <Icon
            name="devices" // Or "smartwatch" or "watch" depending on your device type
            size={80}
            color={theme.primaryLight || '#888'}
            style={styles.emptyStateIcon}
          />
          <Text style={[styles.emptyStateTitle, {color: theme.text}]}>
            No Device Selected
          </Text>
          <Text
            style={[
              styles.emptyStateDescription,
              {color: theme.textSecondary},
            ]}>
            Please select a device to view its location and information on the
            map.
          </Text>
          <TouchableOpacity
            style={[styles.addDeviceButton, {backgroundColor: theme.primary}]}
            onPress={() => navigation.navigate('AddRemoveDeviceScreen')}>
            <Icon
              name="plus-circle-outline"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.addDeviceButtonText}>Select Device</Text>
          </TouchableOpacity>
        </View>
      </MainBackground>
    );
  }
  // if (isLocationLoading) {
  //   return (
  //     <MainBackground style={{backgroundColor: theme.otpBox}}>
  //       <Loader />
  //     </MainBackground>
  //   );
  // }

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
          onDeviceSelect={handleDeviceSelect}
          onGeoFenceDelete={handleGeoFenceDelete}
        />
      </View>
    </MainBackground>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateIcon: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  addDeviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  addDeviceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
