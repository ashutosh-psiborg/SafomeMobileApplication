import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useState, useRef} from 'react';
import MainBackground from '../../../../components/MainBackground';
import {useTranslation} from 'react-i18next';
import {
  DimensionConstants,
  width,
} from '../../../../constants/DimensionConstants';
import MailIcon from '../../../../assets/icons/MailIcon';
import CustomButton from '../../../../components/CustomButton';
import GoogleIcon from '../../../../assets/icons/GoogleIcon';
import AppleIcon from '../../../../assets/icons/AppleIcon';
import Spacing from '../../../../components/Spacing';
import {loginStyles} from '../Styles/LoginStyles';
import {useSelector} from 'react-redux';
import CustomHeader from '../../../../components/CustomHeader';
import CustomModal from '../../../../components/CustomModal';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dropdown} from 'react-native-element-dropdown';

// Utility function to extract numeric country code (e.g., "+91" from "India (+91)")
const extractCountryCode = countryCodeStr => {
  const match = countryCodeStr.match(/\(([^)]+)\)/); // Extract text inside parentheses
  return match ? match[1] : '+91'; // Fallback to '+91' if extraction fails
};

// Utility function to remove '+' from country code for verification
const stripPlusFromCountryCode = countryCode => {
  return countryCode.replace(/^\+/, ''); // Remove leading '+' if present
};

const LoginWithMobileScreen = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('India (+91)');
  const [isModalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const num = otp.join('');
  const styles = loginStyles(theme);

  const countryCodes = [
    {label: 'India (+91)', value: 'India (+91)'},
    {label: 'Australia (+61)', value: 'Australia (+61)'},
  ];

  const otpRefs = useRef([]);

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const numericCountryCode = extractCountryCode(countryCode); // e.g., "+91"
      return fetcher({
        method: 'POST',
        url: `/sms/send-sms?number=${numericCountryCode}${phoneNumber}&purpose=LOGIN&type=PHONE`,
      });
    },
    onSuccess: data => {
      console.log('OTP sent successfully:', data);
      setModalVisible(true);
    },
    onError: error => {
      console.error('Failed to send OTP:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const numericCountryCode = extractCountryCode(countryCode); // e.g., "+91"
      const countryCodeWithoutPlus =
        stripPlusFromCountryCode(numericCountryCode); // e.g., "91"
      console.log(
        'Verifying OTP:',
        num,
        'for',
        `${countryCodeWithoutPlus}${phoneNumber}`,
      );
      return fetcher({
        method: 'POST',
        url: 'auth/verifyOTP',
        data: {
          contact: `${countryCodeWithoutPlus}${phoneNumber}`,
          otp: num,
          purpose: 'LOGIN',
        },
        noAuth: true,
      });
    },
    onSuccess: async data => {
      console.log('Phone verification successful:', data);
      await AsyncStorage.setItem('authToken', data?.data?.token);
      console.log('Token stored successfully:', data?.data?.token);
      Alert.alert('Success', 'Phone verified successfully!');
      setModalVisible(false);
      navigation.replace('AddDeviceScreen');
    },
    onError: error => {
      console.error('Phone verification failed:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
      return;
    }
    sendOtpMutation.mutate();
  };

  const handleVerify = () => {
    if (num.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP.');
      return;
    }
    verifyOtpMutation.mutate();
  };

  const handleResendOtp = () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
      return;
    }
    sendOtpMutation.mutate();
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }
    if (text.length === 0 && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handlePhoneNumber = text => {
    setPhoneNumber(text.replace(/[^0-9]/g, '')); // Allow only digits
  };

  return (
    <MainBackground>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View>
            <CustomHeader
              title={t('Welcome')}
              backPress={() => navigation.goBack()}
            />
            <Spacing height={DimensionConstants.twentyFour} />
            <Text style={styles.signInText}>
              {t('Sign in to your Account')}
            </Text>
            <Spacing height={DimensionConstants.twentyFour} />
            <Text style={styles.enterMailText}>
              {t('Enter your phone number to get started.')}
            </Text>
            <Spacing height={DimensionConstants.twentyFour} />
            <View style={styles.textInputView}>
              <Dropdown
                style={styles.countryCodeDropdown}
                data={countryCodes}
                labelField="label"
                valueField="value"
                value={countryCode}
                onChange={item => setCountryCode(item.value)}
                placeholder=""
                selectedTextStyle={styles.countryCodeText}
              />
              <TextInput
                style={styles.phoneInput}
                placeholder={t('Phone number')}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneNumber}
                autoCapitalize="none"
                placeholderTextColor={theme.placeHolderText}
                maxLength={10}
              />
            </View>
            <Spacing height={DimensionConstants.nine} />
            <CustomButton text={t('Login')} onPress={handleSubmit} />
            <Spacing height={DimensionConstants.sixteen} />
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginWithPhone}>{t('Login with email')}</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.continue}>{t('or continue with')}</Text>
            <CustomButton
              textColor={theme.blackText}
              borderColor={theme.buttonBorder}
              color={theme.background}
              text={t('Continue with Google')}
              icon={<GoogleIcon />}
            />
            {Platform.OS === 'ios' ? (
              <CustomButton
                textColor={theme.blackText}
                borderColor={theme.buttonBorder}
                color={theme.background}
                text={t('Continue with Apple')}
                icon={<AppleIcon />}
              />
            ) : null}
            <Spacing height={DimensionConstants.twentyFour} />
            <Text style={styles.terms}>
              {t('By clicking login you agree to recognates')}{' '}
              <Text style={styles.termBlue}>{t('Terms of use')}</Text>{' '}
              {t('and')}{' '}
              <Text style={styles.termBlue}>{t('Privacy policy')}</Text>
            </Text>
          </View>

          <CustomModal
            isVisible={isModalVisible}
            onClose={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('Verify Phone Number')}</Text>
              <Text style={styles.enterMailText}>
                {t('Enter the OTP sent to')} {extractCountryCode(countryCode)}{' '}
                {phoneNumber}
              </Text>
              <Spacing height={DimensionConstants.sixteen} />
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={el => (otpRefs.current[index] = el)}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={text => handleOtpChange(text, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                  />
                ))}
              </View>
              <Text style={styles.enterMailText}>
                {t('OTP not received?')}{' '}
                <Text style={styles.resetWord} onPress={handleResendOtp}>
                  {t('Resend OTP')}
                </Text>
              </Text>
              <Spacing height={DimensionConstants.sixteen} />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <CustomButton
                width={width / 2.25}
                textColor={theme.text}
                borderColor={theme.borderColor}
                color={theme.background}
                text={t('Cancel')}
                onPress={() => setModalVisible(false)}
              />
              <CustomButton
                width={width / 2.25}
                text={t('Verify')}
                onPress={handleVerify}
              />
            </View>
          </CustomModal>
        </View>
      </ScrollView>
    </MainBackground>
  );
};

export default LoginWithMobileScreen;
