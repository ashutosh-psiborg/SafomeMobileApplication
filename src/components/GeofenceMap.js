import React, {useRef, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Circle, Marker, Polygon} from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DimensionConstants} from '../constants/DimensionConstants';

const GeofenceMap = ({geofence, setGeofence, searchedLocation}) => {
  const initialRegion = {
    latitude: 28.502291,
    longitude: 77.401863,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  };

  const mapRef = useRef(null);

  const mapPressHandler = e => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    console.log('Map pressed at:', latitude, longitude);
    if (geofence.type === 'Polygon') {
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
  );
};

const styles = StyleSheet.create({
  map: {height: '100%', width: '100%'},
});

export default GeofenceMap;
