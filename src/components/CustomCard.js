import React from 'react';
import {View, StyleSheet} from 'react-native';
import { DimensionConstants } from '../constants/DimensionConstants';

const CustomCard = ({children, style}) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: DimensionConstants.fifteen,
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden', // Ensures content is clipped if it exceeds the card's bounds
  },
});

export default CustomCard;
