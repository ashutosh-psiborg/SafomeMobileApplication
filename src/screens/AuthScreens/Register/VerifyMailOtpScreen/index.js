import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {useTranslation} from 'react-i18next';
import Spacing from '../../../../components/Spacing';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import CustomButton from '../../../../components/CustomButton';
import GlobeIcon from '../../../../assets/icons/GlobeIcon';
import {VerifyMailOtpStyles} from './Styles/VerifyMailOtpStyles';
import {useSelector, useDispatch} from 'react-redux';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';
import {setUserData} from '../../../../redux/slices/userSlice';

const VerifyMailOtpScreen = ({route, navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const dispatch = useDispatch();

  const [code, setCode] = useState('');
  const {t} = useTranslation();
  const styles = VerifyMailOtpStyles(theme);
  const user = useSelector(state => state.user);
  console.log('+++', user);
  const handleChange = value => {
    setCode(value);
  };

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      return fetcher({
        method: 'POST',
        url: '/auth/sendOtp',
        data: {
          contact: user.email,
          type: 'EMAIL',
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

  useEffect(() => {
    if (user.email) {
      sendOtpMutation.mutate();
    }
  }, [user.email]);

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const data = {
        contact: user?.email,
        type: 'EMAIL',
        otp: code,
      };
      return fetcher({
        method: 'POST                                                    ',
        url: 'auth/verifyEmail',
        data,
      });
    },
    onSuccess: data => {
      console.log('Email verification successful:', data);
      Alert.alert('Success', 'Email verified successfully!');
      dispatch(setUserData({emailToken: data?.token}));

      navigation.navigate('VerifyPhoneOtpScreen');
    },
    onError: error => {
      console.error('Email verification failed:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    },
  });

  const handleVerify = () => {
    if (code.length < 4) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }
    verifyOtpMutation.mutate();
  };

  return (
    <MainBackground>
      <CustomHeader
        title={t('Verify Email')}
        backPress={() => navigation.goBack()}
      />
      <Spacing height={DimensionConstants.thirtyEight} />
      <Text style={styles.title}>{t('Please verify your Email address')}</Text>
      <Spacing height={DimensionConstants.twentyFour} />
      <View style={{maxWidth: '80%'}}>
        <Text style={styles.infoText}>{t('We have sent you a code to')} </Text>
        <Text style={styles.infoText}>
          <Text style={styles.emailText}>{user.email}</Text>{' '}
          {t('Enter the code below.')}
        </Text>
      </View>
      <Spacing height={DimensionConstants.thirtyOne} />
      <View style={styles.inputContainer}>
        <GlobeIcon />
        <TextInput
          style={styles.input}
          placeholder={t('Enter code')}
          value={code}
          onChangeText={handleChange}
          keyboardType="number-pad"
          placeholderTextColor={theme.placeHolderText}
          maxLength={4}
        />
      </View>
      <CustomButton onPress={handleVerify} text={t('Continue')} />
      <Spacing height={DimensionConstants.sixteen} />
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>{t('Don’t see an email?')}</Text>
        <TouchableOpacity onPress={() => sendOtpMutation.mutate()}>
          <Text style={styles.resendText}> {t('Resend')}</Text>
        </TouchableOpacity>
      </View>
    </MainBackground>
  );
};

export default VerifyMailOtpScreen;
