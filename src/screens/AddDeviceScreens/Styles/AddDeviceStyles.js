import {StyleSheet} from 'react-native';
import {
  DimensionConstants,
  height,
  width,
} from '../../../constants/DimensionConstants';
export const AddDeviceStyles = theme =>
  StyleSheet.create({
    backgroundImage: {
      height: height,
      width: width,
      position: 'absolute',
    }, textInput: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      alignItems: 'center',
      borderRadius: DimensionConstants.thirty,
      paddingHorizontal: DimensionConstants.sixteen,
      height: DimensionConstants.fortyEight,
      marginTop: DimensionConstants.twenty,
      fontSize: DimensionConstants.fourteen,
      flexDirection: 'row',
    },
    inputField: {
      marginLeft: DimensionConstants.ten,
    },
    container: {
      padding: DimensionConstants.sixteen,
      flex: 1,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 32,
      fontWeight: '600',
    },
    iconContainer: {
      alignItems: 'center',
    },
  });
