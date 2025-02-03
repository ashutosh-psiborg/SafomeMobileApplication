import * as Yup from 'yup';
import {View, Text, TextInput, Alert} from 'react-native';
import React, {useState} from 'react';
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
import {validationSchema} from '../../../utils/Validations';
import Spacing from '../../../components/Spacing';
import {DimensionConstants} from '../../../constants/DimensionConstants';

const RegisterScreen = ({navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const {t} = useTranslation();
  const styles = RegisterStyles(theme);
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  const [errors, setErrors] = useState({}); 

  const handleChange = (field, value) => {
    dispatch(setUserData({...userData, [field]: value}));
    setErrors(prevErrors => ({...prevErrors, [field]: ''})); 
  };

  const mutation = useMutation({
    mutationFn: async data => {
      return fetcher({
        method: 'POST',
        url: '/auth/register',
        data,
        noAuth: true,
      });
    },
    onSuccess: async data => {
      console.log('Registration successful:', data);
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('VerifyMailOtpScreen');
    },
    onError: error => {
      const errorMessage = error?.response?.data?.message || 'Unknown error';
      console.log('=====', errorMessage);
      console.error('Registration error:', error);
      Alert.alert(
        'Error',
        'Failed to register. Please try again.',
        errorMessage,
      );
    },
  });

  const handleSubmit = async () => {
    try {
      console.log('++++++++++++=');
      //  await validationSchema.validate(userData, {abortEarly: false});
      mutation.mutate(userData);
    } catch (error) {
      let newErrors = {};
      error.inner.forEach(err => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
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
            <View
              style={[
                styles.textInput,
                errors.fullName && {borderColor: 'red'},
              ]}>
              <GlobeIcon />
              <TextInput
                style={[styles.inputField, errors.fullName && {color: 'red'}]}
                placeholder={t('Full name')}
                value={userData.fullName}
                onChangeText={text => handleChange('fullName', text)}
                placeholderTextColor={theme.placeHolderText}
              />
            </View>
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            )}

            {/* Email Input */}
            <View
              style={[styles.textInput, errors.email && {borderColor: 'red'}]}>
              <GlobeIcon />
              <TextInput
                style={[styles.inputField, errors.email && {color: 'red'}]}
                placeholder={t('Email Address')}
                value={userData.email}
                onChangeText={text => handleChange('email', text)}
                keyboardType="email-address"
                placeholderTextColor={theme.placeHolderText}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            {/* Phone Number Input */}
            <View
              style={[
                styles.textInput,
                errors.phoneNumber && {borderColor: 'red'},
              ]}>
              <GlobeIcon />
              <TextInput
                style={[
                  styles.inputField,
                  errors.phoneNumber && {color: 'red'},
                ]}
                placeholder={t('Phone number')}
                value={userData.phoneNumber}
                onChangeText={text => handleChange('phoneNumber', text)}
                keyboardType="phone-pad"
                placeholderTextColor={theme.placeHolderText}
                maxLength={10}
              />
            </View>
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}

            {/* Country Picker */}
            <View
              style={[
                styles.textInput,
                errors.country && {borderColor: 'red'},
              ]}>
              <GlobeIcon />
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={value => handleChange('country', value)}
                  items={[
                    {label: 'India', value: 'India'},
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
            {errors.country && (
              <Text style={styles.errorText}>{errors.country}</Text>
            )}
            <Spacing height={DimensionConstants.twenty} />
            {/* Terms and Conditions */}
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

        {/* Submit Button */}
        <CustomButton text={t('Create account')} onPress={handleSubmit} />
      </View>
    </MainBackground>
  );
};

export default RegisterScreen;
