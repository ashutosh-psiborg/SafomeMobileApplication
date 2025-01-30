import {
  DimensionConstants,
  height,
} from '../../../../constants/DimensionConstants';
import {StyleSheet} from 'react-native';

export const HomeScreenStyles = theme =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: DimensionConstants.five,
    },
    addressContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    mapContainer: {
      borderRadius: DimensionConstants.twenty,
      height: height * 0.65,
      overflow: 'hidden',
    },
    map: {
      height: '100%',
      width: '100%',
    },
    placeText: {
      fontSize: DimensionConstants.fourteen,
      fontWeight: '600',
      marginLeft: DimensionConstants.five,
    },
    error: {
      color: 'red',
      textAlign: 'center',
      marginVertical: DimensionConstants.ten,
    },
    loading: {
      textAlign: 'center',
      marginVertical: DimensionConstants.ten,
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
      fontSize: DimensionConstants.twelve,
      marginLeft: DimensionConstants.five,
    },
    cardContent: {
      fontSize: DimensionConstants.twentyFour,
      fontWeight: '500',
      marginTop: DimensionConstants.five,
    },
    imageTwo: {
      height: DimensionConstants.thirtyTwo,
      width: DimensionConstants.thirtyTwo,
      marginLeft: -DimensionConstants.fifteen,
      borderColor: 'white',
      borderWidth: DimensionConstants.one,
      borderRadius: DimensionConstants.fifty,
    },
    imageOne: {
      height: DimensionConstants.thirtyTwo,
      width: DimensionConstants.thirtyTwo,
      borderColor: 'white',
      borderWidth: DimensionConstants.one,
      borderRadius: DimensionConstants.fifty,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bpmText: {
      color: '#808080',
      fontSize: DimensionConstants.twelve,
      fontWeight: '500',
    },
    callContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    plusNumberText: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: DimensionConstants.fourteen,
      fontWeight: '500',
      marginLeft: DimensionConstants.ten,
    },
    contactCardTitle: {
      color: theme.background,
      fontSize: DimensionConstants.fourteen,
      fontWeight: '500',
    },
    cardRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardNumber: {
      color: theme.background,
      fontSize: DimensionConstants.twentyEight,
      fontWeight: '500',
    },
  });
