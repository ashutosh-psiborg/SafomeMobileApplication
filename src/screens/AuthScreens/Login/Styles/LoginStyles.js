import {DimensionConstants} from '../../../../constants/DimensionConstants';
import {StyleSheet} from 'react-native';

export const loginStyles = theme =>
  StyleSheet.create({
    modalContent: {
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    otpContainer: {
      flexDirection: 'row',
      marginVertical: 20,
    },
    otpInput: {
      width: 50,
      height: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      margin: 5,
      fontSize: 24,
      textAlign: 'center',
      borderRadius: 8,
    },
    submitButton: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 8,
      marginTop: 20,
    },
    submitText: {
      color: 'white',
      fontSize: 18,
    },
    textInputView: {
      marginTop: DimensionConstants.ten,
      borderColor: theme.borderColor,
      borderWidth: DimensionConstants.one,
      borderRadius: DimensionConstants.thirty,
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: DimensionConstants.eighteen,
      height: DimensionConstants.fortyEight,
    },

    signInText: {
      fontSize: DimensionConstants.thirtyTwo,
      fontWeight: '600',
      maxWidth: '90%',
    },
    enterMailText: {
      fontSize: DimensionConstants.fourteen,
      fontWeight: '500',
      color: theme.lightText,
    },
    resetPasswordText: {
      fontSize: DimensionConstants.fourteen,
      fontWeight: '500',
      color: theme.lightText,
    },
    resetWord: {
      fontSize: DimensionConstants.fourteen,
      fontWeight: '600',
      color: theme.blackText,
    },
    continue: {
      color: theme.lightText,
      fontSize: DimensionConstants.fourteen,
      fontWeight: '500',
      textAlign: 'center',
    },
    terms: {
      color: theme.grey,
      fontSize: DimensionConstants.twelve,
      fontWeight: '400',
      lineHeight: DimensionConstants.twentyTwo,
    },
    termBlue: {
      color: theme.primary,
      fontWeight: '500',
    },
    loginWithPhone: {
      color: theme.primary,
      fontSize: DimensionConstants.fourteen,
      fontWeight: '500',
      textAlign: 'center',
    },
  });
