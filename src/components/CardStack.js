import React from 'react';
import {View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import BlueBellIcon from '../assets/icons/BlueBellIcon';
import RightArrowIcon from '../assets/icons/RightArrowIcon';
import {width, DimensionConstants} from '../constants/DimensionConstants';

const cardData = [
  {
    id: 1,
    text: 'Low Battery',
    description: '20 % Battery is left, Charge ...',
    color: '#FCE285',
  },
  {
    id: 2,
    text: 'Out from geofence',
    description: '20 % Battery is left, Charge ...',
    color: '#BCE7F0',
  },
  {
    id: 3,
    text: 'Out from geofence',
    description: '20 % Battery is left, Charge ...',
    color: '#45A0FF',
  },
];

const CardStack = ({expanded, animation, toggleCards}) => {
  const containerHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [110, cardData.length * 120], // Adjusted height based on state
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{height: containerHeight}} />

      <View style={styles.cardStack}>
        {cardData.map((item, index) => {
          const topPosition = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [
              index === cardData.length - 1
                ? 0
                : (cardData.length - index - 1) * -10,
              index * 120,
            ],
          });

          const widthSize = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [
              index === cardData.length - 1
                ? width * 0.9
                : width * 0.9 - (cardData.length - index - 1) * 20,
              width * 0.9,
            ],
          });

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.card,
                {
                  top: topPosition,
                  width: widthSize,
                  zIndex: item.id,
                  backgroundColor: item.color,
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <BlueBellIcon />
                  <View style={{paddingLeft: 15}}>
                    <Text style={styles.cardText}>{item.text}</Text>
                    <Text style={styles.cardDescription}>
                      {item.description}
                    </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: DimensionConstants.twenty,
  },
  title: {
    fontWeight: '700',
    fontSize: DimensionConstants.fourteen,
  },
  viewAll: {
    color: '#808080',
    fontSize: DimensionConstants.twelve,
    fontWeight: '500',
  },
  cardStack: {
    position: 'absolute',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    height: DimensionConstants.oneHundred,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: DimensionConstants.fifteen,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
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
