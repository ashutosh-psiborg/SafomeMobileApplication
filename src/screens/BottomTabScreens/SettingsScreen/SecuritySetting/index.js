import React, {useState} from 'react';
import {View, Text, ScrollView, Switch, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {useMutation} from '@tanstack/react-query';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import Spacing from '../../../../components/Spacing';
import CustomButton from '../../../../components/CustomButton';
import CustomCard from '../../../../components/CustomCard';
import SecurityIcon from '../../../../assets/icons/SecurityIcon';
import {useSelector} from 'react-redux';
import {SecurityScreenStyles} from './style';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import CommonForm from '../../../../utils/CommonForm';
import fetcher from '../../../../utils/ApiService'; // Assuming fetcher is your API utility

const SecurityScreen = ({route}) => {
  const navigation = useNavigation();
  const {appStrings} = useSelector(state => state.language);
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = SecurityScreenStyles(theme);

  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: payload =>
      fetcher({
        method: 'PATCH',
        url: '/user/createPassword',
        data: payload,
      }),
    onSuccess: () => {
      Alert.alert(
        'Success',
        'Password changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              reset(); // Clear form fields
              navigation.goBack();
            },
          },
        ],
        {cancelable: false},
      );
    },
    onError: error => {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to change password.',
      );
    },
  });

  const securityOptions = [
    {
      title:
        appStrings?.settings?.security?.biometric || 'Biometric Authentication',
      description: 'Use fingerprint or face recognition',
      value: isBiometricEnabled,
      onValueChange: () =>
        navigation.navigate('BioMetricScreen', {email: route.params.email}),
    },
  ];

  const passwordFields = [
    {
      name: 'currentPassword',
      placeholder:
        appStrings?.settings?.security?.currentPassword || 'Current Password',
      secureTextEntry: true,
    },
    {
      name: 'newPassword',
      placeholder:
        appStrings?.settings?.security?.newPassword || 'New Password',
      secureTextEntry: true,
    },
    {
      name: 'confirmPassword',
      placeholder:
        appStrings?.settings?.security?.confirmPassword || 'Confirm Password',
      secureTextEntry: true,
    },
  ];

  const validatePasswords = data => {
    const {currentPassword, newPassword, confirmPassword} = data;

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert(
          'Error',
          'Please fill in all password fields to change your password.',
        );
        return false;
      }
      if (newPassword.length < 8) {
        Alert.alert(
          'Error',
          'New password must be at least 8 characters long.',
        );
        return false;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New password and confirmation do not match.');
        return false;
      }
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        Alert.alert(
          'Error',
          'Password must contain at least one letter and one number.',
        );
        return false;
      }
    }
    return true;
  };

  const onSubmit = data => {
    if (!validatePasswords(data)) {
      return;
    }

    const settingsData = {
      twoFactor: isTwoFactorEnabled,
      biometric: isBiometricEnabled,
    };

    if (data.currentPassword && data.newPassword && data.confirmPassword) {
      // Prepare payload for password change API
      const passwordPayload = {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      };

      // Trigger the password change mutation
      changePasswordMutation.mutate(passwordPayload);
    } else {
      // Handle non-password settings save (if any)
      console.log('Saving settings:', settingsData);
      Alert.alert(
        'Success',
        'Settings saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <MainBackground noPadding style={{backgroundColor: theme.otpBox}}>
      <CustomHeader
        title={appStrings?.settings?.security?.text || 'Security'}
        backgroundColor="#ffffff"
        backPress={() => navigation.goBack()}
      />
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Spacing height={DimensionConstants.ten} />

            <View style={styles.headerContainer}>
              <SecurityIcon />
              <Text style={styles.headerText}>
                {appStrings?.settings?.security?.description ||
                  'Manage your security settings'}
              </Text>
            </View>

            <Spacing height={DimensionConstants.ten} />

            <CustomCard style={styles.securityCard}>
              {securityOptions.map((option, index) => (
                <View key={index}>
                  <View style={styles.optionRow}>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    </View>
                    <Switch
                      value={option.value}
                      onValueChange={option.onValueChange}
                      trackColor={{false: '#767577', true: theme.primary}}
                      thumbColor={option.value ? '#ffffff' : '#f4f3f4'}
                    />
                  </View>
                  {index < securityOptions.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </CustomCard>

            <Spacing height={DimensionConstants.ten} />

            <CustomCard style={styles.securityCard}>
              <Text style={styles.sectionTitle}>
                {appStrings?.settings?.security?.changePassword ||
                  'Change Password'}
              </Text>
              <Spacing height={DimensionConstants.ten} />
              <CommonForm
                control={control}
                fields={passwordFields}
                errors={errors}
              />
            </CustomCard>

            <Spacing height={DimensionConstants.sixty} />
          </View>
        </ScrollView>

        <View style={styles.footerContainer}>
          <CustomButton
            text={
              changePasswordMutation.isLoading
                ? 'Saving...'
                : appStrings?.settings?.save || 'Save Changes'
            }
            onPress={handleSubmit(onSubmit)}
            style={styles.saveButton}
            disabled={changePasswordMutation.isLoading}
          />
        </View>
      </View>
    </MainBackground>
  );
};

export default SecurityScreen;
