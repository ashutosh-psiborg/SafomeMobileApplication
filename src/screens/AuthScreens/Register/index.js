import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {View, Text, Alert} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
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
import {useForm} from 'react-hook-form';
import CommonForm from '../../../utils/CommonForm';
import MailIcon from '../../../assets/icons/MailIcon';
import DeviceCallIcon from '../../../assets/icons/DeviceCallIcon';
import CountryIcon from '../../../assets/icons/CountryIcon';
import FullNameIcon from '../../../assets/icons/FullNameIcon';

const RegisterScreen = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(
      validationSchema.pick(['fullName', 'email', 'phoneNumber', 'country']),
    ),
  });

  const {t} = useTranslation();
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = RegisterStyles(theme);
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  const fields = [
    {
      name: 'fullName',
      icon: <FullNameIcon />,
      placeholder: 'Full name',
      maxLength: 20,
      keyboardType: 'default',
    },
    {
      name: 'email',
      placeholder: 'Email address',
      icon: <MailIcon />,
      maxLength: 50,
      keyboardType: 'email-address',
    },
    {
      name: 'phoneNumber',
      placeholder: 'Phone Number',
      icon: <DeviceCallIcon />,
      maxLength: 10,
      keyboardType: 'phone-pad',
    },
    {
      name: 'country',
      options: [
        {label: 'Country', value: ''},
        {label: 'India', value: 'India'},
        {label: 'Australia', value: 'Australia'},
      ],
      icon: <CountryIcon />,
    },
  ];

  // const mutation = useMutation({
  //   mutationFn: async data => {
  //     return fetcher({
  //       method: 'POST',
  //       url: '/auth/register',
  //       data,
  //       noAuth: true,
  //     });
  //   },
  //   onSuccess: () => {
  //     Alert.alert('Success', 'Account created successfully!');
  //     navigation.navigate('VerifyMailOtpScreen');
  //   },
  //   onError: error => {
  //     const errorMessage = error?.response?.data?.message || 'Unknown error';
  //     Alert.alert('Error', errorMessage);
  //   },
  // });

  const onSubmit = async data => {
    console.log('🚀 Submitting Data:', data);
    // mutation.mutate(data);
    dispatch(setUserData(data));
  };

  return (
    <MainBackground>
      <CustomHeader
        backPress={() => navigation.goBack()}
        title={t('Create account')}
      />
      <Spacing height={DimensionConstants.twenty} />
      <View style={styles.container}>
        <View>
          <CommonForm control={control} fields={fields} errors={errors} />

          <Text
            style={{
              fontSize: 12,
              lineHeight: 22,
              fontWeight: '400',
              color: theme.grey,
            }}>
            {t('By creating an account, I agree to')}
            <Text style={{fontSize: 12, fontWeight: '500', color: '#005BBB'}}>
              {' '}
              {t('Terms of use')}{' '}
            </Text>
            {t('and ')}
            <Text style={{fontSize: 12, fontWeight: '500', color: '#005BBB'}}>
              {t('Privacy policy')}
            </Text>
          </Text>
        </View>
        <CustomButton
          text={t('Create account')}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </MainBackground>
  );
};

export default RegisterScreen;
