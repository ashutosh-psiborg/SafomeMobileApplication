import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext'; // Assuming you have a ThemeContext

const MainBackground = ({ children, style }) => {
  const { theme } = useTheme(); // Get the current theme (dark/light)

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16, 
  },
});

export default MainBackground;
