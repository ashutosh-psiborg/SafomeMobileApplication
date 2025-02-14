import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {RadioButton} from 'react-native-paper';
import CustomCard from './CustomCard';
import {DimensionConstants} from '../constants/DimensionConstants';

const RadioButtonCard = ({data, onSelect, selected, useView}) => {
  const Wrapper = useView ? View : CustomCard;

  return (
    <Wrapper style={styles.card}>
      {data.map((item, index) => (
        <View key={index}>
          <TouchableOpacity onPress={() => onSelect(index)} style={styles.option}>
            <Text style={styles.optionText}>{item.label}</Text>
            <RadioButton
              value={index}
              status={selected === index ? 'checked' : 'unchecked'}
              onPress={() => onSelect(index)}
              color="#0279E1"
              uncheckedColor="#0279E1"
            />
          </TouchableOpacity>
          {item.line !== 'no' && <View style={styles.separator} />}
        </View>
      ))}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    borderRadius: DimensionConstants.twelve,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DimensionConstants.fifteen,
    paddingVertical: DimensionConstants.ten,
  },
  optionText: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    height: DimensionConstants.one,
  },
});

export default RadioButtonCard;
