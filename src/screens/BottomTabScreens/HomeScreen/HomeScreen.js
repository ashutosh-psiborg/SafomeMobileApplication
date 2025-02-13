import React, {useState, useEffect, useRef} from 'react';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import MainBackground from '../../../components/MainBackground';
import Spacing from '../../../components/Spacing';
import AddressIcon from '../../../assets/icons/AddressIcon';
import CustomCard from '../../../components/CustomCard';
import RevenueIcon from '../../../assets/icons/RevenueIcon';
import {LineChart} from 'react-native-chart-kit';
import {useSelector} from 'react-redux';
import {ImageConstants} from '../../../constants/ImageConstants';
import PhoneIcon from '../../../assets/icons/PhoneIcon';
import CallIcon from '../../../assets/icons/CallIcon';
import CardStack from '../../../components/CardStack';
import RightArrowIcon from '../../../assets/icons/RightArrowIcon';
import LogoHeader from '../../../components/LogoHeader';
import HomeMidHeader from '../../../components/HomeMidHeader';
import RefreshIcon from '../../../assets/icons/RefreshIcon';
import {HomeScreenStyles} from './Styles/HomeScreenStyles';
import StatisticsCards from '../../../components/StatisticsCards';
import ContactCards from '../../../components/ContactCards';

// Geocoder.init('AIzaSyBrsCdS1KEJ9QDOgnl5gwnemCuLJDKzp9Y');
const HomeScreen = () => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [location, setLocation] = useState(null);
  const dataPoints = [30, 60, 90, 72, 70, 100, 128];
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
  const styles = HomeScreenStyles(theme);

  // useEffect(() => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       const {latitude, longitude} = position.coords;
  //       setLocation({latitude, longitude});

  //       // Geocoder.from(latitude, longitude)
  //       //   .then(json => {
  //       //     const address = json.results[0].formatted_address;
  //       //     setPlaceName(address);
  //       //   })
  //       //   .catch(error => console.warn('Geocoding Error:', error));
  //     },
  //     error => {
  //       console.log('Error getting location:', error);
  //     },
  //     {enableHighAccuracy: true, timeout: 200000, maximumAge: 1000},
  //   );
  // }, []);

  return (
    <MainBackground style={{backgroundColor: theme.otpBox}}>
      <LogoHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacing height={DimensionConstants.twentyFour} />
        <View style={styles.addressContainer}>
          <View style={styles.rowContainer}>
            <AddressIcon />
            <Text style={styles.placeText}>Sector 137 , lets connect</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text
              style={{
                fontSize: DimensionConstants.twelve,
                fontWeight: '500',
                color: 'rgba(0, 0, 0, 0.5)',
                marginRight: DimensionConstants.ten,
              }}>
              Refresh
            </Text>
            <TouchableOpacity>
              <RefreshIcon />
            </TouchableOpacity>
          </View>
        </View>
        <Spacing height={DimensionConstants.fifteen} />
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location ? location.latitude : 28.50704765,
              longitude: location ? location.longitude : 77.40246858,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker
              coordinate={
                location
                  ? location
                  : {latitude: 28.50703231, longitude: 77.40216977}
              }
              title="Your Location"
            />
          </MapView>
        </View>

        <Spacing height={DimensionConstants.twentyFour} />
        <HomeMidHeader title={'Statistics'} showViewAll={false} />
        <StatisticsCards />
        <Spacing height={DimensionConstants.twentyFour} />
        <HomeMidHeader title={'Recent calls'} />
        <Spacing height={DimensionConstants.sixteen} />
        <CustomCard
          style={{borderRadius: DimensionConstants.twelve, paddingRight: 0}}>
          {data.map(item => (
            <>
              <View key={item.id} style={styles.callContainer}>
                <View style={styles.rowContainer}>
                  <Image
                    source={ImageConstants.girlImage}
                    style={{
                      height: DimensionConstants.fortyTwo,
                      width: DimensionConstants.fortyTwo,
                      borderRadius: DimensionConstants.twentyOne,
                    }}
                  />
                  <View style={{marginLeft: DimensionConstants.ten}}>
                    <Text style={{fontWeight: '500'}}>Amit Singh</Text>
                    <View style={styles.rowContainer}>
                      <CallIcon />
                      <View
                        style={{
                          backgroundColor: theme.darkGrey,
                          height: DimensionConstants.five,
                          width: DimensionConstants.five,
                          borderRadius: DimensionConstants.oneHundred,
                          marginLeft: DimensionConstants.five,
                        }}></View>
                      <Text
                        style={{
                          color: theme.darkGrey,
                          fontSize: DimensionConstants.twelve,
                          fontWeight: '500',
                        }}>
                        {' '}
                        12:47 PM
                      </Text>
                    </View>
                  </View>
                </View>

                <PhoneIcon marginRight={DimensionConstants.fifteen} />
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
        <HomeMidHeader title={'Recent Notifications'} onPress={toggleCards} />

        <CardStack
          expanded={expanded}
          animation={animation}
          toggleCards={toggleCards}
        />
        <Spacing height={DimensionConstants.twentyFour} />

        <HomeMidHeader title={'My contacts'} />
        <Spacing height={DimensionConstants.ten} />

        <ContactCards />
      </ScrollView>
    </MainBackground>
  );
};

export default HomeScreen;
