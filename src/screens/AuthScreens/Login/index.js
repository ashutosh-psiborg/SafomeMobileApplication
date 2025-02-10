import {View, Text, Alert, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
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
import CustomHeader from '../../../components/CustomHeader';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {validationSchema} from '../../../utils/Validations';
import CommonForm from '../../../utils/CommonForm';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
const LoginScreen = ({navigation}) => {
  GoogleSignin.configure({
    webClientId:
      '1025510399527-a69gfibcttk2ad1vce67on7p9r6ddphe.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
    // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (response) {
        console.log({userInfo: response.data});
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      console.log(error);
    }
  };
  const {t} = useTranslation();

  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = loginStyles(theme);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema.pick(['email', 'password'])),
  });

  const fields = [
    {
      name: 'email',
      icon: <MailIcon />,
      placeholder: 'Email Address',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
    },
    {
      name: 'password',
      icon: <PasswordIcon />,
      placeholder: 'Password',
      secureTextEntry: true,
    },
  ];

  const mutation = useMutation({
    mutationFn: async data => {
      return fetcher({
        method: 'POST',
        url: 'auth/login',
        data,
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Account login successful!');
      navigation.navigate('AddDeviceScreen');
    },
    onError: error => {
      const errorMessage =
        error?.response?.data?.message || 'Failed to login. Please try again.';
      Alert.alert('Error', errorMessage);
    },
  });

  const onSubmit = async data => {
    console.log('🚀 Submitting Data:', data);
    mutation.mutate(data);
  };

  return (
    <MainBackground>
      <CustomHeader title={t('Welcome')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacing height={DimensionConstants.twentyFour} />
        <Text style={styles.signInText}>{t('Sign in to your Account')}</Text>
        <Spacing height={DimensionConstants.twentyFour} />
        <Text style={styles.enterMailText}>
          {t('Enter your email and password to get started.')}
        </Text>
        <Spacing height={DimensionConstants.twentyFour} />
        {/* ✅ Using CommonForm */}
        <CommonForm control={control} fields={fields} errors={errors} />
        <Spacing height={DimensionConstants.eight} />
        <Text style={styles.resetPasswordText}>
          {t('I don’t remember password?')}{' '}
          <Text style={styles.resetWord}>{t('Reset')}</Text>
        </Text>
        <Spacing height={DimensionConstants.nine} />
        <CustomButton text={t('Login')} onPress={handleSubmit(onSubmit)} />
        <Spacing height={DimensionConstants.sixteen} />
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginWithMobileScreen')}>
          <Text style={styles.loginWithPhone}>
            {t('Login with phone number')}
          </Text>
        </TouchableOpacity>
        <Spacing height={DimensionConstants.fifty} />
        <Text style={styles.continue}>{t('or continue with')}</Text>
        <CustomButton
          textColor={theme.blackText}
          borderColor={theme.buttonBorder}
          color={theme.background}
          text={t('Continue with Google')}
          icon={<GoogleIcon />}
          onPress={() => signIn()}
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
        <Text style={styles.terms}>
          {t('By clicking login you agree to recognates')}{' '}
          <Text style={styles.termBlue}>{t('Terms of use')}</Text> {t('and')}{' '}
          <Text style={styles.termBlue}>{t('Privacy policy')}</Text>
        </Text>
      </ScrollView>
    </MainBackground>
  );
};

export default LoginScreen;
