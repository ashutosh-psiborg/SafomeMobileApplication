import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import MainBackground from '../../../components/MainBackground';
import {ImageConstants} from '../../../constants/ImageConstants';
import Spacing from '../../../components/Spacing';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import CustomButton from '../../../components/CustomButton';
const WelcomeScreen = ({navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  const {t} = useTranslation();

  return (
    <MainBackground>
      <Spacing height={DimensionConstants.fourteen} />
      <Text style={styles.titleText}>{t('Welcome')}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacing height={DimensionConstants.fortyTwo} />

        <Image source={ImageConstants.welcomeImage} style={styles.image} />
        <Spacing height={DimensionConstants.fortyTwo} />
        <View style={styles.textContainer}>
          <Text style={[styles.headerText, {color: theme.secondary}]}>
            {t('Be Ready Anytime')}
          </Text>
          <Spacing height={DimensionConstants.sixteen} />
          <Text style={[styles.descriptionText, {color: theme.grey}]}>
            {t('Familiarize yourself with the SOS button')}
          </Text>
          <Text style={[styles.descriptionText, {color: theme.grey}]}>
            {t("Practice in a safe space to ensure you're")}
          </Text>
          <Text style={[styles.descriptionText, {color: theme.grey}]}>
            {t('ready anytime.')}
          </Text>
        </View>
        <Spacing height={DimensionConstants.thirtyTwo} />

        <CustomButton
          text={t('Sign in')}
          onPress={() => navigation.navigate('LoginScreen')}
        />
        <CustomButton
          borderColor={theme.borderColor}
          onPress={() => navigation.navigate('RegisterScreen')}
          color={'#fff'}
          textColor={'#000'}
          text={t('Create account')}
        />
      </ScrollView>
    </MainBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  titleText: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  image: {
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: DimensionConstants.twentyTwo,
  },
});
