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
const SecurityPinScreen = () => {
  const theme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const {t} = useTranslation();
  const styles = BioMetricStyles(theme);

  const handlePinChange = text => {
    if (/^\d*$/.test(text) && text.length <= 4) {
      setPin(text);
      if (text.length === 4) {
        navigation.navigate('LoginScreen');
      }
    }
  };

  return (
    <MainBackground>
      <CustomHeader title={t('Biometric')} />
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
          secureTextEntry
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
