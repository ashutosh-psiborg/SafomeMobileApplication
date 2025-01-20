import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const NotificationsScreen = () => {
  const {t, i18n} = useTranslation();
  return (
    <View>
      <Text style={{color:'black'}}>
        { t('hello') }{' '}{t('world')}
      </Text>
    </View>
  );
};


export default NotificationsScreen;
