import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const FilterContainer = ({ options, selected, onSelect, theme }) => {
  return (
    <View style={styles.filterContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(option)}
          style={[
            styles.filterButton,
            selected === option && { backgroundColor: theme.primary },
          ]}>
          <Text
            style={[
              styles.filterText,
              selected === option && { color: 'white' },
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
    padding: 4,
    borderRadius: 29,
    alignItems: 'center',
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  filterText: {
    color: '#797C7E',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default FilterContainer;
