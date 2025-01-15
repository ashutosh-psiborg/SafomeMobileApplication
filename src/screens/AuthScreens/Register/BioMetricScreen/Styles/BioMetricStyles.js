import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import {StyleSheet} from 'react-native';

export const BioMetricStyles = theme =>
  StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      flex: 1,
    },
    title: {
      fontSize: DimensionConstants.thirtyTwo,
      maxWidth: '80%',
      fontWeight: '600',
    },
    infoText: {
      color: theme.lightText,
      fontWeight: '500',
      fontSize: DimensionConstants.fourteen,
      lineHeight: DimensionConstants.twentyFour,
    },
    resendText: {
      color: theme.text,
      fontWeight: '600',
      fontSize: DimensionConstants.fourteen,
    },
    imageContainer: {
      height: DimensionConstants.oneHundredThree,
      borderRadius: DimensionConstants.thirty,
      width: 'auto',
    },
    overlayContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: DimensionConstants.eighteen,
      position: 'absolute',
      paddingVertical: DimensionConstants.sixteen,
    },
    overlayTextContainer: {
      paddingHorizontal: DimensionConstants.ten,
    },
    pinInput: {
      fontSize: DimensionConstants.forty,
      fontWeight: '600',
      letterSpacing: DimensionConstants.twelve,
      color: theme.primary,
    }
  });
