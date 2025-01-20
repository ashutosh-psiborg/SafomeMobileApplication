import React from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';

const ProfileScreen = () => {

  return (
    <View style={styles.container}>
      <Text style={{color: 'black'}}>Hi Ashutosh</Text>
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

export default ProfileScreen;
