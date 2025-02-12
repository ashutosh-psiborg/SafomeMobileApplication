import {View,ActivityIndicator,StyleSheet} from 'react-native';
import React from 'react';

const Loader = () => {
  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#0279E1" />
    </View>
  );
};

export default Loader;
const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});
