import React, {useState, useEffect, useRef} from 'react';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
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
import CardStack from '../../components/CardStack';
import RightArrowIcon from '../../assets/icons/RightArrowIcon';

Geocoder.init('AIzaSyBrsCdS1KEJ9QDOgnl5gwnemCuLJDKzp9Y');
const HomeScreen = () => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const toggleCards = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const data = [{id: 1}, {id: 2}, {id: 3}, {id: 4, line: 'no'}];

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
      {enableHighAccuracy: true, timeout: 200000, maximumAge: 1000},
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
          <CustomCard style={{width: '48%'}}>
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
                  width={320}
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
          <TouchableOpacity onPress={toggleCards}>
            <Text style={{color: '#808080', fontSize: 12, fontWeight: '500'}}>
              View all
            </Text>
          </TouchableOpacity>
        </View>
        <CardStack
          expanded={expanded}
          animation={animation}
          toggleCards={toggleCards}
        />
        <Spacing height={DimensionConstants.twentyFour} />

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.statisticsTitle}>My contacts</Text>
          <TouchableOpacity onPress={toggleCards}>
            <Text style={{color: '#808080', fontSize: 12, fontWeight: '500'}}>
              View all
            </Text>
          </TouchableOpacity>
        </View>
        <Spacing height={DimensionConstants.ten} />

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <CustomCard
            style={{
              width: '48%',
              backgroundColor: theme.primary,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image source={ImageConstants.avatar} style={styles.imageOne} />
              <Image source={ImageConstants.avatar2} style={styles.imageTwo} />
              <Image source={ImageConstants.avatar3} style={styles.imageTwo} />
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: DimensionConstants.fourteen,
                  fontWeight: '500',
                  marginLeft: DimensionConstants.ten,
                }}>
                +57
              </Text>
            </View>
            <Spacing height={DimensionConstants.ten} />
            <Text
              style={{
                color: theme.background,
                fontSize: DimensionConstants.fourteen,
                fontWeight: '500',
              }}>
              Family
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: theme.background,
                  fontSize: DimensionConstants.twentyEight,
                  fontWeight: '500',
                }}>
                60
              </Text>
              <RightArrowIcon />
            </View>
          </CustomCard>
          <CustomCard
            style={{
              width: '48%',
              backgroundColor: '#FE605D',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={ImageConstants.avatar} style={styles.imageOne} />
              <Image source={ImageConstants.avatar2} style={styles.imageTwo} />
              <Image source={ImageConstants.avatar3} style={styles.imageTwo} />
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: DimensionConstants.fourteen,
                  fontWeight: '500',
                  marginLeft: DimensionConstants.ten,
                }}>
                +52
              </Text>
            </View>
            <Spacing height={DimensionConstants.ten} />

            <Text
              style={{
                color: theme.background,
                fontSize: DimensionConstants.fourteen,
                fontWeight: '500',
              }}>
              Friends
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: theme.background,
                  fontSize: DimensionConstants.twentyEight,
                  fontWeight: '500',
                }}>
                55
              </Text>
              <RightArrowIcon />
            </View>
          </CustomCard>
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
  imageTwo: {
    height: DimensionConstants.thirtyTwo,
    width: DimensionConstants.thirtyTwo,
    marginLeft: -DimensionConstants.fifteen,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 50,
  },
  imageOne: {
    height: DimensionConstants.thirtyTwo,
    width: DimensionConstants.thirtyTwo,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 50,
  },
});
