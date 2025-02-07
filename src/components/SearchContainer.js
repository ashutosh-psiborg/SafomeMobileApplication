import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import CustomCard from './CustomCard';
import SearchIcon from '../assets/icons/SearchIcon';
import { DimensionConstants } from '../constants/DimensionConstants';

const SearchContainer = ({ placeholder = 'Search here...', onChangeText }) => {
  return (
    <CustomCard style={styles.searchCard}>
      <View style={styles.searchContainer}>
        <SearchIcon />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#888"
          onChangeText={onChangeText} // Optional prop to handle text input
        />
      </View>
    </CustomCard>
  );
};

const styles = StyleSheet.create({
  searchCard: {
    padding: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DimensionConstants.five,
    paddingHorizontal: DimensionConstants.fifteen,
  },
  searchInput: {
    flex: 1,
    marginLeft: DimensionConstants.eight,
    fontSize: DimensionConstants.fourteen,
  },
});

export default SearchContainer;
