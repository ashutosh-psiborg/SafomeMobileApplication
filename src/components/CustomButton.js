import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {DimensionConstants} from '../constants/DimensionConstants';
import {useSelector} from 'react-redux';

const CustomButton = ({
  text,
  color,
  textColor,
  onPress,
  icon: Icon,
  borderColor,
  width,
  height,
}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: color || '#FF310C',
          width: width || 'auto',
          height: height || DimensionConstants.fortyEight,
        },
        borderColor && {borderWidth: 1, borderColor},
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.content}>
        {Icon && <View style={styles.icon}>{Icon}</View>}
        <Text style={[styles.text, {color: textColor || '#ffffff'}]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: DimensionConstants.fifty,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DimensionConstants.fifteen,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CustomButton;
