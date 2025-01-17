import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState, useRef} from 'react';
import MainBackground from '../../../../components/MainBackground';
import {useTranslation} from 'react-i18next';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import MailIcon from '../../../../assets/icons/MailIcon';
import CustomButton from '../../../../components/CustomButton';
import GoogleIcon from '../../../../assets/icons/GoogleIcon';
import AppleIcon from '../../../../assets/icons/AppleIcon';
import Spacing from '../../../../components/Spacing';
import {loginStyles} from '../Styles/LoginStyles';
import {useSelector} from 'react-redux';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import CustomHeader from '../../../../components/CustomHeader';
import CustomModal from '../../../../components/CustomModal';

const LoginWithMobileScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const theme = useSelector(state => state.theme.themes[state.theme.currentTheme]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']); // assuming OTP is 4 digits

  const Styles = loginStyles(theme);

  // Create refs for OTP input boxes to manage focus
  const otpRefs = useRef([]);

  const signIn = async () => {
    try {
      console.log('Checking Play Services...');
      await GoogleSignin.hasPlayServices();
      console.log('Play Services are available.');
      const response = await GoogleSignin.signIn();
      console.log('Sign-in successful:', response);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.error('User cancelled the login flow.');
            break;
          case statusCodes.IN_PROGRESS:
            console.error('Sign-in is already in progress.');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.error('Play Services not available or outdated.');
            break;
          default:
            console.error('Other error:', error);
        }
      }
    }
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

  const handleEmailChange = text => {
    setEmail(text);
  };

  const handlePasswordChange = text => {
    setPassword(text);
  };

  return (
    <MainBackground>
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View>
          <CustomHeader title={t('Welcome')} />
          <Spacing height={DimensionConstants.twentyFour} />
          <Text style={Styles.signInText}>{t('Sign in to your Account')}</Text>
          <Spacing height={DimensionConstants.twentyFour} />
          <Text style={Styles.enterMailText}>
            {t('Enter your email and password to get start.')}
          </Text>
          <Spacing height={DimensionConstants.twentyFour} />
          <View style={Styles.textInputView}>
            <MailIcon marginRight={DimensionConstants.eight} />
            <TextInput
              style={{flex: 1}}
              placeholder="Phone number"
              keyboardType="email-address"
              value={email}
              onChangeText={handleEmailChange}
              autoCapitalize="none"
              placeholderTextColor={theme.placeHolderText}
            />
          </View>
          <Spacing height={DimensionConstants.nine} />
          <CustomButton
            text={t('Login')}
            onPress={() => setModalVisible(true)}
          />
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
            onPress={signIn}
          />
          <CustomButton
            textColor={theme.blackText}
            borderColor={theme.buttonBorder}
            color={theme.background}
            text={t('Continue with Apple')}
            icon={<AppleIcon />}
          />
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
                  ref={el => otpRefs.current[index] = el}  
                  style={Styles.otpInput}
                  value={digit}
                  onChangeText={text => handleOtpChange(text, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>
            <TouchableOpacity
              style={Styles.submitButton}
              onPress={() => console.log('Submit OTP:', otp)}>
              <Text style={Styles.submitText}>Submit OTP</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      </View>
    </MainBackground>
  );
};

export default LoginWithMobileScreen;
