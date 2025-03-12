import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
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

const LoginWithMobileScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const num = otp.join('');

  const Styles = loginStyles(theme);

  const otpRefs = useRef([]);

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      return fetcher({
        method: 'POST',
        url: '/auth/loginWithPhoneNumber',
        data: {
          phoneNumber: phoneNumber,
        },
      });
    },
    onSuccess: data => {
      console.log('OTP sent successfully:', data);
    },
    onError: error => {
      console.error('Failed to send OTP:', error);
    },
  });
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      return fetcher({
        method: 'POST',
        url: '/auth/loginVerifyOTP',
        data: {phoneNumber: phoneNumber, otp: num},
        noAuth: true,
      });
    },
    onSuccess: data => {
      console.log('Phone verification successful:', data);
      Alert.alert('Success', 'Phone verified successfully!');
      navigation.replace('AddDeviceScreen');
    },
    onError: error => {
      console.error('Phone verification failed:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    },
  });

  const handleSubmit = () => {
    sendOtpMutation.mutate();
    setModalVisible(true);
  };
  const handleVerify = () => {
    if (otp.length < 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP.');
      return;
    }
    verifyOtpMutation.mutate();
  };
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && index < otp.length - 1) {
      const nextInput = index + 1;
      otpRefs.current[nextInput].focus();
    }
    if (text.length === 0 && index > 0) {
      const prevInput = index - 1;
      otpRefs.current[prevInput].focus();
    }
  };

  const handlePhoneNumber = text => {
    setPhoneNumber(text);
  };

  return (
    <MainBackground>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View>
            <CustomHeader
              title={t('Welcome')}
              backPress={() => navigation.goBack()}
            />
            <Spacing height={DimensionConstants.twentyFour} />
            <Text style={Styles.signInText}>
              {t('Sign in to your Account')}
            </Text>
            <Spacing height={DimensionConstants.twentyFour} />
            <Text style={Styles.enterMailText}>
              {t('Enter your email and password to get started.')}
            </Text>
            <Spacing height={DimensionConstants.twentyFour} />
            <View style={Styles.textInputView}>
              <MailIcon marginRight={DimensionConstants.eight} />
              <TextInput
                style={{flex: 1}}
                placeholder="Phone number"
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
              <Text style={Styles.loginWithPhone}>Login with email</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={Styles.continue}>or continue with</Text>
            <CustomButton
              textColor={theme.blackText}
              borderColor={theme.buttonBorder}
              color={theme.background}
              text={t('Continue with Google')}
              icon={<GoogleIcon />}
            />
            {/* <CustomButton
              textColor={theme.blackText}
              borderColor={theme.buttonBorder}
              color={theme.background}
              text={t('Continue with Apple')}
              icon={<AppleIcon />}
            /> */}
            <Spacing height={DimensionConstants.twentyFour} />
            <Text style={Styles.terms}>
              By clicking login you agree to recognates{' '}
              <Text style={Styles.termBlue}>Terms of use </Text>
              and <Text style={Styles.termBlue}>Privacy policy</Text>
            </Text>
          </View>

          <CustomModal
            isVisible={isModalVisible}
            onClose={() => setModalVisible(false)}>
            <View style={Styles.modalContent}>
              <Text style={Styles.modalTitle}>Verify Phone Number</Text>

              <View style={Styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={el => (otpRefs.current[index] = el)}
                    style={Styles.otpInput}
                    value={digit}
                    onChangeText={text => handleOtpChange(text, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                  />
                ))}
              </View>
              <Text style={Styles.enterMailText}>
                OTP not received?{' '}
                <Text style={Styles.resetWord}>Resend OTP</Text>
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <CustomButton
                width={width / 2.25}
                textColor={theme.text}
                borderColor={theme.borderColor}
                color={theme.background}
                text={'Cancel'}
              />
              <CustomButton
                width={width / 2.25}
                text={'Verify'}
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
