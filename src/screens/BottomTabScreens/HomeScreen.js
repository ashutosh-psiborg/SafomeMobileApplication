import React, {useState, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {DimensionConstants, height} from '../../constants/DimensionConstants';
import SafomeLogo from '../../assets/icons/SafomeLogo';
import MainBackground from '../../components/MainBackground';
import NotificationIcon from '../../assets/icons/NotificationIcon';
import Spacing from '../../components/Spacing';
import AddressIcon from '../../assets/icons/AddressIcon';
import CustomCard from '../../components/CustomCard';
import RevenueIcon from '../../assets/icons/RevenueIcon';
import {LineChart} from 'react-native-chart-kit';
import {useSelector} from 'react-redux';
import {ImageConstants} from '../../constants/ImageConstants';
import PhoneIcon from '../../assets/icons/PhoneIcon';
import CallIcon from '../../assets/icons/CallIcon';

Geocoder.init('AIzaSyBrsCdS1KEJ9QDOgnl5gwnemCuLJDKzp9Y');
const data = [{id: 1}, {id: 2}, {id: 3}, {id: 4, line: 'no'}];
const HomeScreen = () => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const [location, setLocation] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const dataPoints = [30, 60, 90, 72, 70, 100, 128];
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
    <MainBackground style={{backgroundColor: '#F2F7FC'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SafomeLogo />
          <NotificationIcon />
        </View>
        <Spacing height={DimensionConstants.twentyFour} />
        <View style={styles.addressContainer}>
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
        <Spacing height={DimensionConstants.twentyFour} />
        <Text style={styles.statisticsTitle}>Statistics</Text>

        <View style={styles.cardsContainer}>
          <CustomCard style={{width: DimensionConstants.oneHundredFortyFive}}>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RevenueIcon />
                <Text style={styles.cardTitle}>Heart Rate</Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <LineChart
                  data={{
                    datasets: [
                      {
                        data: dataPoints,
                      },
                    ],
                  }}
                  width={280}
                  height={40}
                  chartConfig={{
                    backgroundColor: 'white',
                    backgroundGradientFrom: 'white',
                    backgroundGradientTo: '#ffffff',
                    color: () => theme.primary,
                    style: {
                      borderRadius: 16,
                      marginLeft: 10,
                    },
                    propsForDots: {
                      display: 'none',
                    },
                  }}
                  bezier
                  withDots={false}
                  withInnerLines={false}
                  withOuterLines={false}
                  withVerticalLabels={false}
                  withHorizontalLabels={false}
                  fromZero={true}
                  style={{
                    marginVertical: 20,
                  }}
                />
              </View>

              <Text style={styles.cardContent}>
                128
                <Text
                  style={{color: '#808080', fontSize: 12, fontWeight: '500'}}>
                  {' '}
                  BPM
                </Text>
              </Text>
              <Text style={{color: '#808080', fontSize: 12, fontWeight: '500'}}>
                01/07 12:47 PM
              </Text>
            </View>
          </CustomCard>
          <View>
            <CustomCard style={{width: DimensionConstants.oneHundredSixtyFour}}>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RevenueIcon />
                  <Text style={styles.cardTitle}>Today Calls</Text>
                </View>
                <Text style={styles.cardContent}>76</Text>
              </View>
            </CustomCard>
            <Spacing height={DimensionConstants.ten} />
            <CustomCard>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RevenueIcon />
                  <Text style={styles.cardTitle}>Blood Oxygen</Text>
                </View>
                <Text style={styles.cardContent}>98%</Text>
              </View>
            </CustomCard>
          </View>
        </View>
        <Spacing height={DimensionConstants.twentyFour} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.statisticsTitle}>Recent calls</Text>
          <Text style={{color: '#808080', fontSize: 12, fontWeight: '500'}}>
            View all
          </Text>
        </View>
        <Spacing height={DimensionConstants.sixteen} />
        <CustomCard style={{borderRadius: 12}}>
          {data.map(item => (
            <>
              <View
                key={item.id}
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={ImageConstants.girlImage} />
                  <View style={{marginLeft: DimensionConstants.ten}}>
                    <Text style={{fontWeight: '500'}}>Amit Singh</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <CallIcon />
                      <View
                        style={{
                          backgroundColor: '#8B8B8B',
                          height: DimensionConstants.five,
                          width: DimensionConstants.five,
                          borderRadius: DimensionConstants.oneHundred,
                          marginLeft: DimensionConstants.five,
                        }}></View>
                      <Text
                        style={{
                          color: '#8B8B8B',
                          fontSize: 12,
                          fontWeight: '500',
                        }}>
                        {' '}
                        12:47 PM
                      </Text>
                    </View>
                  </View>
                </View>

                <PhoneIcon />
              </View>
              {item?.line === 'no' ? null : (
                <View
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    height: DimensionConstants.two,
                    width: DimensionConstants.twoHundredSixty,
                    alignSelf: 'flex-end',
                    marginVertical: DimensionConstants.five,
                  }}></View>
              )}
            </>
          ))}
        </CustomCard>
        <Spacing height={DimensionConstants.twentyFour} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.statisticsTitle}>Recent Notifications</Text>
          <Text style={{color: '#808080', fontSize: 12, fontWeight: '500'}}>
            View all
          </Text>
        </View>
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
    padding: 5,
  },
  addressContainer: {
    flexDirection: 'row',
    maxWidth: '70%',
    alignItems: 'center',
  },
  mapContainer: {
    borderRadius: 20,
    height: height * 0.65,
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
  statisticsTitle: {
    fontWeight: '700',
    fontSize: DimensionConstants.fourteen,
  },
  cardsContainer: {
    marginTop: DimensionConstants.sixteen,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: DimensionConstants.three,
  },

  cardTitle: {
    fontWeight: '500',
    fontSize: 12,
    marginLeft: DimensionConstants.five,
  },
  cardContent: {
    fontSize: 24,
    fontWeight: '500',
    marginTop: 5,
  },
});
