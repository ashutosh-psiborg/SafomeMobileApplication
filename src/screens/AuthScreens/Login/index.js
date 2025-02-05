import {View, Text, Alert, TouchableOpacity} from 'react-native';
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

const LoginScreen = ({navigation}) => {
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
    </MainBackground>
  );
};

export default LoginScreen;
