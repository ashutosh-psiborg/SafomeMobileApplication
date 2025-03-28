import {StyleSheet} from 'react-native';
import {DimensionConstants} from '../../../../constants/DimensionConstants';

export const SecurityScreenStyles = theme =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    contentContainer: {
      padding: DimensionConstants.sixteen,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: DimensionConstants.ten,
    },
    headerText: {
      fontSize: DimensionConstants.sixteen,
      color: theme.text,
      marginLeft: DimensionConstants.ten,
      flex: 1,
    },
    securityCard: {
      padding: DimensionConstants.sixteen,
    },
    optionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: DimensionConstants.ten,
    },
    optionContent: {
      flex: 1,
      marginRight: DimensionConstants.ten,
    },
    optionTitle: {
      fontSize: DimensionConstants.sixteen,
      color: theme.text,
      fontWeight: '500',
    },
    optionDescription: {
      fontSize: DimensionConstants.fourteen,
      color: theme.grey,
      marginTop: DimensionConstants.five,
    },
    separator: {
      height: 1,
      backgroundColor: theme.lightGrey,
    },
    sectionTitle: {
      fontSize: DimensionConstants.sixteen,
      color: theme.text,
      fontWeight: '600',
    },
    passwordInput: {
      borderWidth: 1,
      borderColor: theme.lightGrey,
      borderRadius: DimensionConstants.five,
      padding: DimensionConstants.ten,
      fontSize: DimensionConstants.sixteen,
      color: theme.text,
    },
    footerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: DimensionConstants.sixteen,
      backgroundColor: theme.otpBox,
    },
    saveButton: {
      width: '100%',
    },
  });
