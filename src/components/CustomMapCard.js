import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Circle,
  Polygon,
} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DimensionConstants} from '../constants/DimensionConstants';
import {useState, useEffect} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import fetcher from '../utils/ApiService';
import CustomCard from './CustomCard';
import Loader from './Loader';
import SafomeLogo from '../assets/icons/SafomeLogo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {io} from 'socket.io-client';

const CustomMapCard = ({
  location,
  selectedGeoFence,
  handleGeoFenceSelect,
  mapRef,
  mapKey,
  mapRegion,
  onLiveLocationPress,
  deviceData,
  geoFenceData,
  onDeviceSelect,
  onGeoFenceDelete,
}) => {
  const navigation = useNavigation();
  const [isZoneMode, setIsZoneMode] = useState(false);
  const [showList, setShowList] = useState(false);
  const [listType, setListType] = useState(null);
  const [serverDataList, setServerDataList] = useState([]);
  const [selectedDeviceName, setSelectedDeviceName] = useState(
    deviceData?.data?.deviceName || 'Select Device',
  );
  console.log('location-----', deviceData?.data?.deviceId);
  useEffect(() => {
    const socket = io('ws://52.65.120.67:8001', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');

      socket.emit('joinRoom', {
        deviceId: deviceData?.data?.deviceId,
        commandLetter: 'UD_LTE',
      });
    });

    socket.on('serverData', data => {
      console.log('📡 Received:', data);
      setServerDataList(data?.data);
    });

    socket.on('errorMessage', msg => {
      console.error('❌ Server error:', msg);
    });

    return () => socket.disconnect();
  }, [deviceData?.data?.deviceId]);
  console.log('________>>>>>>>>>>', deviceData?.data?.deviceId);
  console.log('________>>>>>>>>>>', serverDataList);

  const {data: allDevicesData, isLoading: isDevicesLoading} = useQuery({
    queryKey: ['allDevices'],
    queryFn: () => fetcher({method: 'GET', url: 'devices/getDevices'}),
  });

  const deleteGeoFenceMutation = useMutation({
    mutationFn: fenceId =>
      fetcher({method: 'DELETE', url: `/geoFence/deleteFence/${fenceId}`}),
    onSuccess: () => {
      Alert.alert('Success', 'Geofence deleted successfully'),
        onGeoFenceDelete();
    },

    onError: error =>
      Alert.alert('Error', error.message || 'Failed to delete geofence'),
  });

  const handleZoneClick = () => {
    setIsZoneMode(true);
    setListType('zones');
    setShowList(false);
  };

  const handleLiveClick = () => {
    setIsZoneMode(false);
    setShowList(false);
    setListType(null);
  };

  const handleDeviceNameClick = () => {
    setListType('devices');
    setShowList(!showList);
  };

  const onDeletePress = geofence => {
    Alert.alert(
      'Delete Geofence',
      `Are you sure you want to delete ${geofence.name}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: () => deleteGeoFenceMutation.mutate(geofence._id),
          style: 'destructive',
        },
      ],
    );
  };

  const renderZoneContent = () => {
    if (geoFenceData?.data?.results?.length > 0) {
      return (
        <TouchableOpacity
          style={{flexDirection: 'row', justifyContent: 'space-between'}}
          onPress={() => {
            setListType('zones');
            setShowList(!showList);
          }}>
          <Text style={styles.selectZoneText}>Select Zone</Text>
          {showList ? (
            <MaterialIcons name="keyboard-arrow-up" color="white" size={20} />
          ) : (
            <MaterialIcons name="keyboard-arrow-down" color="white" size={20} />
          )}
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={() => navigation.navigate('GeofenceScreen')}>
        <Text style={styles.noGeofenceText}>Create Zone</Text>
      </TouchableOpacity>
    );
  };

  const renderListContent = () => {
    if (listType === 'zones') {
      return (
        <View style={styles.zoneListContainer}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onPress={() => navigation.navigate('GeofenceScreen')}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: DimensionConstants.five,
              }}>
              <MaterialIcons name="add-circle-outline" size={18} />
              <Text style={styles.addZoneText}>Add New Zone</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={18} />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.zoneList}>
            {geoFenceData?.data?.results?.length > 0 ? (
              geoFenceData.data.results.map(item => (
                <View key={item._id} style={styles.zoneItem}>
                  <TouchableOpacity
                    style={styles.zoneItemButton}
                    onPress={() => {
                      handleGeoFenceSelect({value: item._id});
                      setShowList(false);
                    }}>
                    <Text style={styles.zoneItemText}>{item?.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDeletePress(item)}>
                    <MaterialCommunityIcons
                      name="delete-empty"
                      size={18}
                      color="#ff4d4d"
                    />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noGeofenceText}>No Geofences Available</Text>
            )}
          </ScrollView>
        </View>
      );
    } else if (listType === 'devices') {
      return (
        <View style={styles.deviceListContainer}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
              <MaterialIcons name="watch" size={15} />
              <Text
                style={{
                  fontSize: DimensionConstants.fifteen,
                  fontWeight: '500',
                }}>
                Device List
              </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={20} />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.deviceList}>
            {allDevicesData?.data?.results?.length > 0 ? (
              allDevicesData.data.results.map(item => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.deviceItem}
                  onPress={() => {
                    setSelectedDeviceName(item.deviceName);
                    onDeviceSelect(item);
                    setShowList(false);
                  }}>
                  <Text style={styles.deviceItemText}>{item.deviceName}</Text>
                  <MaterialIcons name="keyboard-arrow-right" size={20} />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDeviceText}>No Devices Available</Text>
            )}
          </ScrollView>
        </View>
      );
    }
    return null;
  };

  return (
    <GestureHandlerRootView>
      <CustomCard style={styles.mapContainer}>
        {location ? (
          <View style={styles.mapWrapper}>
            <MapView
              key={mapKey}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: location?.latitude,
                longitude: location?.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              region={mapRegion}
              ref={mapRef}>
              {location && (
                <Marker
                  coordinate={location}
                  title="Your Location"
                  pinColor="red"
                />
              )}
              {selectedGeoFence?.type === 'Circle' && (
                <Circle
                  center={{
                    latitude: mapRegion.latitude,
                    longitude: mapRegion.longitude,
                  }}
                  radius={selectedGeoFence.radius}
                  strokeWidth={2}
                  strokeColor="rgba(255,0,0,0.8)"
                  fillColor="rgba(255,0,0,0.3)"
                />
              )}
              {selectedGeoFence?.type === 'Polygon' &&
                selectedGeoFence.location.coordinates.length > 2 && (
                  <Polygon
                    coordinates={selectedGeoFence.location.coordinates.map(
                      coord => ({
                        latitude: coord.latitude,
                        longitude: coord.longitude,
                      }),
                    )}
                    strokeWidth={2}
                    strokeColor="rgba(255,0,0,0.8)"
                    fillColor="rgba(255,0,0,0.3)"
                  />
                )}
            </MapView>
            <View style={styles.floatingButtonsContainer}>
              <TouchableOpacity onPress={onLiveLocationPress}>
                <LinearGradient
                  colors={['#007bff', '#0056b3']}
                  style={styles.floatingButton}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}>
                  <Icon name="my-location" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={styles.topCardContainer}>
              <CustomCard
                style={{
                  paddingVertical: DimensionConstants.five,
                  paddingHorizontal: DimensionConstants.eight,
                }}>
                <View style={styles.deviceContainer}>
                  <SafomeLogo width={50} height={50} />
                  <View style={styles.deviceInfo}>
                    {isZoneMode && selectedGeoFence ? (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                        onPress={() => {
                          setListType('zones');
                          setShowList(!showList);
                        }}>
                        <Text style={styles.deviceName}>
                          {selectedGeoFence.name}
                        </Text>
                        <MaterialIcons
                          name={
                            showList
                              ? 'keyboard-arrow-up'
                              : 'keyboard-arrow-down'
                          }
                          color="white"
                          size={20}
                        />
                      </TouchableOpacity>
                    ) : isZoneMode ? (
                      renderZoneContent()
                    ) : (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                        onPress={handleDeviceNameClick}>
                        <Text style={styles.deviceName}>
                          {deviceData?.data?.deviceName || 'Select Device'}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <MaterialCommunityIcons
                            name="battery-medium"
                            size={24}
                            color="white"
                          />
                          <Text style={styles.deviceName}>
                            {serverDataList?.battery_status} %
                          </Text>
                          <MaterialIcons
                            name={
                              showList
                                ? 'keyboard-arrow-up'
                                : 'keyboard-arrow-down'
                            }
                            color="white"
                            size={20}
                          />
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {showList && renderListContent()}
              </CustomCard>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleLiveClick}>
                  <Text style={styles.buttonText}>Live</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleZoneClick}>
                  <Text style={styles.buttonText}>Zone</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <Loader />
        )}
      </CustomCard>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    borderRadius: DimensionConstants.ten,
    height: DimensionConstants.fourSixty,
    overflow: 'hidden',
    padding: 0,
    flex: 1,
  },
  mapWrapper: {flex: 1, position: 'relative'},
  map: {height: '100%', width: '100%', borderRadius: DimensionConstants.twenty},
  floatingButtonsContainer: {
    position: 'absolute',
    bottom: DimensionConstants.ten,
    right: DimensionConstants.ten,
    alignItems: 'center',
    gap: DimensionConstants.ten,
  },
  floatingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  topCardContainer: {
    position: 'absolute',
    top: DimensionConstants.ten,
    left: DimensionConstants.ten,
    right: DimensionConstants.ten,
  },
  deviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DimensionConstants.fifteen,
  },
  deviceInfo: {
    flex: 1,
    backgroundColor: '#0279E1',
    padding: DimensionConstants.eight,
    borderRadius: DimensionConstants.ten,
  },
  deviceName: {
    fontSize: DimensionConstants.fifteen,
    fontWeight: '500',
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: DimensionConstants.ten,
    marginTop: DimensionConstants.five,
  },
  iconButton: {
    paddingHorizontal: 20,
    paddingVertical: 3,
    backgroundColor: '#0279E1',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  selectZoneText: {
    fontSize: DimensionConstants.fifteen,
    fontWeight: '500',
    color: 'white',
  },
  noGeofenceText: {
    textAlign: 'center',
    color: 'white',
    fontSize: DimensionConstants.fifteen,
  },
  zoneListContainer: {
    padding: DimensionConstants.five,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: DimensionConstants.ten,
  },

  addZoneText: {
    fontSize: DimensionConstants.fifteen,
    color: 'black',
    fontWeight: '600',
  },
  zoneList: {
    paddingVertical: DimensionConstants.five,
  },
  zoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: DimensionConstants.eight,
  },
  zoneItemButton: {
    flex: 1,
    paddingVertical: DimensionConstants.one,
  },
  zoneItemText: {
    fontSize: DimensionConstants.fifteen,
    color: 'black',
    fontWeight: '500',
  },
  deleteButton: {
    // padding: DimensionConstants.five,
  },
  deviceListContainer: {
    // padding: DimensionConstants.five,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: DimensionConstants.ten,
    marginTop: DimensionConstants.ten,
  },
  deviceList: {
    paddingVertical: DimensionConstants.two,
    marginLeft: DimensionConstants.two,
  },
  deviceItem: {
    marginVertical: DimensionConstants.two,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceItemText: {
    fontSize: DimensionConstants.fourteen,
    color: 'black',
    fontWeight: '500',
  },
  noDeviceText: {
    textAlign: 'center',
    color: 'white',
    fontSize: DimensionConstants.fifteen,
    paddingVertical: DimensionConstants.ten,
    fontStyle: 'italic',
  },
});

export default CustomMapCard;
