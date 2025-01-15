import {View, Text, TextInput,Alert} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
import GlobeIcon from '../../../assets/icons/GlobeIcon';
import RNPickerSelect from 'react-native-picker-select';
import CustomButton from '../../../components/CustomButton';
import CustomHeader from '../../../components/CustomHeader';
import {RegisterStyles} from './Styles/RegisterStyles';
import {useTheme} from '../../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { validationSchema } from '../../../utils/Validations';

const RegisterScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const styles = RegisterStyles(theme);
  const [signUpData, setSignUpData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    country: '',
  });

  const handleChange = (field, value) => {
    setSignUpData({...signUpData, [field]: value});
  };
  
  const handleSubmit = async () => {
    console.log('Submitting form data:', signUpData); // Log data at the beginning

    try {
      // await validationSchema.validate(signUpData, { abortEarly: false });

      console.log('Form data:', signUpData);
   navigation.navigate('VerifyMailOtpScreen',{email : signUpData.email , phoneNumber : signUpData.phoneNumber})
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errorMessages = err.inner.map((e) => e.message);
        console.log('Validation Errors:', errorMessages); // Log validation errors
        Alert.alert('Validation Error', errorMessages.join('\n'));
      } else {
        console.log('Other error:', err); // Log any other errors
        Alert.alert('Error', 'An unexpected error occurred.');
      }
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
            <View style={styles.textInput}>
              <GlobeIcon />
              <TextInput
                style={styles.inputField}
                placeholder={t('Full name')}
                value={signUpData.fullName}
                onChangeText={text => handleChange('fullName', text)}
                placeholderTextColor={theme.placeHolderText}
              />
            </View>

            <View style={styles.textInput}>
              <GlobeIcon />
              <TextInput
                style={styles.inputField}
                placeholder={t('Email Address')}
                value={signUpData.email}
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
                value={signUpData.phoneNumber}
                onChangeText={text => handleChange('phoneNumber', text)}
                keyboardType="phone-pad"
                placeholderTextColor={ theme.placeHolderText }
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
                      color: signUpData.country
                        ? theme.text
                        : theme.placeHolderText,
                    },
                    inputIOS: {
                      ...styles.pickerInput,
                      color: signUpData.country
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
        <CustomButton text={'Create account'} onPress={handleSubmit} />
      </View>
    </MainBackground>
  );
};

export default RegisterScreen;
