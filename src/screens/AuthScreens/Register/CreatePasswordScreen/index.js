import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import * as Yup from 'yup';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import Spacing from '../../../../components/Spacing';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import CustomButton from '../../../../components/CustomButton';
import GlobeIcon from '../../../../assets/icons/GlobeIcon';
import {VerifyMailOtpStyles} from '../VerifyMailOtpScreen/Styles/VerifyMailOtpStyles';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';

const CreatePasswordScreen = ({route, navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const {t} = useTranslation();
  const styles = VerifyMailOtpStyles(theme);

  // State management
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Password validation schema using Yup
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[@$!%*?&]/,
        'Password must contain at least one special character (@, $, !, %, *, ?, &)',
      ),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  // React Query mutation for API call
  const mutation = useMutation({
    mutationFn: async newPassword => {
      return fetcher({
        method: 'POST',
        url: '/createNewPassword',
        data: {
          newPassword: newPassword,
        },
      });
    },
    onSuccess: data => {
      console.log('Password created successfully:', data);
      navigation.navigate('BioMetricScreen');
    },
    onError: error => {
      console.error('Failed to create password', error);
    },
  });

  const handleCreatePassword = async () => {
    try {
      // Validate inputs
      await validationSchema.validate(
        {password, confirmPassword},
        {abortEarly: false},
      );
      setErrors({}); // Clear previous errors

      // Proceed with API call if validation passes
      mutation.mutate(password);
    } catch (validationError) {
      // Handle validation errors
      const newErrors = {};
      validationError.inner.forEach(err => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <MainBackground>
      <CustomHeader
        title={t('Password')}
        backPress={() => navigation.goBack()}
      />
      <Spacing height={DimensionConstants.thirtyEight} />
      <Text style={styles.title}>{t('Please enter new Password')}</Text>
      <Spacing height={DimensionConstants.twentyFour} />
      <Text style={styles.infoText}>
        {t('Enter a new password to secure your account.')}
      </Text>

      <Spacing height={DimensionConstants.thirtyOne} />
      <View
        style={[
          styles.inputContainer,
          ,
          errors.password && {borderColor: 'red'},
        ]}>
        <GlobeIcon />
        <TextInput
          style={[styles.input, errors.password && {borderColor: 'red'}]}
          placeholder={t('Create password')}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={theme.placeHolderText}
          secureTextEntry
        />
      </View>
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <Spacing height={DimensionConstants.fifteen} />
      <View
        style={[
          styles.inputContainer,
          ,
          errors.confirmPassword && {borderColor: 'red'},
        ]}>
        <GlobeIcon />
        <TextInput
          style={[styles.input, errors.confirmPassword && {borderColor: 'red'}]}
          placeholder={t('Verify password')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor={theme.placeHolderText}
          secureTextEntry
        />
      </View>
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

      <Spacing height={DimensionConstants.sixteen} />
      <CustomButton onPress={handleCreatePassword} text={t('Continue')} />
    </MainBackground>
  );
};

export default CreatePasswordScreen;
