import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import MapViewClustering from 'react-native-map-clustering';
import MapView, {PROVIDER_GOOGLE, Marker, Circle} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {useQuery} from '@tanstack/react-query';
import fetcher from '../../../utils/ApiService';
import Loader from '../../../components/Loader';
import MainBackground from '../../../components/MainBackground';
import Spacing from '../../../components/Spacing';
import AddressIcon from '../../../assets/icons/AddressIcon';
import RefreshIcon from '../../../assets/icons/RefreshIcon';
import {HomeScreenStyles} from './Styles/HomeScreenStyles';
import StatisticsCards from '../../../components/StatisticsCards';
import HomeMidHeader from '../../../components/HomeMidHeader';
import LogoHeader from '../../../components/LogoHeader';
import {
  DimensionConstants,
  height,
  width,
} from '../../../constants/DimensionConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import CustomCard from '../../../components/CustomCard';
import TimeLineIcon from '../../../assets/icons/TimeLineIcon';
import Slider from '@react-native-community/slider';
import CustomModal from '../../../components/CustomModal';
import CustomButton from '../../../components/CustomButton';

const HomeScreen = ({navigation}) => {
  const [selected, setSelected] = useState('Week');
  const [radius, setRadius] = useState(100); // default 100 meters
  const [radiusInput, setRadiusInput] = useState('100');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [location, setLocation] = useState(null);
  const [mapKey, setMapKey] = useState(0);
  const locationRef = useRef(null);
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = HomeScreenStyles(theme);

  const getSelectedDevice = async () => {
    try {
      const deviceId = await AsyncStorage.getItem('selectedDeviceId');
      setDeviceId(deviceId);
    } catch (error) {
      console.error('Error retrieving device ID:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getSelectedDevice();
      refetchFitness();
      refetchLocation();
    }, [deviceId]),
  );

  const {
    data: fitnessData,
    isLoading: isFitnessLoading,
    refetch: refetchFitness,
  } = useQuery({
    queryKey: ['fitness', selected],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/healthData/${deviceId}`,
      }),
  });

  const {
    data: stepData,
    isLoading: stepLoading,
    refetch: refetchStepData,
  } = useQuery({
    queryKey: ['steps'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getStepData/6907390711`,
      }),
  });

  const {
    data: locationData,
    isLoading: isLocationLoading,
    refetch: refetchLocation,
  } = useQuery({
    queryKey: ['location'],
    queryFn: async () => {
      const response = await fetcher({
        method: 'GET',
        url: `deviceDataResponse/locations/${deviceId}`,
      });
      return response;
    },
    onSuccess: data => {
      const latestLocation = data?.data?.[0];
      if (latestLocation?.latitude && latestLocation?.longitude) {
        const lat = parseFloat(latestLocation?.latitude);
        const long = parseFloat(latestLocation?.longitude);
        if (!isNaN(lat) && !isNaN(long)) {
          const newLocation = {latitude: lat, longitude: long};
          locationRef.current = newLocation;
          setLocation(newLocation);
          setMapKey(prevKey => prevKey + 1);
        }
      }
    },
  });
  console.log('locationData====', locationData?.data);
  useEffect(() => {
    const latestLocation = locationData?.data?.results?.[0];
    if (latestLocation?.latitude && latestLocation?.longitude) {
      const lat = parseFloat(latestLocation?.latitude);
      const long = parseFloat(latestLocation?.longitude);
      if (!isNaN(lat) && !isNaN(long)) {
        const newLocation = {latitude: lat, longitude: long};
        locationRef.current = newLocation;
        setLocation(newLocation);
        setMapKey(prevKey => prevKey + 1);
      }
    }
  }, [locationData]);

  const isWithinGeofence = (lat1, lon1, lat2, lon2, radius = 100) => {
    const toRad = value => (value * Math.PI) / 180;
    const R = 6371000;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radius;
  };

  useEffect(() => {
    if (location && locationData?.data) {
      const insideFence = locationData.data.results.find(item =>
        isWithinGeofence(
          location.latitude,
          location.longitude,
          parseFloat(item.latitude),
          parseFloat(item.longitude),
          100,
        ),
      );
      // if (insideFence) {
      //   Alert.alert(
      //     'Geofence Alert',
      //     `You are within 100 meters of ${insideFence.placeName}`,
      //   );
      // }
    }
  }, [location, locationData]);

  const handleRefresh = async () => {
    await refetchLocation();
    await refetchFitness();
  };

  if (isLocationLoading) {
    return (
      <MainBackground style={{backgroundColor: theme.otpBox}}>
        <Loader />
      </MainBackground>
    );
  }

  if (
    !locationData?.data.results ||
    !Array.isArray(locationData?.data.results) ||
    locationData?.data?.results?.length === 0
  ) {
    return (
      <MainBackground style={{backgroundColor: theme.otpBox}}>
        <LogoHeader onPress={() => navigation.navigate('NotificationScreen')} />
        <View style={{alignItems: 'center'}}>
          <Text style={{color: theme.text, fontSize: 16}}>
            No Data Found, Please Select Device in settings
          </Text>
        </View>
      </MainBackground>
    );
  }

  return (
    <MainBackground style={{backgroundColor: theme.otpBox}}>
      <LogoHeader onPress={() => navigation.navigate('NotificationScreen')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacing height={DimensionConstants.twentyFour} />
        <View style={styles.addressContainer}>
          <View style={styles.rowContainer}>
            <AddressIcon />
            <Text
              style={styles.placeText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {locationData?.data?.results?.[0]?.placeName ||
                'Location not available'}
            </Text>
          </View>
          <View style={styles.refreshContainer}>
            <TouchableOpacity
              onPress={handleRefresh}
              style={styles.refreshButton}>
              <Text style={styles.refreshText}>Refresh</Text>
              <RefreshIcon />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 10, alignItems: 'center'}}>
            {/* <TouchableOpacity
              style={{
                backgroundColor: '#FF310C',
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
              }}
              onPress={() => setIsModalVisible(true)}>
              <Text style={{color: 'white'}}>Set Radius</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        <Spacing height={DimensionConstants.fifteen} />
        <View style={styles.mapContainer}>
          {location ? (
            <MapViewClustering
              key={mapKey}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              clusterColor="#FFB6B6"
              animationEnabled>
              {locationData?.data?.results?.map((item, index) => {
                const lat = parseFloat(item.latitude);
                const long = parseFloat(item.longitude);
                if (!isNaN(lat) && !isNaN(long)) {
                  return (
                    <React.Fragment key={index}>
                      <Marker
                        coordinate={{latitude: lat, longitude: long}}
                        title={item.placeName || 'Location'}
                        description={moment(item.createdAt).format(
                          'DD MMM YYYY, hh:mm A',
                        )}
                      />
                      <Circle
                        center={{latitude: lat, longitude: long}}
                        radius={radius}
                        strokeWidth={1}
                        strokeColor="#FF310C"
                        fillColor="#FFB6B6"
                      />
                    </React.Fragment>
                  );
                }
                return null;
              })}
              <Marker
                coordinate={location}
                title="Your Location"
                pinColor="red"
              />
            </MapViewClustering>
          ) : (
            <Loader />
          )}
        </View>

        <Spacing height={DimensionConstants.ten} />
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#FF310C',
            padding: 10,
            borderRadius: 20,
            marginBottom: 10,
            borderStyle: 'dashed',
            width: width / 2,
            alignItems: 'center',
          }}
          onPress={() => setIsModalVisible(true)}>
          <Text style={{color: '#000', fontWeight: '600'}}>
            + Add geofence details
          </Text>
        </TouchableOpacity>
        {/* <Spacing height={DimensionConstants.ten} /> */}

        <HomeMidHeader
          title={'Recent Location'}
          onPress={() => navigation.navigate('MainApp', {screen: 'Location'})}
        />
        <Spacing height={DimensionConstants.ten} />

        <CustomCard>
          {(showAllLocations
            ? locationData?.data.results
            : locationData?.data?.results?.slice(0, 3)
          ).map((item, index, arr) => (
            <View
              key={index}
              style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <View style={{width: 20, alignItems: 'center'}}>
                <TimeLineIcon />
                {index !== arr.length - 1 && (
                  <View
                    style={{
                      width: 1,
                      flex: 1,
                      backgroundColor: 'transparent',
                      borderLeftWidth: 1,
                      borderLeftColor: '#FF310C',
                      borderStyle: 'dashed',
                      marginTop: 2,
                    }}
                  />
                )}
              </View>
              <View style={{marginLeft: 10, paddingBottom: 20}}>
                <Text style={{fontWeight: 'bold'}}>
                  {moment(item?.createdAt).format('DD-MM-YYYY')}
                </Text>
                <Text style={{color: '#666'}}>
                  {moment(item?.createdAt).format('hh:mm A')}
                </Text>
                <Text style={{marginTop: 4}}>{item?.placeName}</Text>
              </View>
            </View>
          ))}
        </CustomCard>

        <Spacing height={DimensionConstants.twentyFour} />
        <HomeMidHeader title="Statistics" showViewAll={false} />
        <StatisticsCards
          data={fitnessData}
          loading={isFitnessLoading}
          stepData={stepData}
          navigation={navigation}
        />
      </ScrollView>
      <CustomModal
        isVisible={isModalVisible}
        modalHeight={height / 3.5}
        onClose={() => setIsModalVisible(false)}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
            Set Geofence Radius
          </Text>

          <Slider
            style={{width: '100%', height: 40}}
            minimumValue={50}
            maximumValue={1000}
            step={10}
            value={radius}
            minimumTrackTintColor="#FF310C"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#FF310C"
            onValueChange={value => {
              setRadius(value);
              setRadiusInput(String(value));
            }}
          />

          <Text style={{textAlign: 'center', marginVertical: 10, fontSize: 16}}>
            {radius} meters
          </Text>

          <CustomButton
            text={'Save'}
            onPress={() => setIsModalVisible(false)}
          />
        </View>
      </CustomModal>
    </MainBackground>
  );
};

export default HomeScreen;
