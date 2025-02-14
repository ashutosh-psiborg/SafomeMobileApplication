import { DimensionConstants } from '../../../../constants/DimensionConstants';
import {StyleSheet} from 'react-native';

export const SettingsScreenStyles = theme =>
  StyleSheet.create({
    mainBackground: {
      backgroundColor: theme.otpBox,
    },
    container: {
      padding: DimensionConstants.sixteen,
    },
    profileContainer: {
      alignItems: 'center',
    },
    profileImage: {
      height: DimensionConstants.oneHundred,
      width: DimensionConstants.oneHundred,
    },
    profileName: {
      lineHeight: DimensionConstants.twentyTwo,
      fontSize: DimensionConstants.twenty,
      fontWeight: '600',
    },
    profileEmail: {
      fontSize: DimensionConstants.fourteen,
      fontWeight: '500',
      color: 'rgba(0, 0, 0, 0.6)',
      lineHeight: DimensionConstants.twentyTwo,
    },
    subscriptionContainer: {
      position: 'relative',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    subscriptionImage: {
      height: DimensionConstants.twoHundred,
      width: '100%',
      borderRadius: DimensionConstants.twelve,
    },
    subscriptionOverlay: {
      position: 'absolute',
      alignItems: 'center',
    },
    subscriptionTitle: {
      fontWeight: '600',
      fontSize: DimensionConstants.fourteen,
    },
    subscriptionText: {
      fontSize: DimensionConstants.fourteen,
      color: 'rgba(0, 0, 0, 0.4)',
      fontWeight: '500',
    },
    subscriptionLink: {
      fontSize: DimensionConstants.fourteen,
      fontWeight: '600',
    },
    sectionTitle: {
      fontSize: DimensionConstants.twelve,
      fontWeight: '500',
    },
    featuresCard: {
      paddingRight: 0,
      borderRadius: DimensionConstants.twelve,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    featureContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    featureText: {
      marginLeft: DimensionConstants.fifteen,
      fontSize: DimensionConstants.fourteen,
      fontWeight: '500',
    },
    separator: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      height: DimensionConstants.one,
      width: '90%',
      alignSelf: 'flex-end',
      marginVertical: DimensionConstants.eight,
    },
  });
