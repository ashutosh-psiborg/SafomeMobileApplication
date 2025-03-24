import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import HomeMidHeader from '../../components/HomeMidHeader';
import SearchContainer from '../../components/SearchContainer';
import Spacing from '../../components/Spacing';
import {DimensionConstants} from '../../constants/DimensionConstants';
import CustomCard from '../../components/CustomCard';
import TimeLineIcon from '../../assets/icons/TimeLineIcon';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MainBackground from '../../components/MainBackground';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetcher from '../../utils/ApiService';
import Loader from '../../components/Loader';
import moment from 'moment';

const LocationScreen = ({navigation}) => {
  const snapPoints = ['25%', '40%'];
  const bottomSheetRef = useRef(null);
  const [deviceId, setDeviceId] = useState('');
  const [location, setLocation] = useState(null);
  const locationRef = useRef(null);
  const [mapKey, setMapKey] = useState(0);
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

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
      refetchLocation();
    }, []),
  );

  const {
    data: locationData,
    isLoading: isLocationLoading,
    refetch: refetchLocation,
  } = useQuery({
    queryKey: ['location'],
    queryFn: async () => {
      const response = await fetcher({
        method: 'GET',
        url: `deviceDataResponse/locations/${deviceId || 6907390711}`,
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
          setMapKey(prevKey => prevKey + 1); // Force map re-render
        }
      }
    },
  });

  useEffect(() => {
    const latestLocation = locationData?.data?.[0];
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

  return (
    <MainBackground noPadding>
      <GestureHandlerRootView>
        <View style={styles.container}>
          {isLocationLoading ? (
            <Loader />
          ) : (
            <MapView
              key={mapKey}
              style={styles.map}
              initialRegion={{
                latitude: location?.latitude || 28.50704765,
                longitude: location?.longitude || 77.40246858,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              {location && (
                <Marker
                  coordinate={location}
                  title="Your Location"
                  description={
                    locationData?.data?.[0]?.placeName ||
                    'Location not available'
                  }
                />
              )}
            </MapView>
          )}

          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            backgroundStyle={styles.bottomSheet}
            enableHandlePanningGesture={true}
            enableContentPanningGesture={false}
            maxDynamicContentSize={400}
            handleIndicatorStyle={styles.handle}>
            <BottomSheetView>
              <ScrollView contentContainerStyle={styles.sheetContent}>
                <HomeMidHeader title="Recent Location" showViewAll={false} />
                <Spacing height={DimensionConstants.ten} />
                <CustomCard>
                  {locationData?.data?.map((item, index, arr) => (
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
                          {moment(item?.createdAt).format('D MMMM YYYY')}
                        </Text>

                        <Text style={{color: '#666'}}>
                          {moment(item?.createdAt).format('hh:mm A')}
                        </Text>
                        <Text style={{marginTop: 4}}>{item?.placeName}</Text>
                      </View>
                    </View>
                  ))}
                </CustomCard>
              </ScrollView>
            </BottomSheetView>
          </BottomSheet>
        </View>
      </GestureHandlerRootView>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {width: '100%', height: '100%'},
  searchContainerWrapper: {
    position: 'absolute',
    top:
      Platform.OS === 'ios'
        ? DimensionConstants.fifty
        : DimensionConstants.twenty,
    left: DimensionConstants.sixteen,
    right: DimensionConstants.sixteen,
    zIndex: 10,
  },
  bottomSheet: {
    backgroundColor: '#F2F7FC',
    borderTopLeftRadius: DimensionConstants.twenty,
    borderTopRightRadius: DimensionConstants.twenty,
  },
  handle: {
    backgroundColor: '#D9D9D9',
    width: DimensionConstants.fortyEight,
    height: DimensionConstants.two,
    borderRadius: DimensionConstants.five,
    alignSelf: 'center',
  },
  sheetContent: {
    padding: DimensionConstants.twenty,
  },
});

export default LocationScreen;
