import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext'

const NotificationsScreen = () => {
  const {t, i18n} = useTranslation();
  const { theme } = useTheme();
console.log("===",theme)
  return (
    <View style={{backgroundColor :theme.background,flex:1,justifyContent: 'center',alignItems:'center'}}>
      <Text style={{color:theme.text}}>
        { t('hello') }{' '}{t('world')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;
