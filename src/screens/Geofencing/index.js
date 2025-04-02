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
import {DimensionConstants} from '../../constants/DimensionConstants';

const API_KEY = 'AIzaSyBwDaERJWZV7h28D67mRXG-dIBYSEPQMgQ'; // Your Google Maps API key

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
    mutationFn: async payload =>
      await fetcher({
        method: 'POST',
        url: '/geoFence/create/67ebc593372de1221923f24d',
        data: payload,
      }),
    onSuccess: () => {
      Alert.alert('Success', 'Geofence added successfully!');
      setNameZoneModal(false);
    },
    onError: error => {
      Alert.alert('Error', error.message || 'Failed to add device.');
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
      console.log('Updated geofence:', geofence);
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
          coordinates: [geofence.circle.longitude, geofence.circle.latitude],
        },
        radius: geofence.circle.radius,
      };
    } else if (geofence.type === 'Polygon') {
      const polygonCoords = geofence.polygon.map(point => [
        point.longitude,
        point.latitude,
      ]);
      if (
        polygonCoords[0][0] !== polygonCoords[polygonCoords.length - 1][0] ||
        polygonCoords[0][1] !== polygonCoords[polygonCoords.length - 1][1]
      ) {
        polygonCoords.push(polygonCoords[0]);
      }
      payload = {
        name: geofenceName,
        type: geofence.type,
        location: {
          type: 'Polygon',
          coordinates: polygonCoords,
        },
      };
    }

    console.log('Saving geofence payload:', JSON.stringify(payload, null, 2));

    try {
      await mutation.mutateAsync(payload);
    } catch (error) {
      console.error('Error saving geofence:', error.response.data.message);
      Alert.alert(
        'Failed',
        error.response.data.message || 'Failed to save geofence.',
      );
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
            strokeWidth={DimensionConstants.two}
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
                strokeWidth={DimensionConstants.two}
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
                  size={DimensionConstants.thirty}
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

  const floatingOptions = [
    {
      title: 'Circle',
      icon: 'shape-circle-plus',
      action: () => {
        setGeofence({
          type: 'Circle',
          circle: {latitude: null, longitude: null, radius: circleRadius},
        });
      },
    },
    {
      title: 'Polygon',
      icon: 'shape-polygon-plus',
      action: () => {
        setGeofence({type: 'Polygon', polygon: []});
      },
    },
  ];

  return (
    <View style={styles.floatingContainer}>
      <View style={styles.floatingActions}>
        <View style={styles.actionButtons}>
          {floatingOptions.map(({title, icon, action}, index) => (
            <TouchableOpacity
              key={index}
              onPress={action}
              style={styles.floatingOption}>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>{title}</Text>
              </View>
              <View style={styles.optionIconContainer}>
                <MaterialCommunityIcons
                  name={icon}
                  size={DimensionConstants.twentyFour}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          ))}
          {geofence.type === 'Polygon' && (
            <View style={styles.undoRedoContainer}>
              <TouchableOpacity onPress={undo} style={styles.undoRedoButton}>
                <MaterialCommunityIcons
                  name="undo-variant"
                  size={DimensionConstants.twenty}
                  color="white"
                />
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity onPress={redo} style={styles.undoRedoButton}>
                <MaterialCommunityIcons
                  name="redo-variant"
                  size={DimensionConstants.twenty}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {geofence.type === 'Circle' && (
          <View style={styles.sliderContainer}>
            <View style={styles.sliderRange}>
              <Text style={styles.sliderLabel}>Radius</Text>
              <Text style={styles.sliderRangeText}>
                {Math.floor(circleRadius)}
              </Text>
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
            <View style={styles.modalIconContainer}>
              <MaterialIcons
                name="drive-file-rename-outline"
                size={DimensionConstants.twentyFour}
                color="#3498db"
              />
            </View>
            <Text style={styles.modalTitle}>Geofence Name</Text>
            <Text style={styles.modalSubtitle}>
              Please give a name for your geofence.
            </Text>
            <TextInput
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
            <MaterialIcons
              name="close"
              size={DimensionConstants.twentyFour}
              color="green"
            />
          </TouchableOpacity>
        ) : (
          <MaterialIcons
            name="manage-search"
            size={DimensionConstants.twentyFour}
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
              <MaterialIcons
                name="navigate-next"
                size={DimensionConstants.twenty}
                color="white"
              />
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
    top: DimensionConstants.ten,
    width: '100%',
    paddingHorizontal: DimensionConstants.fifteen,
  },
  searchInputContainer: {
    backgroundColor: '#fff',
    padding: DimensionConstants.fifteen,
    borderRadius: DimensionConstants.twenty,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    color: 'white',
    paddingVertical: DimensionConstants.ten,
    paddingLeft: DimensionConstants.fifteen,
    paddingRight: DimensionConstants.forty,
    backgroundColor: '#2980b9',
    borderRadius: DimensionConstants.fifteen,
  },
  searchIcon: {position: 'absolute', right: DimensionConstants.fifteen},
  searchResults: {marginTop: DimensionConstants.ten},
  searchResultItem: {
    flexDirection: 'row',
    padding: DimensionConstants.ten,
  },
  searchResultText: {color: 'black'},
  floatingContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
  },
  floatingActions: {
    padding: DimensionConstants.fifteen,
    alignItems: 'flex-end',
  },
  actionButtons: {gap: DimensionConstants.ten},
  floatingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DimensionConstants.ten,
  },
  optionTextContainer: {
    backgroundColor: '#3498db',
    width: DimensionConstants.oneHundred,
    paddingVertical: DimensionConstants.ten,
    paddingHorizontal: DimensionConstants.fifteen,
    borderRadius: DimensionConstants.ten,
    alignItems: 'center',
  },
  optionText: {color: 'white', textAlign: 'right'},
  optionIconContainer: {
    backgroundColor: '#3498db',
    padding: DimensionConstants.ten,
    borderRadius: DimensionConstants.ten,
    justifyContent: 'center',
    alignItems: 'center',
  },
  undoRedoContainer: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    paddingHorizontal: DimensionConstants.five,
    marginHorizontal: DimensionConstants.ten,
    borderRadius: DimensionConstants.ten,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: DimensionConstants.ten,
  },
  undoRedoButton: {
    padding: DimensionConstants.ten,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: DimensionConstants.one,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 240, 0.4)',
  },
  sliderContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: DimensionConstants.one,
    borderColor: '#3498db',
    borderRadius: DimensionConstants.ten,
    padding: DimensionConstants.fifteen,
    marginVertical: DimensionConstants.fifteen,
  },
  sliderLabel: {
    fontSize: DimensionConstants.fifteen,
    fontWeight: '600',
    color: '#333',
  },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderRangeText: {color: '#333'},
  sliderTrack: {
    height: DimensionConstants.five,
    backgroundColor: 'gray',
    borderRadius: DimensionConstants.five,
  },
  sliderThumb: {
    width: DimensionConstants.twenty,
    height: DimensionConstants.twenty,
    borderRadius: DimensionConstants.ten,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: DimensionConstants.four,
    borderWidth: DimensionConstants.one,
    borderColor: '#3498db',
  },
  createButton: {
    backgroundColor: '#FF310C',
    padding: DimensionConstants.fifteen,
    borderRadius: DimensionConstants.ten,
    width: '100%',
  },
  createButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  disabledButton: {backgroundColor: '#bdc3c7', width: '100%'},
  modalContainer: {padding: DimensionConstants.fifteen},
  modalContent: {
    backgroundColor: 'white',
    padding: DimensionConstants.twenty,
    borderRadius: DimensionConstants.ten,
    alignItems: 'center',
    gap: DimensionConstants.fifteen,
  },
  modalCloseButton: {
    position: 'absolute',
    top: DimensionConstants.fifteen,
    right: DimensionConstants.fifteen,
  },
  modalIconContainer: {
    padding: DimensionConstants.fifteen,
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderRadius: 9999,
  },
  modalTitle: {
    fontSize: DimensionConstants.fifteen,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {color: '#666'},
  modalInput: {
    width: '100%',
    borderWidth: DimensionConstants.one,
    borderColor: 'gray',
    borderRadius: DimensionConstants.ten,
    padding: DimensionConstants.ten,
    fontSize: DimensionConstants.fifteen,
  },
  modalButton: {
    backgroundColor: '#FF310C',
    padding: DimensionConstants.ten,
    borderRadius: DimensionConstants.ten,
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalCancelButton: {
    borderWidth: DimensionConstants.one,
    borderColor: 'gray',
    padding: DimensionConstants.ten,
    borderRadius: DimensionConstants.ten,
    width: '100%',
  },
  modalCancelButtonText: {
    color: '#3498db',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default GeofenceScreen;
