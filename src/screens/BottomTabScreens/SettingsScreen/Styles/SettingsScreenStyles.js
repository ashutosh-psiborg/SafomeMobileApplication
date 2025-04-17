import {DimensionConstants} from '../../../../constants/DimensionConstants';
import {StyleSheet} from 'react-native';

export const SettingsScreenStyles = theme =>
  StyleSheet.create({
    mainBackground: {
      backgroundColor: theme.otpBox,
    },
    container: {
      // minHeight: '100%',
      flex: 1,
      justifyContent: 'space-between',
      padding: DimensionConstants.sixteen,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: DimensionConstants.eight,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: DimensionConstants.twelve,
    },
    searchIcon: {
      marginRight: DimensionConstants.eight,
    },
    searchInput: {
      flex: 1,
      fontSize: DimensionConstants.fourteen,
      color: theme.text,
      height: DimensionConstants.forty,
    },
    clearIcon: {
      padding: DimensionConstants.four,
    },
    profileContainer: {
      padding: DimensionConstants.sixteen,
      backgroundColor: theme.cardBackground || '#fff',
      borderRadius: DimensionConstants.twelve,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    profileImageContainer: {
      marginRight: DimensionConstants.nineteen,
      borderRadius: '100%',
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: theme.primary || '#eee',
    },
    profileImage: {
      height: DimensionConstants.sixty,
      width: DimensionConstants.sixty,
    },
    profileInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    profileName: {
      fontSize: DimensionConstants.twenty,
      fontWeight: '700',
      color: theme.text || '#000',
      lineHeight: DimensionConstants.twentyFour,
      marginBottom: DimensionConstants.four,
    },
    profileEmail: {
      fontSize: DimensionConstants.fourteen,
      fontWeight: '400',
      color: theme.darkGrey || 'rgba(0, 0, 0, 0.6)',
      lineHeight: DimensionConstants.eighteen,
    },
    editButton: {
      padding: DimensionConstants.eight,
      marginLeft: DimensionConstants.ten,
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
      flex: 1,
      borderRadius: DimensionConstants.twelve,
      justifyContent: 'space-between',
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'space-between',
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
      // backgroundColor: 'rgba(0, 0, 0, 0.05)',
      height: DimensionConstants.one,
      // width: '120%',
      // alignSelf: 'flex-end',
      marginVertical: DimensionConstants.eight,
    },
  });
