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

const CreatePasswordScreen = ({route, navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {t} = useTranslation();
  const styles = VerifyMailOtpStyles(theme);
  const mutation = useMutation({
    mutationFn: async () => {
      return fetcher({
        method: 'POST',
        url: '/createNewPassword',
        data: {
          newPassword: confirmPassword,
        },
      });
    },
    onSuccess: data => {
      console.log('created Password successfully:', data);
      navigation.navigate('BioMetricScreen');
    },
    onError: error => {
      console.error('Failed to create Password', error);
    },
  });

  const handleCreatePassword = () => {
    if (password === confirmPassword) {
      mutation.mutate();
    } else {
      Alert('password and confirm password should match');
    }
  };
  const handleChange = value => {
    setPassword(value);
  };
  const handleConfirmChange = value => {
    setConfirmPassword(value);
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
        {t('Enter new password to secure your account.')}{' '}
      </Text>

      <Spacing height={DimensionConstants.thirtyOne} />
      <View style={styles.inputContainer}>
        <GlobeIcon />
        <TextInput
          style={styles.input}
          placeholder={t('Create password')}
          value={password}
          onChangeText={text => handleChange(text)}
          placeholderTextColor={theme.placeHolderText}
        />
      </View>
      <Spacing height={DimensionConstants.fifteen} />
      <View style={styles.inputContainer}>
        <GlobeIcon />
        <TextInput
          style={styles.input}
          placeholder={t('Verify password')}
          value={confirmPassword}
          onChangeText={text => handleConfirmChange(text)}
          placeholderTextColor={theme.placeHolderText}
        />
      </View>
      <Spacing height={DimensionConstants.sixteen} />
      <CustomButton
        onPress={handleCreatePassword}
        text={t('Continue')}
      />
    </MainBackground>
  );
};

export default CreatePasswordScreen;
