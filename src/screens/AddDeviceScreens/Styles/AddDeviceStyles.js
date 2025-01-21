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
