import {View, Text, Image} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {HomeScreenStyles} from '../screens/BottomTabScreens/HomeScreen/Styles/HomeScreenStyles';
import CustomCard from './CustomCard';
import {ImageConstants} from '../constants/ImageConstants';
import Spacing from './Spacing';
import {DimensionConstants} from '../constants/DimensionConstants';
import RightArrowIcon from '../assets/icons/RightArrowIcon';
const ContactCards = () => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = HomeScreenStyles(theme);
  return (
    <View style={styles.callContainer}>
      <CustomCard
        style={{
          width: '48%',
          backgroundColor: theme.primary,
        }}>
        <View style={styles.rowContainer}>
          <Image source={ImageConstants.avatar} style={styles.imageOne} />
          <Image source={ImageConstants.avatar2} style={styles.imageTwo} />
          <Image source={ImageConstants.avatar3} style={styles.imageTwo} />
          <Text style={styles.plusNumberText}>+57</Text>
        </View>
        <Spacing height={DimensionConstants.ten} />
        <Text style={styles.contactCardTitle}>Family</Text>
        <View style={styles.cardRowContainer}>
          <Text style={styles.cardNumber}>60</Text>
          <RightArrowIcon />
        </View>
      </CustomCard>
      <CustomCard
        style={{
          width: '48%',
          backgroundColor: '#FE605D',
        }}>
        <View style={styles.rowContainer}>
          <Image source={ImageConstants.avatar} style={styles.imageOne} />
          <Image source={ImageConstants.avatar2} style={styles.imageTwo} />
          <Image source={ImageConstants.avatar3} style={styles.imageTwo} />
          <Text style={styles.plusNumberText}>+52</Text>
        </View>
        <Spacing height={DimensionConstants.ten} />

        <Text style={styles.contactCardTitle}>Friends</Text>
        <View style={styles.cardRowContainer}>
          <Text style={styles.cardNumber}>55</Text>
          <RightArrowIcon />
        </View>
      </CustomCard>
    </View>
  );
};

export default ContactCards;
