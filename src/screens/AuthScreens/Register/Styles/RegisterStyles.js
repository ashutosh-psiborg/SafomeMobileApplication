import {
  DimensionConstants,
  width,
} from '../../../../constants/DimensionConstants';
import {StyleSheet} from 'react-native';

export const RegisterStyles = theme =>
  StyleSheet.create({
    container: {flex: 1, justifyContent: 'space-between'},
    formContainer: {
      marginTop: DimensionConstants.thirtyTwo,
      paddingHorizontal: DimensionConstants.fifteen,
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      alignItems: 'center',
      borderRadius: DimensionConstants.thirty,
      paddingHorizontal: DimensionConstants.sixteen,
      height: DimensionConstants.fortyEight,
      marginBottom: DimensionConstants.twenty,
      fontSize: DimensionConstants.fourteen,
      flexDirection: 'row',
    },
    inputField: {
      marginLeft: DimensionConstants.ten,
    },
    pickerContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    pickerInput: {
      fontSize: DimensionConstants.fourteen,
      paddingVertical: 0,
      marginLeft: DimensionConstants.six,
    },
  });
