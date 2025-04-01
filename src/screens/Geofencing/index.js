import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import MapView, {Circle, Marker, Polygon} from 'react-native-maps';
import {Slider} from '@miblanchard/react-native-slider';
import {Portal, Modal} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../utils/ApiService';
import MapViewClustering from 'react-native-map-clustering';

const API_KEY = 'AIzaSyBG-dIBYSEPQMgQ'; // Ensure this is your full, valid Google Maps API key

const GEO_FENCE_API_URL =
  'http://localhost:8002/api/v1/geoFence/create/67dbe8ecf0bc81719bbd1aa5';

const GeofenceScreen = ({navigation}) => {
  const [nameZoneModal, setNameZoneModal] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState('');
  const [geofence, setGeofence] = useState({
    type: null,
    circle: {latitude: null, longitude: null, radius: 500},
    polygon: [],
  });
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const initialRegion = {
    latitude: 28.502291,
    longitude: 77.401863,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  };

  const mapRef = useRef(null);
  const mutation = useMutation({
    mutationFn: payload =>
      fetcher({
        method: 'POST',
        url: '/geoFence/create/67ebc593372de1221923f24d',
        data: payload,
      }),
    onSuccess: () => {
      Alert.alert('Success', 'Device added successfully!');
      refetch();
      setInputModalVisible(false);
    },
    onError: error => {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to add device.',
      );
    },
  });
  const mapPressHandler = e => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    console.log('Map pressed at:', latitude, longitude);
    if (geofence.type === 'Polygon') {
      setUndoStack([...undoStack, geofence.polygon]);
      setRedoStack([]);
      setGeofence({
        type: 'Polygon',
        polygon: [...geofence.polygon, {latitude, longitude}],
      });
    } else if (geofence.type === 'Circle') {
      const newCircle = {
        type: 'Circle',
        circle: {
          latitude,
          longitude,
          radius: geofence.circle.radius || 500,
        },
      };
      setGeofence(newCircle);
      console.log('Updated geofence:', newCircle);
    }
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack.pop();
      setRedoStack([...redoStack, geofence.polygon]);
      setGeofence({...geofence, polygon: previousState});
      setUndoStack([...undoStack]);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setUndoStack([...undoStack, geofence.polygon]);
      setGeofence({...geofence, polygon: nextState});
      setRedoStack([...redoStack]);
    }
  };

  const saveGeofence = async geofenceName => {
    let payload;
    if (geofence.type === 'Circle') {
      payload = {
        name: geofenceName,
        type: geofence.type,
        location: {
          type: 'Point',
          coordinates: [geofence.circle.longitude, geofence.circle.latitude], // [longitude, latitude] as per GeoJSON
        },
        radius: geofence.circle.radius,
      };
    } else if (geofence.type === 'Polygon') {
      // Assuming the API might also support polygons; adjust if it only supports circles
      payload = {
        name: geofenceName,
        type: geofence.type,
        location: {
          type: 'Polygon',
          coordinates: [
            geofence.polygon.map(point => [point.longitude, point.latitude]),
          ], // Array of [longitude, latitude]
        },
      };
    }

    console.log('Saving geofence payload:', payload);

    try {
      // const response = await axios.post(GEO_FENCE_API_URL, payload, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      // console.log('API response:', response.data);
      // Alert.alert('Success', 'Geofence created successfully!');
      // setNameZoneModal(false);
      // navigation.goBack();
      mutation.mutate(payload);
    } catch (error) {
      console.error(
        'Error saving geofence:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', error || 'Failed to save geofence.');
    }
  };

  useEffect(() => {
    if (searchedLocation) {
      const coords = searchedLocation.geometry.location;
      mapRef.current.animateToRegion(
        {
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        1000,
      );
    }
  }, [searchedLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider="google"
        onDoublePress={() => console.log('double press')}
        onPress={mapPressHandler}
        mapType="satellite"
        zoomTapEnabled={!geofence.type}
        toolbarEnabled={true}
        initialRegion={initialRegion}
        style={styles.map}>
        {searchedLocation && (
          <Marker
            coordinate={{
              latitude: searchedLocation.geometry.location.lat,
              longitude: searchedLocation.geometry.location.lng,
            }}
            pinColor="blue"
          />
        )}
        {geofence.type === 'Polygon' && geofence.polygon.length > 0 && (
          <Polygon
            coordinates={geofence.polygon}
            strokeColor="green"
            fillColor="rgba(0, 255, 0, 0.2)"
            strokeWidth={2}
          />
        )}
        {geofence.type === 'Circle' &&
          geofence.circle.latitude &&
          geofence.circle.longitude && (
            <>
              <Circle
                center={{
                  latitude: geofence.circle.latitude,
                  longitude: geofence.circle.longitude,
                }}
                radius={geofence.circle.radius}
                strokeColor="green"
                fillColor="rgba(0, 255, 0, 0.2)"
                strokeWidth={2}
              />
              <Marker
                pinColor="green"
                coordinate={{
                  latitude: geofence.circle.latitude,
                  longitude: geofence.circle.longitude,
                }}
                draggable
                onDragEnd={e =>
                  setGeofence({
                    ...geofence,
                    circle: {
                      ...geofence.circle,
                      latitude: e.nativeEvent.coordinate.latitude,
                      longitude: e.nativeEvent.coordinate.longitude,
                    },
                  })
                }
              />
              <Marker
                style={{display: 'none'}}
                pinColor="green"
                coordinate={{
                  latitude: geofence.circle.latitude,
                  longitude:
                    geofence.circle.longitude + geofence.circle.radius / 87999,
                }}
                draggable
                onDrag={e => {
                  const newRadius =
                    Math.sqrt(
                      Math.pow(
                        e.nativeEvent.coordinate.latitude -
                          geofence.circle.latitude,
                        2,
                      ) +
                        Math.pow(
                          e.nativeEvent.coordinate.longitude -
                            geofence.circle.longitude,
                          2,
                        ),
                    ) * 111320;
                  setGeofence({
                    ...geofence,
                    circle: {...geofence.circle, radius: newRadius},
                  });
                }}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={32}
                  color="green"
                />
              </Marker>
            </>
          )}
        {geofence.type === 'Polygon' &&
          geofence.polygon.map((item, index) => (
            <Marker
              key={index}
              pinColor="green"
              coordinate={item}
              draggable
              onDragEnd={e => {
                const newPolygon = [...geofence.polygon];
                newPolygon[index] = e.nativeEvent.coordinate;
                setGeofence({...geofence, polygon: newPolygon});
              }}
            />
          ))}
      </MapView>
      <View style={styles.searchContainer}>
        <GooglePlacesInput onLocationSelect={setSearchedLocation} />
      </View>
      <NameZoneModal
        visible={nameZoneModal}
        onConfirm={saveGeofence}
        closeModal={() => setNameZoneModal(false)}
      />
      <FloatingActions
        geofence={geofence}
        setGeofence={setGeofence}
        undo={undo}
        redo={redo}
        saveGeofence={() => setNameZoneModal(true)}
      />
    </View>
  );
};

const FloatingActions = ({geofence, setGeofence, undo, redo, saveGeofence}) => {
  const [circleRadius, setCircleRadius] = useState(500);
  const [actionBarEnabled, setActionBarEnabled] = useState(true);

  const floatingOptions = [
    {
      title: 'Circle',
      icon: 'shape-circle-plus',
      action: () => {
        setGeofence({
          type: 'Circle',
          circle: {latitude: null, longitude: null, radius: circleRadius},
        });
        setActionBarEnabled(false);
      },
    },
    {
      title: 'Polygon',
      icon: 'shape-polygon-plus',
      action: () => {
        setGeofence({type: 'Polygon', polygon: []});
        setActionBarEnabled(false);
      },
    },
  ];

  return (
    <View style={styles.floatingContainer}>
      <View style={styles.floatingActions}>
        <View style={styles.actionButtons}>
          {actionBarEnabled ? (
            floatingOptions.map(({title, icon, action}, index) => (
              <TouchableOpacity
                key={index}
                onPress={action}
                style={styles.floatingOption}>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionText}>{title}</Text>
                </View>
                <View style={styles.optionIconContainer}>
                  <MaterialCommunityIcons name={icon} size={28} color="white" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity onPress={saveGeofence} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
          <View style={styles.controlButtons}>
            <TouchableOpacity
              onPress={() => setActionBarEnabled(!actionBarEnabled)}
              style={styles.toggleButton}>
              <MaterialIcons
                name={actionBarEnabled ? 'close' : 'add'}
                size={24}
                color="white"
              />
            </TouchableOpacity>
            {geofence.type === 'Polygon' && (
              <>
                <TouchableOpacity onPress={redo} style={styles.undoRedoButton}>
                  <MaterialCommunityIcons
                    name="redo-variant"
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={undo} style={styles.undoRedoButton}>
                  <MaterialCommunityIcons
                    name="undo-variant"
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        {geofence.type === 'Circle' && (
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Radius</Text>
            <View style={styles.sliderRange}>
              <Text style={styles.sliderRangeText}>50</Text>
              <Text style={styles.sliderRangeText}>1000</Text>
            </View>
            <Slider
              minimumTrackTintColor="#3498db"
              value={circleRadius}
              minimumValue={50}
              maximumValue={1000}
              trackStyle={styles.sliderTrack}
              thumbStyle={styles.sliderThumb}
              onValueChange={value => {
                setCircleRadius(value[0]);
                setGeofence({
                  ...geofence,
                  circle: {...geofence.circle, radius: value[0]},
                });
              }}
            />
          </View>
        )}
        {geofence.type && (
          <TouchableOpacity
            onPress={saveGeofence}
            style={[
              styles.createButton,
              (geofence.type === 'Polygon' && geofence.polygon.length < 3) ||
              (geofence.type === 'Circle' &&
                !geofence.circle.latitude &&
                !geofence.circle.longitude)
                ? styles.disabledButton
                : null,
            ]}
            disabled={
              (geofence.type === 'Polygon' && geofence.polygon.length < 3) ||
              (geofence.type === 'Circle' &&
                !geofence.circle.latitude &&
                !geofence.circle.longitude)
            }>
            <Text style={styles.createButtonText}>Create Geofence</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const NameZoneModal = ({visible, onConfirm, closeModal}) => {
  const [newName, setNewName] = useState('');

  return (
    <Portal>
      <Modal visible={visible} onDismiss={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={closeModal}
              style={styles.modalCloseButton}>
              <MaterialIcons name="close" size={24} color="green" />
            </TouchableOpacity>
            <View style={styles.modalIconContainer}>
              <MaterialIcons
                name="drive-file-rename-outline"
                size={28}
                color="#3498db"
              />
            </View>
            <Text style={styles.modalTitle}>Geofence Name</Text>
            <Text style={styles.modalSubtitle}>
              Please give a name for your geofence.
            </Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              style={styles.modalInput}
              placeholder="Geofence Name"
            />
            <TouchableOpacity
              onPress={() => onConfirm(newName)}
              style={[
                styles.modalButton,
                newName.length === 0 ? styles.disabledButton : null,
              ]}
              disabled={newName.length === 0}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeModal}
              style={styles.modalCancelButton}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const GooglePlacesInput = ({onLocationSelect}) => {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPlaces = async input => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${API_KEY}`;
    try {
      setLoading(true);
      const response = await axios.get(url);
      setPlaces(response.data.predictions);
      setShowResult(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCoordinates = async placeId => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;
    try {
      setLoading(true);
      const response = await axios.get(url);
      setQuery(response.data.result.name);
      setShowResult(false);
      onLocationSelect(response.data.result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.searchInputContainer}>
      <View style={styles.searchInputWrapper}>
        <TextInput
          placeholder="Search place..."
          placeholderTextColor="black"
          style={styles.searchInput}
          value={query}
          onChangeText={text => {
            setQuery(text);
            if (text.length > 2) fetchPlaces(text);
          }}
        />
        {loading ? (
          <ActivityIndicator
            style={styles.searchIcon}
            size="small"
            color="green"
          />
        ) : query.length > 0 ? (
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={() => {
              setQuery('');
              setPlaces([]);
              setShowResult(false);
            }}>
            <MaterialIcons name="close" size={24} color="green" />
          </TouchableOpacity>
        ) : (
          <MaterialIcons
            name="manage-search"
            size={24}
            color="black"
            style={styles.searchIcon}
          />
        )}
      </View>
      {showResult && places.length > 0 && (
        <FlatList
          data={places}
          keyExtractor={item => item.place_id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.searchResultItem}
              onPress={() => getCoordinates(item.place_id)}>
              <MaterialIcons name="navigate-next" size={20} color="white" />
              <Text style={styles.searchResultText}>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={styles.searchResults}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {height: '100%', width: '100%'},
  searchContainer: {
    position: 'absolute',
    top: 16,
    width: '100%',
    paddingHorizontal: 16,
  },
  searchInputContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 24,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    color: 'white',
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 48,
    backgroundColor: '#2980b9',
    borderRadius: 16,
  },
  searchIcon: {position: 'absolute', right: 16},
  searchResults: {marginTop: 8},
  searchResultItem: {flexDirection: 'row', padding: 8},
  searchResultText: {color: 'black'},
  floatingContainer: {position: 'absolute', bottom: 0, right: 0, width: '100%'},
  floatingActions: {padding: 16, alignItems: 'flex-end'},
  actionButtons: {gap: 12},
  floatingOption: {flexDirection: 'row', alignItems: 'center', gap: 8},
  optionTextContainer: {
    backgroundColor: '#3498db',
    width: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  optionText: {color: 'white', textAlign: 'right'},
  optionIconContainer: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {backgroundColor: '#2ecc71', padding: 16, borderRadius: 9999},
  saveButtonText: {color: 'white', fontWeight: 'bold'},
  controlButtons: {flexDirection: 'row', gap: 16, marginTop: 12},
  toggleButton: {backgroundColor: '#3498db', padding: 12, borderRadius: 8},
  undoRedoButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 8,
    borderRadius: 9999,
  },
  sliderContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sliderLabel: {fontSize: 16, fontWeight: '600', color: '#333'},
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  sliderRangeText: {color: '#333'},
  sliderTrack: {height: 6, backgroundColor: 'gray', borderRadius: 10},
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  createButton: {backgroundColor: '#2ecc71', padding: 16, borderRadius: 12},
  createButtonText: {color: 'white', textAlign: 'center', fontWeight: '600'},
  disabledButton: {backgroundColor: '#bdc3c7'},
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContainer: {padding: 16},
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
  },
  modalCloseButton: {position: 'absolute', top: 16, right: 16},
  modalIconContainer: {
    padding: 16,
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderRadius: 9999,
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  modalSubtitle: {color: '#666'},
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
  },
  modalButton: {
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  modalButtonText: {color: 'white', textAlign: 'center', fontWeight: '600'},
  modalCancelButton: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  modalCancelButtonText: {
    color: '#3498db',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default GeofenceScreen;
