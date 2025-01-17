import {View, Text, TextInput, Alert} from 'react-native';
import React from 'react';
import MainBackground from '../../../components/MainBackground';
import GlobeIcon from '../../../assets/icons/GlobeIcon';
import RNPickerSelect from 'react-native-picker-select';
import CustomButton from '../../../components/CustomButton';
import CustomHeader from '../../../components/CustomHeader';
import {RegisterStyles} from './Styles/RegisterStyles';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import {setUserData} from '../../../redux/slices/userSlice';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../../utils/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const RegisterScreen = ({navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const {t} = useTranslation();
  const styles = RegisterStyles(theme);
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  const handleChange = (field, value) => {
    dispatch(setUserData({...userData, [field]: value}));
  };

  const mutation = useMutation({
    mutationFn: async data => {
      return fetcher({
        method: 'POST',
        url: '/register',
        data,
      });
    },
    onSuccess: async data => {
      console.log('Registration successful:', data);

      // ✅ Extract and store the token
      if (data?.token) {
        try {
          await AsyncStorage.setItem('authToken', data.token);
          console.log('Token stored successfully:', data.token);
        } catch (error) {
          console.error('Error storing token:', error);
        }
      }

      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('VerifyMailOtpScreen');
    },
    onError: error => {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    },
  });

  const handleSubmit = () => {
    console.log('Submitting form data:', userData);
    mutation.mutate(userData);
  };

  return (
    <MainBackground>
      <View style={styles.container}>
        <View>
          <CustomHeader
            backPress={() => navigation.goBack()}
            title={t('Create account')}
          />
          <View style={styles.formContainer}>
            <View style={styles.textInput}>
              <GlobeIcon />
              <TextInput
                style={styles.inputField}
                placeholder={t('Full name')}
                value={userData.fullName}
                onChangeText={text => handleChange('fullName', text)}
                placeholderTextColor={theme.placeHolderText}
              />
            </View>

            <View style={styles.textInput}>
              <GlobeIcon />
              <TextInput
                style={styles.inputField}
                placeholder={t('Email Address')}
                value={userData.email}
                onChangeText={text => handleChange('email', text)}
                keyboardType="email-address"
                placeholderTextColor={theme.placeHolderText}
              />
            </View>

            <View style={styles.textInput}>
              <GlobeIcon />
              <TextInput
                style={styles.inputField}
                placeholder={t('Phone number')}
                value={userData.phoneNumber}
                onChangeText={text => handleChange('phoneNumber', text)}
                keyboardType="phone-pad"
                placeholderTextColor={theme.placeHolderText}
                maxLength={10}
              />
            </View>

            <View style={styles.textInput}>
              <GlobeIcon />
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={value => handleChange('country', value)}
                  items={[
                    {label: 'India', value: 'India'},
                    {label: 'United States', value: 'United States'},
                    {label: 'Australia', value: 'Australia'},
                  ]}
                  style={{
                    inputAndroid: {
                      ...styles.pickerInput,
                      color: userData.country
                        ? theme.text
                        : theme.placeHolderText,
                    },
                    inputIOS: {
                      ...styles.pickerInput,
                      color: userData.country
                        ? theme.text
                        : theme.placeHolderText,
                    },
                    placeholder: {
                      color: theme.placeHolderText,
                    },
                  }}
                  placeholder={{
                    label: t('Country'),
                    value: null,
                  }}
                />
              </View>
            </View>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 22,
                fontWeight: '400',
                color: theme.grey,
              }}>
              {t('By creating an account , I agree to')}
              <Text style={{fontSize: 12, fontWeight: '500', color: '#005BBB'}}>
                {' '}
                {t('Terms of use')}{' '}
              </Text>
              {t('and')}{' '}
              <Text style={{fontSize: 12, fontWeight: '500', color: '#005BBB'}}>
                {t('Privacy policy')}
              </Text>
            </Text>
          </View>
        </View>
        <CustomButton text={t('Create account')} onPress={handleSubmit} />
      </View>
    </MainBackground>
  );
};

export default RegisterScreen;
