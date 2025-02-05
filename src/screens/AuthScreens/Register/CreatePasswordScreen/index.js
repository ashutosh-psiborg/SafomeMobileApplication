import {View, Text, Alert} from 'react-native';
import React from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import Spacing from '../../../../components/Spacing';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import CustomButton from '../../../../components/CustomButton';
import {VerifyMailOtpStyles} from '../VerifyMailOtpScreen/Styles/VerifyMailOtpStyles';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';
import {validationSchema} from '../../../../utils/Validations';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import CommonForm from '../../../../utils/CommonForm';
import GlobeIcon from '../../../../assets/icons/GlobeIcon';
import PasswordIcon from '../../../../assets/icons/PasswordIcon';

const CreatePasswordScreen = ({navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const {t} = useTranslation();
  const styles = VerifyMailOtpStyles(theme);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(
      validationSchema.pick(['password', 'confirmPassword']),
    ),
  });

  // Fields for CommonForm
  const fields = [
    {
      name: 'password',
      icon: <PasswordIcon />,
      placeholder: t('Create password'),
      secureTextEntry: true,
    },
    {
      name: 'confirmPassword',
      icon: <PasswordIcon />,
      placeholder: t('Verify password'),
      secureTextEntry: true,
    },
  ];

  const mutation = useMutation({
    mutationFn: async data => {
      return fetcher({
        method: 'POST',
        url: 'auth/createNewPassword',
        data: {newPassword: data.password},
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Password created successfully!');
      navigation.navigate('BioMetricScreen');
    },
    onError: error => {
      const errorMessage =
        error?.response?.data?.message || 'Failed to create password';
      Alert.alert('Error', errorMessage);
    },
  });

  const onSubmit = async data => {
    console.log('🚀 Submitting Data:', data);
    mutation.mutate(data);
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

      {/* ✅ Using CommonForm */}
      <CommonForm control={control} fields={fields} errors={errors} />

      <Spacing height={DimensionConstants.sixteen} />
      <CustomButton onPress={handleSubmit(onSubmit)} text={t('Continue')} />
    </MainBackground>
  );
};

export default CreatePasswordScreen;
