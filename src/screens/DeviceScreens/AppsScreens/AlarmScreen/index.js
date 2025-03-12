import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, Switch, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import PlusIcon from '../../../../assets/icons/PlusIcon';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import ThreeDots from '../../../../assets/icons/ThreeDots';
import Spacing from '../../../../components/Spacing';
import fetcher from '../../../../utils/ApiService';
import Loader from '../../../../components/Loader';

const daysMap = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const formatDays = binaryString => {
  if (!binaryString) return 'Once';
  if (binaryString === '2') return 'Daily';
  if (binaryString.length !== 7) return 'Once';

  return daysMap.map((day, index) => (
    <Text
      key={index}
      style={
        binaryString[index] === '1'
          ? styles.highlightedDaysText
          : styles.daysText
      }>
      {day}
    </Text>
  ));
};

const AlarmScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['alarm'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getDeviceAlarms/REMIND/6907390711`,
      }),
  });

  // Fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const alarms = data;
  console.log(`Alarms`, alarms);

  const alarmList = alarms
    ? Object.keys(alarms)
        .filter(key => key.startsWith('alarm'))
        .map(key => {
          const [time, ...days] = alarms[key].split('-');
          return {
            time,
            days: days.length > 0 ? formatDays(days[days.length - 1]) : 'Once',
          };
        })
    : [];

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      {isLoading ? (
        <Loader />
      ) : (
        <View>
          <CustomHeader
            title={'Alarm'}
            backgroundColor={'#ffffff'}
            backPress={() => navigation.goBack()}
          />
          <View style={styles.container}>
            {alarmList.map((alarm, index) => (
              <View key={index}>
                <Spacing height={DimensionConstants.eighteen} />
                <TouchableOpacity
                  style={styles.alarmContainer}
                  onPress={() =>
                    navigation.navigate('SetAlarmScreen', {index: index})
                  }>
                  <Text style={styles.scheduledAlarmText}>Scheduled Alarm</Text>
                  <Spacing height={DimensionConstants.twelve} />
                  <View style={styles.row}>
                    <Text style={styles.timeText}>{alarm.time}</Text>
                    <View style={styles.switchContainer}>
                      <Switch
                        value={isEnabled}
                        onValueChange={toggleSwitch}
                        trackColor={{
                          false: '#ccc',
                          true: 'rgba(0, 91, 187, 0.1)',
                        }}
                        thumbColor={isEnabled ? '#0279E1' : '#f4f3f4'}
                      />
                      <ThreeDots />
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.daysContainer}>
                  <Text style={styles.daysText}>{alarm.days}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
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
    flexDirection: 'row',
  },
  daysText: {
    fontSize: DimensionConstants.fourteen,
    letterSpacing: DimensionConstants.two,
    color: '#979797',
  },
  highlightedDaysText: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    color: '#0279E1',
  },
});
