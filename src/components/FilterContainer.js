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
            selected === option
              ? {backgroundColor: theme.primary}
              : {backgroundColor: 'white', borderColor: theme.primary, borderWidth: 1},
          ]}>
          <Text
            style={[
              styles.filterText,
              selected === option ? {color: 'white'} : {color: theme.primary},
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: DimensionConstants.four,
    borderRadius: DimensionConstants.twentyNine,
    alignItems: 'center',
    width: '70%',
    // backgroundColor: 'white', // Background of the filter container
  },
  filterButton: {
    paddingVertical: DimensionConstants.five,
    paddingHorizontal: DimensionConstants.fifteen,
    borderRadius: DimensionConstants.twenty,
  },
  filterText: {
    fontWeight: '500',
    fontSize: DimensionConstants.fourteen,
  },
});

export default FilterContainer;
