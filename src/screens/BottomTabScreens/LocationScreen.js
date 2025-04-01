import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import HomeMidHeader from '../../components/HomeMidHeader';
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
    }, [deviceId]),
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
  const mapRef = useRef(null); // Reference for MapView

  const focusOnLocation = (latitude, longitude) => {
    if (mapRef.current && latitude && longitude) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000, // Animation duration
      );
    }
  };
  return (
    <MainBackground noPadding>
      <GestureHandlerRootView>
        <View style={styles.container}>
          {isLocationLoading ? (
            <Loader />
          ) : (
            <MapView
              ref={mapRef} // Assign the ref
              key={mapKey}
              style={styles.map}
              initialRegion={{
                latitude: location?.latitude,
                longitude: location?.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              {locationData?.data?.results?.map((item, index) => {
                const lat = parseFloat(item.latitude);
                const long = parseFloat(item.longitude);
                return !isNaN(lat) && !isNaN(long) ? (
                  <Marker
                    key={item._id || index}
                    coordinate={{latitude: lat, longitude: long}}
                    title={`Location ${index + 1}`}
                    description={item.placeName || 'Location not available'}
                  />
                ) : null;
              })}

              {locationData?.data?.results?.length > 1 && (
                <Polyline
                  coordinates={locationData.data.results
                    ?.map(item => ({
                      latitude: parseFloat(item.latitude),
                      longitude: parseFloat(item.longitude),
                    }))
                    .filter(
                      coord =>
                        !isNaN(coord.latitude) && !isNaN(coord.longitude),
                    )}
                  strokeColor="#FF0000"
                  strokeWidth={3}
                  lineDashPattern={[5, 5]}
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
                  {locationData?.data?.results?.map((item, index, arr) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        focusOnLocation(
                          parseFloat(item.latitude),
                          parseFloat(item.longitude),
                        )
                      }
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
                    </TouchableOpacity>
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
