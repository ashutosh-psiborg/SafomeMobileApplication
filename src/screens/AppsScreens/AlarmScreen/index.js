import {View, Text, TouchableOpacity, Switch, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import PlusIcon from '../../../assets/icons/PlusIcon';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import ThreeDots from '../../../assets/icons/ThreeDots';
import Spacing from '../../../components/Spacing';

const AlarmScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title={'Alarm'}
        backgroundColor={'#ffffff'}
        backPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.setAlarmText}>Set Alarm</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SetAlarmScreen')}>
            <PlusIcon marginLeft={DimensionConstants.ten} />
          </TouchableOpacity>
        </View>
        {[0, 1, 2].map(item => (
          <View key={item}>
            <Spacing height={DimensionConstants.eighteen} />
            <View style={styles.alarmContainer}>
              <Text style={styles.scheduledAlarmText}>Scheduled Alarm</Text>
              <Spacing height={DimensionConstants.twelve} />
              <View style={styles.row}>
                <Text style={styles.timeText}>5:30 AM</Text>
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

export default AlarmScreen;

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    padding: DimensionConstants.sixteen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setAlarmText: {
    fontSize: DimensionConstants.fourteen,
    justifyContent: 'space-between',
    fontWeight: '500',
  },
  alarmContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: DimensionConstants.ten,
    borderTopLeftRadius: DimensionConstants.ten,
    paddingVertical: DimensionConstants.ten,
    paddingHorizontal: DimensionConstants.sixteen,
  },
  scheduledAlarmText: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: DimensionConstants.twentyFour,
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
