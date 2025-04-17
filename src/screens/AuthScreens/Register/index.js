import {yupResolver} from '@hookform/resolvers/yup';
import {View, Text} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomButton from '../../../components/CustomButton';
import CustomHeader from '../../../components/CustomHeader';
import {RegisterStyles} from './Styles/RegisterStyles';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import {setUserData} from '../../../redux/slices/userSlice';
import {validationSchema} from '../../../utils/Validations';
import Spacing from '../../../components/Spacing';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import {useForm} from 'react-hook-form';
import CommonForm from '../../../utils/CommonForm';
import MailIcon from '../../../assets/icons/MailIcon';
import DeviceCallIcon from '../../../assets/icons/DeviceCallIcon';
import CountryIcon from '../../../assets/icons/CountryIcon';
import FullNameIcon from '../../../assets/icons/FullNameIcon';

// Utility function to extract numeric country code (e.g., "+91" from "India (+91)")
const extractCountryCode = countryCodeStr => {
  const match = countryCodeStr.match(/\(([^)]+)\)/); // Extract text inside parentheses
  return match ? match[1] : '+91'; // Fallback to '+91' if extraction fails
};

// Utility function to remove '+' from country code
const stripPlusFromCountryCode = countryCode => {
  return countryCode.replace(/^\+/, ''); // Remove leading '+' if present
};

const RegisterScreen = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(
      validationSchema.pick(['fullName', 'email', 'phoneNumber']),
    ),
  });
  const [countryCode, setCountryCode] = useState('India (+91)');
  const {t} = useTranslation();
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = RegisterStyles(theme);
  const dispatch = useDispatch();

  const fields = [
    {
      name: 'fullName',
      icon: <FullNameIcon />,
      placeholder: t('Full name'),
      maxLength: 20,
      keyboardType: 'default',
    },
    {
      name: 'email',
      placeholder: t('Email address'),
      icon: <MailIcon />,
      maxLength: 50,
      keyboardType: 'email-address',
    },
    {
      name: 'phoneNumber',
      placeholder: t('Phone Number'),
      icon: <DeviceCallIcon viewBoxSize={24} size={24} />,
      maxLength: 10,
      keyboardType: 'phone-pad',
      showCountryCodeDropdown: true,
      countryCodes: [
        {label: 'India (+91)', value: 'India (+91)'},
        {label: 'Australia (+61)', value: 'Australia (+61)'},
      ],
    },
  ];

  const onSubmit = data => {
    const numericCountryCode = extractCountryCode(countryCode); // e.g., "+91"
    const countryCodeWithoutPlus = stripPlusFromCountryCode(numericCountryCode); // e.g., "91"
    const combinedPhoneNumber = `${countryCodeWithoutPlus}${data.phoneNumber}`; // e.g., "917903341259"

    const formPayload = {
      ...data,
      phoneNumber: combinedPhoneNumber, // Store combined phone number
      countryCode, // Keep original countryCode for display
    };
    console.log('||||', formPayload);

    dispatch(setUserData(formPayload));
    navigation.navigate('VerifyMailOtpScreen');
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
          <CommonForm
            control={control}
            fields={fields}
            errors={errors}
            setCountryCode={setCountryCode}
            countryCode={countryCode}
          />

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
