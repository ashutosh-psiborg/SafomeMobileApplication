import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {useTranslation} from 'react-i18next';
import Spacing from '../../../../components/Spacing';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import CustomButton from '../../../../components/CustomButton';
import GlobeIcon from '../../../../assets/icons/GlobeIcon';
import {VerifyMailOtpStyles} from '../VerifyMailOtpScreen/Styles/VerifyMailOtpStyles';
import {useSelector} from 'react-redux';

const VerifyPhoneOtpScreen = ({route, navigation}) => {
  const user = useSelector(state => state.user);
  const theme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const [code, setCode] = useState('');
  const {t} = useTranslation();
  const styles = VerifyMailOtpStyles(theme);

  const handleChange = value => {
    setCode(value);
  };

  return (
    <MainBackground>
      <CustomHeader
        title={t('Verify phone number')}
        backPress={() => navigation.goBack()}
      />
      <Spacing height={DimensionConstants.thirtyEight} />
      <Text style={styles.title}>{t('Please verify your Phone number')}</Text>
      <Spacing height={DimensionConstants.twentyFour} />
      <View style={{maxWidth: '80%'}}>
        <Text style={styles.infoText}>{t('We have sent OTP to')} </Text>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <Text style={styles.emailText}>{`+91 ${user.phoneNumber}`} </Text>
          <TouchableOpacity>
            <Text style={styles.edit}>Edit</Text>
          </TouchableOpacity>
          <Text style={styles.infoText}> {t('phone number')}</Text>
        </View>
        <Text style={styles.infoText}>Enter OTP below.</Text>
      </View>
      <Spacing height={DimensionConstants.thirtyOne} />
      <View style={styles.inputContainer}>
        <GlobeIcon />
        <TextInput
          style={styles.input}
          placeholder={t('Enter OTP')}
          value={code}
          onChangeText={text => handleChange(text)}
          keyboardType="phone-pad"
          placeholderTextColor={theme.placeHolderText}
          maxLength={6}
        />
      </View>
      <CustomButton
        onPress={() => navigation.navigate('CreatePasswordScreen')}
        text={t('Continue')}
      />
      <Spacing height={DimensionConstants.sixteen} />
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>{t('OTP not recieved?')}</Text>
        <TouchableOpacity>
          <Text style={styles.resendText}> {t('Resend OTP')}</Text>
        </TouchableOpacity>
      </View>
    </MainBackground>
  );
};

export default VerifyPhoneOtpScreen;
