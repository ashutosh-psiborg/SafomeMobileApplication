import {DimensionConstants} from '../../../../constants/DimensionConstants';
import {StyleSheet} from 'react-native';

export const loginStyles = theme =>
  StyleSheet.create({
    modalContent: {
      flex: 1,
      padding: DimensionConstants.twenty,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: DimensionConstants.sixteen,
      fontWeight: '600',
    },
    otpContainer: {
      flexDirection: 'row',
      marginVertical: DimensionConstants.twenty,
    },
    otpInput: {
      width: DimensionConstants.fortyEight,
      backgroundColor: theme.otpBox,
      height: DimensionConstants.fortyEight,
      borderWidth: 1,
      marginHorizontal: DimensionConstants.twelve,
      fontSize: 24,
      textAlign: 'center',
      borderRadius: DimensionConstants.twelve,
      borderColor: theme.background,
    },
    submitText: {
      color: 'white',
      fontSize: DimensionConstants.eighteen,
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
