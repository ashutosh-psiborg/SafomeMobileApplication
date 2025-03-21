import {View, Text, Switch, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback} from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import Spacing from '../../../../components/Spacing';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import ThreeDots from '../../../../assets/icons/ThreeDots';
import {useQuery} from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';
import {useFocusEffect} from '@react-navigation/native';

const DAYS_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const parseTimeSection = timeSection => {
  if (!timeSection) return null;
  const [startTime, endTime, daysBinary] = timeSection.split('-');
  const activeDays = daysBinary
    .split('')
    .map((bit, index) => (bit === '1' ? DAYS_MAP[index] : null))
    .filter(Boolean);
  console.log('Parsed Days:', daysBinary, activeDays); // 👈 Debug this
  return {startTime, endTime, activeDays};
};

const DNDScreen = ({navigation}) => {
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['alarm'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getSilenceTime/SILENCETIME2/6907390711`,
      }),
  });
  console.log(data);
  // Use useFocusEffect to refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const timeSections = [
    data?.timeSection1,
    // data?.timeSection2,
    // data?.timeSection3,
    // data?.timeSection4,
  ].map(parseTimeSection);

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title={'DND'}
        backgroundColor={'#fff'}
        backPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {timeSections.map((item, index) => {
          const isEnabled = item !== null;
          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate('SetDndScreen', {index: index})
              }>
              <Spacing height={DimensionConstants.eighteen} />
              <View style={styles.timeContainer}>
                <View style={styles.row}>
                  <Text style={styles.timeText}>
                    {item
                      ? `${item.startTime} - ${item.endTime}`
                      : 'Set time period'}
                  </Text>
                  <View style={styles.switchContainer}>
                    <Switch
                      value={isEnabled}
                      onValueChange={() => {}}
                      trackColor={{
                        false: '#ccc',
                        true: 'rgba(0, 91, 187, 0.1)',
                      }}
                      thumbColor={isEnabled ? '#0279E1' : '#f4f3f4'}
                      disabled={!isEnabled}
                    />
                    <ThreeDots />
                  </View>
                </View>
              </View>
              {/* <View style={styles.daysContainer}>
                <Text style={styles.daysText}>
                  {DAYS_MAP.map((day, i) => (
                    <Text
                      key={`${day}-${i}`}
                      style={
                        item?.activeDays?.some(
                          (activeDay, index) => index === i,
                        ) // ✅ Correct comparison using index
                          ? styles.highlightedDaysText
                          : styles.daysText
                      }>
                      {day}{' '}
                    </Text>
                  ))}
                </Text>
              </View> */}
              <View style={styles.daysContainer}>
                <Text style={styles.daysText}>
                  {DAYS_MAP.map((day, i) => (
                    <Text
                      key={`${day}-${i}`}
                      style={
                        item?.activeDays?.includes(day) // ✅ compare by value, not index
                          ? styles.highlightedDaysText
                          : styles.daysText
                      }>
                      {day}{' '}
                    </Text>
                  ))}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </MainBackground>
  );
};

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
    // letterSpacing: DimensionConstants.two,
    color: '#979797',
  },
  highlightedDaysText: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    // letterSpacing: DimensionConstants.two,
    color: '#0279E1',
  },
});

export default DNDScreen;
