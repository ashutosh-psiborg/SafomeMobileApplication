import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const DevicesScreen = () => {
  const {t, i18n} = useTranslation();
  return (
    <View>
      <Text style={{color:'black'}}>
       this is devices screen
      </Text>
    </View>
  );
};


export default DevicesScreen;
