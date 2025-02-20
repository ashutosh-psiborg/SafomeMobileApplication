import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {HomeScreenStyles} from '../screens/BottomTabScreens/HomeScreen/Styles/HomeScreenStyles';
import CustomCard from './CustomCard';
import {ImageConstants} from '../constants/ImageConstants';
import Spacing from './Spacing';
import {DimensionConstants} from '../constants/DimensionConstants';
import RightArrowIcon from '../assets/icons/RightArrowIcon';

const ContactCards = ({familyCardPress, friendCardPress}) => {
  const contactGroups = [
    {
      title: 'Family',
      count: 60,
      extraCount: 57,
      backgroundColorKey: 'primary',
      navigation: familyCardPress,
    },
    {
      title: 'Friends',
      count: 55,
      extraCount: 52,
      backgroundColor: '#FE605D',
      navigation: friendCardPress,
    },
  ];
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = HomeScreenStyles(theme);

  return (
    <View style={styles.callContainer}>
      {contactGroups.map(
        (
          {
            title,
            count,
            extraCount,
            backgroundColorKey,
            backgroundColor,
            navigation,
          },
          index,
        ) => (
          <CustomCard
            key={index}
            style={{
              width: '48%',
              backgroundColor: backgroundColorKey
                ? theme[backgroundColorKey]
                : backgroundColor,
            }}>
            <View style={styles.rowContainer}>
              <Image source={ImageConstants.avatar} style={styles.imageOne} />
              <Image source={ImageConstants.avatar2} style={styles.imageTwo} />
              <Image source={ImageConstants.avatar3} style={styles.imageTwo} />
              <Text style={styles.plusNumberText}>+{extraCount}</Text>
            </View>
            <Spacing height={DimensionConstants.ten} />
            <Text style={styles.contactCardTitle}>{title}</Text>
            <View style={styles.cardRowContainer}>
              <Text style={styles.cardNumber}>{count}</Text>
              <TouchableOpacity onPress={navigation}>
                <RightArrowIcon />
              </TouchableOpacity>
            </View>
          </CustomCard>
        ),
      )}
    </View>
  );
};

export default ContactCards;
