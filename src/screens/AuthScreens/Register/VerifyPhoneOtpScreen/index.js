import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {useTranslation} from 'react-i18next';
import Spacing from '../../../../components/Spacing';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import CustomButton from '../../../../components/CustomButton';
import GlobeIcon from '../../../../assets/icons/GlobeIcon';
import {VerifyMailOtpStyles} from '../VerifyMailOtpScreen/Styles/VerifyMailOtpStyles';
import {useSelector} from 'react-redux';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';

// Utility function to extract country code (e.g., "+91" from "India (+91)")
const extractCountryCode = countryCodeStr => {
  const match = countryCodeStr.match(/\(([^)]+)\)/); // Extract text inside parentheses
  return match ? match[1] : '+91'; // Fallback to '+91' if extraction fails
};

// Utility function to remove '+' from country code for verification
const stripPlusFromCountryCode = countryCode => {
  return countryCode.replace(/^\+/, ''); // Remove leading '+' if present
};

const VerifyPhoneOtpScreen = ({navigation}) => {
  const user = useSelector(state => state.user);
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const [code, setCode] = useState('');
  const {t} = useTranslation();
  const styles = VerifyMailOtpStyles(theme);

  // Extract country code from user.countryCode
  const countryCode = extractCountryCode(user.countryCode);
  const countryCodeWithoutPlus = stripPlusFromCountryCode(countryCode);

  console.log('_+_+_+_+_+__+_', user);

  const handleChange = value => {
    setCode(value);
  };

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      return fetcher({
        method: 'POST',
        url: `sms/send-sms?number=+${user.phoneNumber}&purpose=REGISTRATION&type=PHONE`,
      });
    },
    onSuccess: data => {
      console.log('OTP sent successfully:', data);
    },
    onError: error => {
      console.error('Failed to send OTP:', error);
    },
  });

  useEffect(() => {
    if (user.phoneNumber && user.countryCode) {
      sendOtpMutation.mutate();
    }
  }, [user.phoneNumber, user.countryCode]);

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      console.log(
        '=======',
        code,
        '----',
        `${countryCodeWithoutPlus}${user.phoneNumber}`,
      );
      return fetcher({
        method: 'POST',
        url: 'auth/verifyOTP',
        data: {
          contact: `${user.phoneNumber}`, // Use country code without '+'
          purpose: 'REGISTRATION',
          otp: code,
        },
      });
    },
    onSuccess: data => {
      console.log('Phone verification successful:', data);
      Alert.alert('Success', 'Phone verified successfully!');
      navigation.navigate('CreatePasswordScreen');
    },
    onError: error => {
      console.error('Phone verification failed:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    },
  });

  const handleVerify = () => {
    if (code.length < 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP.');
      return;
    }
    verifyOtpMutation.mutate();
  };

  return (
    <MainBackground>
      <CustomHeader
        title={t('Verify phone number')}
        backPress={() => navigation.goBack()}
      />
      <Spacing height={DimensionConstants.thirtyEight} />
      <Text style={styles.title}>{t('Please verify your Phone number')}</Text>
      <Spacing height={DimensionConstants.twentyFour} />
      <View style={{maxWidth: '80%'}}>
        <Text style={styles.infoText}>{t('We have sent OTP to')} </Text>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <Text
            style={
              styles.emailText
            }>{`${countryCode} ${user.phoneNumber}`}</Text>
          <TouchableOpacity>
            <Text style={styles.edit}>Edit</Text>
          </TouchableOpacity>
          <Text style={styles.infoText}> {t('phone number')}</Text>
        </View>
        <Text style={styles.infoText}>Enter OTP below.</Text>
      </View>
      <Spacing height={DimensionConstants.thirtyOne} />
      <View style={styles.inputContainer}>
        <GlobeIcon />
        <TextInput
          style={styles.input}
          placeholder={t('Enter OTP')}
          value={code}
          onChangeText={text => handleChange(text)}
          keyboardType="phone-pad"
          placeholderTextColor={theme.placeHolderText}
          maxLength={4}
        />
      </View>
      <CustomButton onPress={handleVerify} text={t('Continue')} />
      <Spacing height={DimensionConstants.sixteen} />
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>{t('OTP not received?')}</Text>
        <TouchableOpacity onPress={() => sendOtpMutation.mutate()}>
          <Text style={styles.resendText}> {t('Resend OTP')}</Text>
        </TouchableOpacity>
      </View>
    </MainBackground>
  );
};

export default VerifyPhoneOtpScreen;
