import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import BackIcon from '../assets/icons/BackIcon';
import {DimensionConstants} from '../constants/DimensionConstants';

const CustomHeader = ({title, navigation, backPress, skip, onSkipPress}) => {
  return (
    <View style={styles.header}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={backPress}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      {skip && (
        <TouchableOpacity onPress={onSkipPress}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: DimensionConstants.fifteen,
    marginTop: DimensionConstants.fourteen,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '600',
    marginLeft: DimensionConstants.twentyFour,
  },
  skipText: {
    fontSize: DimensionConstants.fourteen,
    color: '#889CA3',
    fontWeight: '500',
  },
});

export default CustomHeader;
