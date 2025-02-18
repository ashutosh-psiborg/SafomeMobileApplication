import {View, Text, Switch, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import Spacing from '../../../components/Spacing';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import ThreeDots from '../../../assets/icons/ThreeDots';

const DNDScreen = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader title={'DND'} backgroundColor={'#fff'} />
      <View style={styles.container}>
        {[0, 1].map(item => (
          <View key={item}>
            <Spacing height={DimensionConstants.eighteen} />
            <View style={styles.timeContainer}>
              <View style={styles.row}>
                <Text style={styles.timeText}>02:00 AM - 04:00 PM</Text>
                <View style={styles.switchContainer}>
                  <Switch
                    value={isEnabled}
                    onValueChange={toggleSwitch}
                    trackColor={{false: '#ccc', true: 'rgba(0, 91, 187, 0.1)'}}
                    thumbColor={isEnabled ? '#0279E1' : '#f4f3f4'}
                  />
                  <ThreeDots />
                </View>
              </View>
            </View>
            <View style={styles.daysContainer}>
              <Text style={styles.daysText}>
                S M <Text style={styles.highlightedDaysText}>T W T</Text> F S
              </Text>
            </View>
          </View>
        ))}
      </View>
    </MainBackground>
  );
};

export default DNDScreen;

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    padding: DimensionConstants.sixteen,
  },
  timeContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: DimensionConstants.ten,
    borderTopLeftRadius: DimensionConstants.ten,
    padding: DimensionConstants.sixteen,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
  },
  daysContainer: {
    backgroundColor: 'rgba(255, 49, 12, 0.1)',
    paddingVertical: DimensionConstants.ten,
    paddingHorizontal: DimensionConstants.sixteen,
    borderBottomRightRadius: DimensionConstants.ten,
    borderBottomLeftRadius: DimensionConstants.ten,
  },
  daysText: {
    fontSize: DimensionConstants.fourteen,
    letterSpacing: DimensionConstants.two,
    color: '#979797',
  },
  highlightedDaysText: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    letterSpacing: DimensionConstants.two,
    color: '#0279E1',
  },
});
