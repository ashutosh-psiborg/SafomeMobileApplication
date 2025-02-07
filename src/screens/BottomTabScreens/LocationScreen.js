import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import HomeMidHeader from '../../components/HomeMidHeader';
import SearchContainer from '../../components/SearchContainer';
import Spacing from '../../components/Spacing';
import {DimensionConstants, height} from '../../constants/DimensionConstants';
import {ImageConstants} from '../../constants/ImageConstants';
import CustomCard from '../../components/CustomCard';
import RightArrowIcon from '../../assets/icons/RightArrowIcon';
import BlueGPSIcon from '../../assets/icons/BlueGPSIcon';
import ContactCards from '../../components/ContactCards';

const LocationScreen = () => {
  const MIN_HEIGHT = height * 0.25; // 30% of screen height
  const MAX_HEIGHT = height; // Fullscreen height
  const data = [
    {id: 1, image: ImageConstants.avatar, distance: '750 m'},
    {id: 2, image: ImageConstants.avatar2, distance: '1.2 km'},
    {id: 3, image: ImageConstants.avatar3, distance: '1.2 km'},
    {id: 4, image: ImageConstants.avatar, distance: '1.2 km'},
    {id: 5, image: ImageConstants.avatar2, distance: '1.2 km'},
  ]; // Array to represent repeated items
  const contactData = [
    {heading: 'Ajay Singh', subHeading: '1.5 km away'},
    {heading: 'Ajay Singh', subHeading: '1.5 km away'},
    {heading: 'Ajay Singh', subHeading: '1.5 km away'},
  ];

  const animatedValue = useRef(new Animated.Value(MIN_HEIGHT)).current;
  const [isFullScreen, setIsFullScreen] = useState(false); // Track full-screen state
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let newHeight = MIN_HEIGHT - gesture.dy;
        if (newHeight >= MIN_HEIGHT && newHeight <= MAX_HEIGHT) {
          animatedValue.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        let shouldExpand = gesture.dy < -50; // Dragging up
        Animated.timing(animatedValue, {
          toValue: shouldExpand ? MAX_HEIGHT : MIN_HEIGHT,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          setIsFullScreen(shouldExpand); // Update state on animation end
        });
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 28.50704765,
          longitude: 77.40246858,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <Marker
          coordinate={{latitude: 28.50703231, longitude: 77.40216977}}
          title="Your Location"
        />
      </MapView>

      <View style={styles.searchContainerWrapper}>
        <SearchContainer />
      </View>

      <Animated.View
        style={[styles.bottomSheet, {height: animatedValue}]}
        {...panResponder.panHandlers}>
        <View style={styles.handle} />

        <Spacing
          height={
            isFullScreen
              ? DimensionConstants.oneHundredSeventy
              : DimensionConstants.twentySix
          }
        />

        <Text style={styles.title}>Nearby</Text>
        <Spacing height={DimensionConstants.sixteen} />

        <View style={styles.rowContainer}>
          {data.map(item => (
            <View key={item?.id} style={{alignItems: 'center'}}>
              <Image source={item?.image} style={styles.image} />
              <Text style={styles.distanceText}>{item?.distance}</Text>
            </View>
          ))}
        </View>
        <Spacing height={DimensionConstants.twentyFour} />
        <HomeMidHeader title={'My contacts'} />
        <Spacing height={DimensionConstants.sixteen} />

        {contactData.map((item, index) => (
          <CustomCard key={index} style={styles.contactCard}>
            <View style={styles.contactInfo}>
              <Image
                source={ImageConstants.girlImage}
                style={styles.contactImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.heading}>{item.heading}</Text>
                <Text style={styles.subHeading}>{item.subHeading}</Text>
              </View>
            </View>
            <View>
              <BlueGPSIcon />
            </View>
          </CustomCard>
        ))}
        <Spacing height={DimensionConstants.twentyFour} />

        <HomeMidHeader title={'My communities'} />
        <Spacing height={DimensionConstants.sixteen} />

        <ContactCards />
      </Animated.View>
    </View>
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
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#F2F7FC',
    borderTopLeftRadius: DimensionConstants.twenty,
    borderTopRightRadius: DimensionConstants.twenty,
    padding: DimensionConstants.twenty,
  },
  handle: {
    width: DimensionConstants.fortyEight,
    height: DimensionConstants.two,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    marginBottom: DimensionConstants.ten,
    borderRadius: DimensionConstants.five,
  },
  title: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '600',
  },
  image: {
    height: DimensionConstants.fifty,
    width: DimensionConstants.fifty,
  },
  distanceText: {
    fontSize: DimensionConstants.twelve,
    color: '#8B8B8B',
    fontWeight: '500',
    marginTop: DimensionConstants.four,
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactCard: {
    borderRadius: DimensionConstants.ten,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DimensionConstants.ten,
    marginTop: DimensionConstants.ten,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactImage: {
    height: DimensionConstants.fifty,
    width: DimensionConstants.fifty,
    borderRadius: DimensionConstants.twentyFive,
  },
  textContainer: {
    marginLeft: DimensionConstants.ten,
  },
  heading: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '600',
  },
  subHeading: {
    fontSize: DimensionConstants.twelve,
    color: '#8B8B8B',
    fontWeight: '500',
  },
});

export default LocationScreen;
