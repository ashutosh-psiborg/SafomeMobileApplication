import {View, Text, StyleSheet, Switch} from 'react-native';
import React from 'react';
const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      {/* <LanguagePicker />
      <Switch value={isDarkTheme} onValueChange={toggleTheme} /> */}
      <Text>SettingsScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
