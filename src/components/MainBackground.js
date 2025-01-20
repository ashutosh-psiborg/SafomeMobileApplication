import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux'; // Assuming you have a ThemeContext

const MainBackground = ({ children, style, noPadding = false }) => {
  const theme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.container,
          { backgroundColor: theme.background },
          noPadding && { padding: 0 }, // ✅ Remove padding when noPadding is true
          style,
        ]}
      >
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
    padding: 16, // Default padding
  },
});

export default MainBackground;
