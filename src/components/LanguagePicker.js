import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../lang/LanguageContext';

const LanguagePicker = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Language:</Text>
      <Picker
        selectedValue={language}
        onValueChange={(itemValue) => changeLanguage(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Hindi" value="hi" />
        <Picker.Item label="German" value="ger" />
      </Picker>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
    picker: {
    height: 50,
    // width: '100%',
  },
  currentLanguage: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LanguagePicker;
