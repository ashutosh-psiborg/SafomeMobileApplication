import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Circle,
  Polygon,
} from 'react-native-maps';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {DimensionConstants} from '../constants/DimensionConstants';
import {useState} from 'react';
import CustomCard from './CustomCard';
import Loader from './Loader';
import LinearGradient from 'react-native-linear-gradient'; // For gradient buttons

const CustomMapCard = ({
  location,
  isGeoFenceLoading,
  geoFenceData,
  selectedGeoFence,
  handleGeoFenceSelect,
  mapRef,
  mapKey,
  mapRegion,
  onLiveLocationPress,
}) => {
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);

  return (
    <CustomCard style={styles.mapContainer}>
      {location ? (
        <View style={styles.mapWrapper}>
          {/* Map View */}
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

          {/* Floating Buttons */}
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
            <TouchableOpacity
              onPress={() => setShowZoneDropdown(!showZoneDropdown)}>
              <LinearGradient
                colors={['#28a745', '#1e7e34']}
                style={styles.floatingButton}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <Icon name="layers" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Zone Dropdown */}
          {showZoneDropdown && (
            <View style={styles.dropdownContainerFloating}>
              {!isGeoFenceLoading && geoFenceData?.data?.results?.length > 0 ? (
                <Dropdown
                  data={geoFenceData.data.results.map(item => ({
                    label: item.name,
                    value: item._id,
                  }))}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Zone"
                  style={styles.dropdown}
                  containerStyle={styles.dropdownInnerContainer}
                  selectedTextStyle={styles.selectedText}
                  placeholderStyle={styles.placeholderText}
                  onChange={item => {
                    handleGeoFenceSelect(item);
                    setShowZoneDropdown(false);
                  }}
                />
              ) : (
                <Text style={styles.noGeofenceText}>No Geofence Available</Text>
              )}
            </View>
          )}
        </View>
      ) : (
        <Loader />
      )}
    </CustomCard>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    borderRadius: DimensionConstants.twenty,
    height: DimensionConstants.twoHundredSixty,
    overflow: 'hidden',
    padding: 0,
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  map: {
    height: '100%',
    width: '100%',
    borderRadius: DimensionConstants.twenty, // Match container radius
  },
  floatingButtonsContainer: {
    position: 'absolute',
    top: DimensionConstants.ten,
    right: DimensionConstants.ten,
    alignItems: 'center',
    gap: DimensionConstants.ten, // Space between buttons
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
  dropdownContainerFloating: {
    position: 'absolute',
    top: DimensionConstants.ten,
    left: DimensionConstants.ten,
    right: DimensionConstants.ten,
    backgroundColor: '#fff',
    borderRadius: DimensionConstants.ten,
    padding: DimensionConstants.ten,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: DimensionConstants.eight,
    padding: DimensionConstants.five,
    backgroundColor: '#f8f9fa',
  },
  dropdownInnerContainer: {
    borderRadius: DimensionConstants.eight,
    marginTop: DimensionConstants.five,
    backgroundColor: '#fff',
  },
  selectedText: {
    fontSize: DimensionConstants.fourteen,
    color: '#212529',
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: DimensionConstants.fourteen,
    color: '#6c757d',
  },
  noGeofenceText: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: DimensionConstants.fourteen,
    fontStyle: 'italic',
  },
});

export default CustomMapCard;
