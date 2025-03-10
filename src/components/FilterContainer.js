import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
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

  const onDateChange = (event, selectedDate) => {
    setShowPicker(false); // Hide picker after selection
    if (selectedDate) {
      onSelect({
        label: 'Custom',
        startDate: selectedDate,
        endDate: selectedDate,
      });
    }
  };

  return (
    <View style={styles.filterContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          onPress={() => handleOptionPress(option)}
          style={[
            styles.filterButton,
            selected === option || (selected?.label === 'Custom' && option === 'Custom')
              ? {backgroundColor: theme.primary}
              : {
                  backgroundColor: 'white',
                  borderColor: theme.primary,
                  borderWidth: 1,
                },
          ]}>
          <Text
            style={[
              styles.filterText,
              selected === option || (selected?.label === 'Custom' && option === 'Custom')
                ? {color: 'white'}
                : {color: theme.primary},
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
