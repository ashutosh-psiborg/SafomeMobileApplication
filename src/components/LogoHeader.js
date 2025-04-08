import {View, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import SafomeLogo from '../assets/icons/SafomeLogo';
import NotificationIcon from '../assets/icons/NotificationIcon';
import {DimensionConstants} from '../constants/DimensionConstants';

const LogoHeader = ({onPress, title}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
      }}>
      <SafomeLogo />
      <Text
        style={{
          fontSize: DimensionConstants.twenty,
          fontWeight: '500',
          marginRight: DimensionConstants.twentyThree,
        }}>
        {title}
      </Text>

      <TouchableOpacity onPress={onPress}>
        <NotificationIcon />
      </TouchableOpacity>
    </View>
  );
};

export default LogoHeader;
