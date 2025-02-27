import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import SafomeLogo from '../assets/icons/SafomeLogo';
import NotificationIcon from '../assets/icons/NotificationIcon';

const LogoHeader = ({ onPress }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
      }}>
      <SafomeLogo />
      <TouchableOpacity onPress={onPress}>
        <NotificationIcon />
      </TouchableOpacity>
    </View>
  );
};

export default LogoHeader;
