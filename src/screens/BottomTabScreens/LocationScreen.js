import React from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';

const LocationScreen = () => {

  return (
    <View style={styles.container}>
      <Text style={{color: 'black'}}>this is location screen</Text>
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
    fontSize: 18,
    marginBottom: 20,
  },
});

export default LocationScreen;
