import {View, Text} from 'react-native';
import React from 'react';
import SafomeLogo from '../assets/icons/SafomeLogo';
import NotificationIcon from '../assets/icons/NotificationIcon';
const LogoHeader = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
      }}>
      <SafomeLogo />
      <NotificationIcon />
    </View>
  );
};

export default LogoHeader;
