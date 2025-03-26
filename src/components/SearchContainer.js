import React, {useMemo} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import CustomCard from './CustomCard';
import SearchIcon from '../assets/icons/SearchIcon';
import {DimensionConstants} from '../constants/DimensionConstants';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const SearchContainer = ({
  placeholder = 'Search here...',
  onSearch,
  searchText,
  setSearchText,
}) => {
  const debouncedSearch = useMemo(() => {
    return debounce(text => {
      if (onSearch) {
        onSearch(text);
      }
    }, 300);
  }, [onSearch]);

  const handleTextChange = text => {
    setSearchText(text);
    debouncedSearch(text);
  };

  return (
    <CustomCard style={styles.searchCard}>
      <View style={styles.searchContainer}>
        <SearchIcon />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleTextChange}
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
