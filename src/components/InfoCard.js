import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {DimensionConstants} from '../constants/DimensionConstants';

const InfoCard = ({title, description, isEnabled, onToggle}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.description}>{description}</Text>
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{false: '#ccc', true: 'rgba(0, 91, 187, 0.1)'}}
          thumbColor={isEnabled ? '#0279E1' : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    paddingVertical: DimensionConstants.nine,
    paddingHorizontal: DimensionConstants.eighteen,
    borderRadius: DimensionConstants.ten,
  },
  heading: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '600',
    marginBottom: DimensionConstants.eight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    flexShrink: 1,
    marginRight: DimensionConstants.ten,
    fontSize: DimensionConstants.twelve,
    color: '#555',
    lineHeight: DimensionConstants.twenty,
  },
});
