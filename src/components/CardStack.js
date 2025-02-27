import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import BlueBellIcon from '../assets/icons/BlueBellIcon';
import RightArrowIcon from '../assets/icons/RightArrowIcon';
import { width, DimensionConstants } from '../constants/DimensionConstants';

const cardData = [
  {
    id: 1,
    text: 'Low Battery',
    description: '20 % Battery is left, Charge ...',
    color: '#fad03a',
  },
  {
    id: 2,
    text: 'Out from geofence',
    description: '20 % Battery is left, Charge ...',
    color: '#7dd1e2',
  },
  {
    id: 3,
    text: 'Out from geofence',
    description: '20 % Battery is left, Charge ...',
    color: '#45A0FF',
  },
];

const CardStack = ({ expanded }) => {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withSpring(expanded ? 1 : 0, { damping: 10, stiffness: 80 });
  }, [expanded]);

  const containerHeight = useAnimatedStyle(() => ({
    height: animation.value * (cardData.length * 80) + 110,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={containerHeight} />
      <View style={styles.cardStack}>
        {cardData.map((item, index) => {
          const topPosition = useAnimatedStyle(() => ({
            top: animation.value * (index * 120) + (1 - animation.value) * ((cardData.length - index - 1) * -10),
          }));

          const widthSize = useAnimatedStyle(() => ({
            width: animation.value * width * 0.9 + (1 - animation.value) * (width * 0.9 - (cardData.length - index - 1) * 20),
          }));

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.card,
                topPosition,
                widthSize,
                { zIndex: item.id, backgroundColor: item.color },
              ]}>
              <View style={styles.cardContent}>
                <View style={styles.cardInfo}>
                  <BlueBellIcon />
                  <View style={{ paddingLeft: 15 }}>
                    <Text style={styles.cardText}>{item.text}</Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                    <Text style={styles.cardTime}>9:45 am</Text>
                  </View>
                </View>
                <RightArrowIcon />
              </View>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: DimensionConstants.twentyFive,
  },
  cardStack: {
    position: 'absolute',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    height: DimensionConstants.oneHundred,
    padding: DimensionConstants.fifteen,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 22,
  },
  cardTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 10,
  },
});

export default CardStack;
