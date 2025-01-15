import React from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import {useTheme} from '../theme/ThemeContext';

const ProfileScreen = () => {
  const {theme} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Text style={{color: theme.text}}>Hi Ashutosh</Text>
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
