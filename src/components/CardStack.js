import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {width, DimensionConstants} from '../constants/DimensionConstants';

const cardData = [
  {id: 1, text: 'Card 1', color: '#FCE285'}, // Yellow
  {id: 2, text: 'Card 2', color: '#BCE7F0'}, // Light Blue
  {id: 3, text: 'Card 3', color: '#45A0FF'}, // Blue (Fully Visible)
];

const CardStack = () => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleCards = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            fontWeight: '700',
            fontSize: DimensionConstants.fourteen,
          }}>
          Recent Notifications
        </Text>

        <TouchableOpacity onPress = {toggleCards}>
          <Text style={{color: '#808080', fontSize: 12, fontWeight: '500'}}>
            View all
          </Text>
        </TouchableOpacity>
      </View>
      {cardData.map((item, index) => {
        const topPosition = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [
            index === cardData.length - 1
              ? 0
              : (cardData.length - index - 1) * -10, // Only 10px of each card visible
            index * 120, // Expand to normal list
          ],
        });

        const widthSize = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [
            index === cardData.length - 1
              ? width * 0.8
              : width * 0.8 - (cardData.length - index - 1) * 20, // Last card takes 80%, others decrease in size
            width * 0.8, // All cards will have same width (80%) when expanded
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
                zIndex: item.id, // Ensuring last card is on top
                backgroundColor: item.color,
              },
            ]}>
            <Text style={styles.cardText}>{item.text}</Text>
          </Animated.View>
        );
      })}
      {/* <TouchableOpacity style={styles.button} onPress={toggleCards}>
        <Text style={styles.buttonText}>
          {expanded ? 'Stack Cards' : 'Expand Cards'}
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  card: {
    position: 'absolute',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 250,
    padding: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CardStack;
