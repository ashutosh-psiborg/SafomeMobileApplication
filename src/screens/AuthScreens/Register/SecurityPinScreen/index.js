import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import Spacing from '../../../../components/Spacing';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {BioMetricStyles} from '../BioMetricScreen/Styles/BioMetricStyles';
import fetcher from '../../../../utils/ApiService';

const SecurityPinScreen = ({route}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const {t} = useTranslation();
  const styles = BioMetricStyles(theme);
  const user = useSelector(state => state.user);

  const handlePinChange = async text => {
    if (/^\d*$/.test(text) && text.length <= 4) {
      setPin(text);
      console.log(text);
      if (text.length === 4) {
        try {
          const payload = {
            mPin: text,
            email: user.email || route.params.email,
          };

          const response = await fetcher({
            method: 'POST',
            url: 'auth/bioMetric',
            data: payload,
          });

          Alert.alert('Success', 'mPin authenticated successfully!');
          console.log('mPin response:', response);

          navigation.navigate('LoginScreen');
        } catch (error) {
          console.error('mPin API error:', error);
          Alert.alert(
            'Error',
            'Failed to authenticate mPin. Please try again.',
          );
        }
      }
    }
  };

  return (
    <MainBackground>
      <CustomHeader
        title={t('Biometric')}
        backPress={() => navigation.goBack()}
        skip
        onSkipPress={() => navigation.navigate('LoginScreen')}
      />
      <Spacing height={DimensionConstants.thirtyEight} />
      <Text style={styles.title}>Add security</Text>
      <Text style={styles.title}>Pin</Text>
      <Spacing height={DimensionConstants.twentyFour} />
      <Text style={[styles.infoText, {color: theme.lightText}]}>
        {t('Enter 4 digit security pin')}
      </Text>
      <Spacing height={DimensionConstants.thirtyEight} />
      <View>
        <TextInput
          style={styles.pinInput}
          keyboardType="number-pad"
          value={pin}
          onChangeText={handlePinChange}
          maxLength={4}
          autoFocus={true}
        />
      </View>
    </MainBackground>
  );
};

export default SecurityPinScreen;
