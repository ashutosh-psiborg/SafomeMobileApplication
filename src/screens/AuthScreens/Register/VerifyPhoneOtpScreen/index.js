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
const VerifyPhoneOtpScreen = ({navigation}) => {
  const user = useSelector(state => state.user);
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const [code, setCode] = useState('');
  const {t} = useTranslation();
  const styles = VerifyMailOtpStyles(theme);

  const handleChange = value => {
    setCode(value);
  };
  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      return fetcher({
        method: 'POST',
        url: 'auth/sendOtp',
        data: {
          contact: user.phoneNumber,
          purpose: 'REGISTRATION',
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
    if (user.phoneNumber) {
      sendOtpMutation.mutate();
    }
  }, [user.phoneNumber]);

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      return fetcher({
        method: 'POST',
        url: 'auth/verifyOTP',
        data: {contact: user.phoneNumber, purpose: 'REGISTRATION', otp: code},
      });
    },
    onSuccess: data => {
      console.log('Email verification successful:', data);
      Alert.alert('Success', 'Email verified successfully!');
      navigation.navigate('CreatePasswordScreen');
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
        title={t('Verify phone number')}
        backPress={() => navigation.goBack()}
      />
      <Spacing height={DimensionConstants.thirtyEight} />
      <Text style={styles.title}>{t('Please verify your Phone number')}</Text>
      <Spacing height={DimensionConstants.twentyFour} />
      <View style={{maxWidth: '80%'}}>
        <Text style={styles.infoText}>{t('We have sent OTP to')} </Text>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <Text style={styles.emailText}>{`+91 ${user.phoneNumber}`} </Text>
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
        <Text style={styles.footerText}>{t('OTP not recieved?')}</Text>
        <TouchableOpacity onPress={() => sendOtpMutation.mutate()}>
          <Text style={styles.resendText}> {t('Resend OTP')}</Text>
        </TouchableOpacity>
      </View>
    </MainBackground>
  );
};

export default VerifyPhoneOtpScreen;
