import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
import {useTranslation} from 'react-i18next';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import MailIcon from '../../../assets/icons/MailIcon';
import PasswordIcon from '../../../assets/icons/PasswordIcon';
import CustomButton from '../../../components/CustomButton';
import GoogleIcon from '../../../assets/icons/GoogleIcon';
import AppleIcon from '../../../assets/icons/AppleIcon';
import Spacing from '../../../components/Spacing';
import {loginStyles} from './Styles/LoginStyles';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../../utils/ApiService';
import {useSelector} from 'react-redux';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import CustomHeader from '../../../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const Styles = loginStyles(theme);
  GoogleSignin.configure({
    webClientId:
      '303533365458-a3a7d2lgdlfa13t1pu2f0dtmev6pv2ca.apps.googleusercontent.com',
  });

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
  const handleEmailChange = text => {
    setEmail(text);
  };

  const handlePasswordChange = text => {
    setPassword(text);
  };
  const mutation = useMutation({
    mutationFn: async data => {
      return fetcher({
        method: 'POST',
        url: '/login',
        data,
      });
    },
    onSuccess: async data => {
      console.log(' login successful:', data);
      Alert.alert('Success', 'Account login successfully!');
      navigation.navigate('AddDeviceScreen');
    },
    onError: error => {
      console.error('login error:', error);
      Alert.alert('Error', 'Failed to login. Please try again.');
    },
  });
  const handleSubmit = () => {
    const payload = {
      email: email,
      password: password,
    };
    mutation.mutate(payload);
  };
  return (
    <MainBackground>
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
          placeholder="Email Address"
          keyboardType="email-address"
          value={email}
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          placeholderTextColor={theme.placeHolderText}
        />
      </View>
      <View style={Styles.textInputView}>
        <PasswordIcon marginRight={DimensionConstants.twelve} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={handlePasswordChange}
          placeholderTextColor={theme.placeHolderText}
        />
      </View>
      <Spacing height={DimensionConstants.eight} />
      <Text style={Styles.resetPasswordText}>
        I don’t remember password? <Text style={Styles.resetWord}>Reset</Text>
      </Text>
      <Spacing height={DimensionConstants.nine} />
      <CustomButton text={t('Login')} onPress={handleSubmit} />
      <Spacing height={DimensionConstants.sixteen} />
      <TouchableOpacity
        onPress={() => navigation.navigate('LoginWithMobileScreen')}>
        <Text style={Styles.loginWithPhone}>Login with phone number</Text>
      </TouchableOpacity>
      <Spacing height={DimensionConstants.fifty} />
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
        onPress={() => navigation.navigate('MainApp')}
      />
      <Spacing height={DimensionConstants.twentyFour} />
      <Text style={Styles.terms}>
        By clicking login you agree to recognates{' '}
        <Text style={Styles.termBlue}>Terms of use </Text>
        and <Text style={Styles.termBlue}>Privacy policy</Text>
      </Text>
    </MainBackground>
  );
};

export default LoginScreen;
