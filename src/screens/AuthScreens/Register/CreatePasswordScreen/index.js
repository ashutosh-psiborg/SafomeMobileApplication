import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
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
import {validationSchema} from '../../../../utils/Validations';
const CreatePasswordScreen = ({route, navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const {t} = useTranslation();
  const styles = VerifyMailOtpStyles(theme);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

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
      console.log("+++____")
      await validationSchema.validate(
        {password, confirmPassword},
        {abortEarly: false},
      );
      setErrors({});

      mutation.mutate(password);
    } catch (validationError) {
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
