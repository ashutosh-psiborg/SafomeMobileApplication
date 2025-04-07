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
import {useState} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import fetcher from '../utils/ApiService';
import CustomCard from './CustomCard';
import Loader from './Loader';
import SafomeLogo from '../assets/icons/SafomeLogo';
import {Dropdown} from 'react-native-element-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
}) => {
  const navigation = useNavigation();
  const [isZoneMode, setIsZoneMode] = useState(false);
  const [showZoneList, setShowZoneList] = useState(false);

  const deleteGeoFenceMutation = useMutation({
    mutationFn: fenceId =>
      fetcher({method: 'DELETE', url: `/geoFence/deleteFence/${fenceId}`}),
    onSuccess: () => Alert.alert('Success', 'Geofence deleted successfully'),
    onError: error =>
      Alert.alert('Error', error.message || 'Failed to delete geofence'),
  });

  const handleZoneClick = async () => {
    // await refetch();
    setIsZoneMode(true);
    setShowZoneList(false);
  };
  const handleLiveClick = () => {
    setIsZoneMode(false);
    setShowZoneList(false);
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
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={() => setShowZoneList(true)}>
          <Text style={styles.selectZoneText}>Select Zone</Text>
          <MaterialIcons name="keyboard-arrow-down" color="white" size={20} />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={() => navigation.navigate('GeofenceScreen')}>
        <Text style={styles.noGeofenceText}>Create Zone</Text>
      </TouchableOpacity>
    );
  };

  const renderZoneList = () => (
    <>
      <View style={styles.zoneListContainer}>
        <TouchableOpacity
          style={styles.addZoneButton}
          onPress={() => navigation.navigate('GeofenceScreen')}>
          <LinearGradient
            colors={['#007bff', '#0056b3']}
            style={styles.addZoneGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <FontAwesome6 name="map-location-dot" size={18} color="#fff" />
            <Text style={styles.addZoneText}>Add New Zone</Text>
          </LinearGradient>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.zoneList}>
          {geoFenceData?.data?.results?.length > 0 ? (
            geoFenceData.data.results.map(item => (
              <View key={item._id} style={styles.zoneItem}>
                <TouchableOpacity
                  style={styles.zoneItemButton}
                  onPress={() => {
                    handleGeoFenceSelect({value: item._id});
                    setShowZoneList(false);
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
    </>
  );
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
                latitude: 28.5057,
                longitude: 77.4014,
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
              <CustomCard>
                <View style={styles.deviceContainer}>
                  <SafomeLogo />
                  <View style={styles.deviceInfo}>
                    {isZoneMode && selectedGeoFence ? (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                        onPress={() => setShowZoneList(!showZoneList)}>
                        <Text style={styles.deviceName}>
                          {selectedGeoFence.name}
                        </Text>
                        <MaterialIcons
                          name={
                            showZoneList
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
                        onPress={() => setShowZoneList(!showZoneList)}>
                        <Text style={styles.deviceName}>
                          {deviceData?.data?.deviceName}
                        </Text>
                        <MaterialIcons
                          name={
                            showZoneList
                              ? 'keyboard-arrow-up'
                              : 'keyboard-arrow-down'
                          }
                          color="white"
                          size={20}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {showZoneList && renderZoneList()}
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
    padding: DimensionConstants.twelve,
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
    marginTop: DimensionConstants.ten,
  },
  iconButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
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
  selectZoneText: {fontSize: DimensionConstants.fifteen, fontWeight: '500'},
  noGeofenceText: {
    textAlign: 'center',
    color: 'black',
    fontSize: DimensionConstants.fifteen,
    fontWeight: '500',
  },
  addZoneButton: {flexDirection: 'row', gap: 10, marginTop: 20},
  addZoneText: {fontSize: 15},
  zoneList: {padding: 10},
  zoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  zoneListContainer: {
    padding: DimensionConstants.ten,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent white background
    borderRadius: DimensionConstants.ten,
    marginTop: DimensionConstants.ten,
  },
  addZoneButton: {
    marginBottom: DimensionConstants.ten, // Space below the button
  },
  addZoneGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DimensionConstants.eight,
    paddingHorizontal: DimensionConstants.fifteen,
    borderRadius: DimensionConstants.eight,
  },
  addZoneText: {
    fontSize: DimensionConstants.fifteen,
    color: '#fff',
    fontWeight: '600',
    marginLeft: DimensionConstants.ten,
  },
  zoneList: {
    paddingVertical: DimensionConstants.five,
  },
  zoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DimensionConstants.eight,
    paddingHorizontal: DimensionConstants.ten,
    backgroundColor: '#f8f9fa', // Light gray background for items
    borderRadius: DimensionConstants.eight,
    marginVertical: DimensionConstants.three,
  },
  zoneItemButton: {
    flex: 1,
    paddingVertical: DimensionConstants.five,
  },
  zoneItemText: {
    fontSize: DimensionConstants.fifteen,
    color: '#212529',
    fontWeight: '500',
  },
  deleteButton: {
    padding: DimensionConstants.five,
  },
  noGeofenceText: {
    textAlign: 'center',
    color: '#666',
    fontSize: DimensionConstants.fifteen,
    paddingVertical: DimensionConstants.ten,
    fontStyle: 'italic',
  },
});

export default CustomMapCard;
