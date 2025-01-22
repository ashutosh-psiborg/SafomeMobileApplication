import React, {useState, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {View, Text, StyleSheet, ScrollView, Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {DimensionConstants, height} from '../../constants/DimensionConstants';
import SafomeLogo from '../../assets/icons/SafomeLogo';
import MainBackground from '../../components/MainBackground';
import NotificationIcon from '../../assets/icons/NotificationIcon';
import Spacing from '../../components/Spacing';
import AddressIcon from '../../assets/icons/AddressIcon';

Geocoder.init('AIzaSyBrsCdS1KEJ9QDOgnl5gwnemCuLJDKzp9Y');

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});

        Geocoder.from(latitude, longitude)
          .then(json => {
            const address = json.results[0].formatted_address;
            setPlaceName(address);
          })
          .catch(error => console.warn('Geocoding Error:', error));
      },
      error => {
        console.log('Error getting location:', error);
        setErrorMsg(error.message);
      },
      {enableHighAccuracy: true, timeout: 60000, maximumAge: 1000},
    );
  }, []);

  return (
    <MainBackground>
      <ScrollView>
        <View style={styles.header}>
          <SafomeLogo />
          <NotificationIcon />
        </View>
        <Spacing height={DimensionConstants.twentyFour} />

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <View
          style={{flexDirection: 'row', maxWidth: '70%',alignItems :'center'}}>
          <AddressIcon />
          <Text style={styles.placeText}>{placeName}</Text>
        </View>
        {location ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <Marker coordinate={location} title="Your Location" />
            </MapView>
          </View>
        ) : (
          <Text style={styles.loading}>Fetching location...</Text>
        )}

        <Text>Hello</Text>
      </ScrollView>
    </MainBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding :5
  },
  mapContainer: {
    borderRadius: 20,
    height: height * 0.7,
    overflow: 'hidden',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  placeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  loading: {
    textAlign: 'center',
    marginVertical: 10,
  },
});
