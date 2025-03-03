import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {DimensionConstants} from '../constants/DimensionConstants';

const FilterContainer = ({options, selected, onSelect, theme}) => {
  return (
    <View style={styles.filterContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(option)}
          style={[
            styles.filterButton,
            selected === option && {backgroundColor: theme.primary},
          ]}>
          <Text
            style={[
              styles.filterText,
              selected === option && {color: 'white'},
            ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    backgroundColor: 'white',
    borderColor: 'rgba(59, 65, 172, 0.2)',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: DimensionConstants.four,
    borderRadius: DimensionConstants.twentyNine,
    alignItems: 'center',
    // width : '80%'
  },
  filterButton: {
    paddingVertical: DimensionConstants.five,
    paddingHorizontal: DimensionConstants.fifteen,
    borderRadius: DimensionConstants.twenty,
  },
  filterText: {
    color: '#797C7E',
    fontWeight: '500',
    fontSize: DimensionConstants.fourteen,
  },
});

export default FilterContainer;
