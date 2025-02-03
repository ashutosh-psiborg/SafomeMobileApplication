import {View, Text, Image, Alert} from 'react-native';
import React from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import Spacing from '../../../../components/Spacing';
import CustomButton from '../../../../components/CustomButton';
import {BioMetricStyles} from './Styles/BioMetricStyles';
import {ImageConstants} from '../../../../constants/ImageConstants';
import SecurityTickIcon from '../../../../assets/icons/SecurityTickIcon';
import ReactNativeBiometrics from 'react-native-biometrics';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import fetcher from '../../../../utils/ApiService';
import {useMutation} from '@tanstack/react-query';

const BioMetricScreen = ({route, navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const {t} = useTranslation();
  const styles = BioMetricStyles(theme);
  const authenticateAndSendBiometric = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
  
    try {
      // Check if biometrics is available
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
  
      if (!available) {
        Alert.alert('Biometric', 'Biometric authentication is not available.');
        return;
      }
  
      console.log(`Using ${biometryType || 'generic biometric sensor'}`);
  
      // Ensure a key pair exists
      const { keysExist } = await rnBiometrics.biometricKeysExist();
  
      if (!keysExist) {
        console.log('No biometric keys exist, creating new ones...');
        await rnBiometrics.createKeys();
      }
  
      // Generate biometric signature
      const payload = 'your_unique_identifier'; // Replace with a meaningful identifier
      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: 'Authenticate with Biometrics',
        payload,
      });
  
      if (!success || !signature) {
        Alert.alert('Failed', 'Biometric authentication failed or was canceled.');
        return;
      }
  
      console.log('Biometric Signature:', signature);
  
      // Send the biometric token to the backend
      const response = await fetcher({
        method: 'POST',
        url: 'auth/bioMetric',
        data: { bioMetricToken: signature },
      });
  
      // Handle API success
      console.log('Biometric login successful:', response);
      Alert.alert('Success', 'Biometric authentication successful!');
      setTimeout(() => {
        navigation.navigate('SecurityPinScreen');
      }, 1500);
  
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Alert.alert('Error', 'An error occurred during biometric authentication.');
    }
  };
  // const authenticateWithBiometrics = async () => {
  //   const rnBiometrics = new ReactNativeBiometrics();

  //   try {
  //     const {available, biometryType} = await rnBiometrics.isSensorAvailable();

  //     if (!available) {
  //       Alert.alert(
  //         'Biometric',
  //         'Biometric authentication is not available on this device.',
  //       );
  //       return;
  //     }

  //     if (biometryType === ReactNativeBiometrics.TouchID) {
  //       console.log('Using Touch ID');
  //     } else if (biometryType === ReactNativeBiometrics.FaceID) {
  //       console.log('Using Face ID');
  //     } else {
  //       console.log('Using generic biometric sensor');
  //     }

  //     const {success} = await rnBiometrics.simplePrompt({
  //       promptMessage: 'Authenticate with Biometrics',
  //       cancelButtonText: 'Cancel',
  //     });

  //     if (success) {
  //       Alert.alert('Success', 'Biometric authentication successful!');
  //       setTimeout(() => {
  //         navigation.navigate('SecurityPinScreen');
  //       }, 1500);
  //     } else {
  //       Alert.alert(
  //         'Failed',
  //         'Biometric authentication failed or was canceled.',
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Biometric authentication error:', error);
  //     Alert.alert(
  //       'Error',
  //       'An error occurred during biometric authentication.',
  //     );
  //   }
  // };

  return (
    <MainBackground>
      <View style={styles.container}>
        <View>
          <CustomHeader
            title={t('Biometric')}
            backPress={() => navigation.goBack()}
          />
          <Spacing height={DimensionConstants.thirtyEight} />
          <Text style={styles.title}>{t('Enable Biometric Security')}</Text>
          <Spacing height={DimensionConstants.twentyFour} />
          <View style={{maxWidth: '80%'}}>
            <Text style={styles.infoText}>
              {t(
                'Unlock your account with just a glance or a touch. Say goodbye to passwords and simplify your sign-in.',
              )}
            </Text>
          </View>
          <Spacing height={DimensionConstants.twentyFour} />
          <View>
            <Image
              source={ImageConstants.texturedPaper}
              style={styles.imageContainer}
            />
            <View style={styles.overlayContainer}>
              <SecurityTickIcon />
              <View style={styles.overlayTextContainer}>
                <Text style={styles.resendText}>
                  {t('Experience instant access')}
                </Text>
                <Text style={styles.infoText}>
                  {t(
                    'No passwords, no hassle, just secure and effortless verification',
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <CustomButton onPress={authenticateAndSendBiometric} text={t('Enable')} />
      </View>
    </MainBackground>
  );
};

export default BioMetricScreen;
