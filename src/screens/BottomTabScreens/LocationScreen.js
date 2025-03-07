import React, {useRef, useState} from 'react';
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
import {DimensionConstants, height} from '../../constants/DimensionConstants';
import {ImageConstants} from '../../constants/ImageConstants';
import CustomCard from '../../components/CustomCard';
import BlueGPSIcon from '../../assets/icons/BlueGPSIcon';
import ContactCards from '../../components/ContactCards';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MainBackground from '../../components/MainBackground';

const LocationScreen = ({navigation}) => {
  const snapPoints = ['25%', '80%'];
  const bottomSheetRef = useRef(null);
  const data = [
    {id: 1, image: ImageConstants.avatar, distance: '750 m'},
    {id: 2, image: ImageConstants.avatar2, distance: '1.2 km'},
    {id: 3, image: ImageConstants.avatar3, distance: '1.2 km'},
    {id: 4, image: ImageConstants.avatar2, distance: '1.2 km'},
    {id: 5, image: ImageConstants.avatar3, distance: '1.2 km'},
  ];

  const contactData = [
    {heading: 'Ajay Singh', subHeading: '1.5 km away'},
    {heading: 'Ramesh Kumar', subHeading: '2.0 km away'},
    {heading: 'Ramesh Kumar', subHeading: '2.0 km away'},
  ];

  return (
    <MainBackground noPadding>
      <GestureHandlerRootView>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 28.50704765,
              longitude: 77.40246858,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}>
            <Marker
              coordinate={{latitude: 28.50703231, longitude: 77.40216977}}
              title="Your Location"
            />
          </MapView>

          <View style={styles.searchContainerWrapper}>
            <SearchContainer />
          </View>

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
                <Text style={styles.title}>Nearby</Text>
                <Spacing height={DimensionConstants.sixteen} />
                <View style={styles.rowContainer}>
                  {data.map(item => (
                    <View key={item.id} style={{alignItems: 'center'}}>
                      <Image source={item.image} style={styles.image} />
                      <Text style={styles.distanceText}>{item.distance}</Text>
                    </View>
                  ))}
                </View>

                <Spacing height={DimensionConstants.twentyFour} />
                <HomeMidHeader title="My Contacts" />
                <Spacing height={DimensionConstants.sixteen} />
                {contactData.map((item, index) => (
                  <CustomCard key={index} style={styles.contactCard}>
                    <View style={styles.contactInfo}>
                      <Image
                        source={ImageConstants.girlImage}
                        style={styles.contactImage}
                      />
                      <View style={styles.textContainer}>
                        <Text style={styles.heading}>{item?.heading}</Text>
                        <Text style={styles.subHeading}>
                          {item?.subHeading}
                        </Text>
                      </View>
                    </View>
                    <BlueGPSIcon />
                  </CustomCard>
                ))}

                <Spacing height={DimensionConstants.twentyFour} />
                <HomeMidHeader title="My Communities" />
                <Spacing height={DimensionConstants.sixteen} />
                <ContactCards
                  familyCardPress={() =>
                    navigation.navigate('FamilyScreen', {type: 'family'})
                  }
                  friendCardPress={() =>
                    navigation.navigate('FamilyScreen', {type: 'friends'})
                  }
                />
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
    // flex: 1,
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
    // flex: 1,
    // backgroundColor :'red'
  },
  title: {fontSize: DimensionConstants.fourteen, fontWeight: '600'},
  image: {height: DimensionConstants.fifty, width: DimensionConstants.fifty},
  distanceText: {
    fontSize: DimensionConstants.twelve,
    color: '#8B8B8B',
    fontWeight: '500',
  },
  rowContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: DimensionConstants.ten,
  },
  contactInfo: {flexDirection: 'row', alignItems: 'center'},
  contactImage: {
    height: DimensionConstants.fifty,
    width: DimensionConstants.fifty,
    borderRadius: DimensionConstants.twentyFive,
  },
  textContainer: {marginLeft: DimensionConstants.ten},
  heading: {fontSize: DimensionConstants.fourteen, fontWeight: '600'},
  subHeading: {fontSize: DimensionConstants.twelve, color: '#8B8B8B'},
});

export default LocationScreen;
