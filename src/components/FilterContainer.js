import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {Surface} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {DimensionConstants} from '../constants/DimensionConstants';

const FilterContainer = ({options, selected, onSelect, theme}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleOptionPress = option => {
    if (option === 'Custom') {
      setShowPicker(true);
    } else {
      onSelect(option);
    }
  };
  console.log('-=-=-=-=-=-=-=', selected);
  const onDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate && event.type === 'set') {
      onSelect({
        label: 'Custom',
        startDate: selectedDate,
        endDate: selectedDate,
      });
    }
    if (event.type === 'dismissed' || !selectedDate) {
      setShowPicker(false);
    }
  };

  const styles = StyleSheet.create({
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: DimensionConstants.two,
      backgroundColor: theme.background,
      borderRadius: DimensionConstants.thirty,

      elevation: 2,
    },
    filterButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: DimensionConstants.eight,
      borderRadius: DimensionConstants.twentyFive,
    },
    selectedButton: {
      backgroundColor: theme.primary,
    },
    unselectedButton: {
      backgroundColor: theme.background,
    },
    filterText: {
      fontSize: DimensionConstants.twelve,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    selectedText: {
      color: theme.background,
    },
    unselectedText: {
      color: theme.primary,
    },
  });

  return (
    <Surface style={styles.filterContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          onPress={() => handleOptionPress(option)}
          style={[
            styles.filterButton,
            selected === option ||
            (selected?.label === 'Custom' && option === 'Custom')
              ? styles.selectedButton
              : styles.unselectedButton,
          ]}>
          <Text
            style={[
              styles.filterText,
              selected === option ||
              (selected?.label === 'Custom' && option === 'Custom')
                ? styles.selectedText
                : styles.unselectedText,
            ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
      {showPicker && (
        <DateTimePicker
          mode="date"
          display="default"
          maximumDate={new Date()}
          value={new Date()}
          onChange={onDateChange}
        />
      )}
    </Surface>
  );
};

export default FilterContainer;
