import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import CustomCard from './CustomCard';
import {LineChart} from 'react-native-gifted-charts';
import {DimensionConstants} from '../constants/DimensionConstants';
import HeartIcon from '../assets/icons/HeartIcon';
import BloodOxygenIcon from '../assets/icons/BloodOxygenIcon';
import BloodPressureIcon from '../assets/icons/BloodPressureIcon';
import StepsIcon from '../assets/icons/StepsIcon';

const StatisticsCards = ({data, loading , stepData}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0279E1" />
      </View>
    );
  }

  const heartRateHistory = data?.data?.heartRateHistory || [];
  const bpData = data?.data?.bphrt;
  const oxygenData = data?.data?.oxygen;
  console.log('bp', bpData, 'oxygenData', oxygenData);
  // Group heart rate by date
  const groupedByDate = {};
  heartRateHistory.forEach(item => {
    const [day, month, yearWithTime] = item.date.split('-');
    const [year, time] = yearWithTime.split(' ');
    const dateKey = `${day}-${month}-${year}`;
    const timeLabel = time.slice(0, 5); // HH:MM

    const heartRate = parseInt(item.heartRate, 10);
    if (heartRate === 1) return; // skip invalid

    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }

    groupedByDate[dateKey].push({time: timeLabel, heartRate});
  });

  const dateKeys = Object.keys(groupedByDate);
  const isSingleDay = dateKeys.length === 1;

  const chartData = isSingleDay
    ? groupedByDate[dateKeys[0]]
        .map(entry => ({
          value: entry.heartRate,
          label: entry.time,
          dataPointText: `${entry.heartRate}`,
        }))
        .reverse()
    : dateKeys
        .map(date => {
          const maxHR = Math.max(...groupedByDate[date].map(e => e.heartRate));
          return {
            value: maxHR,
            label: date.split('-').slice(0, 2).join('/'),
            dataPointText: `${maxHR}`,
          };
        })
        .reverse();

  const latestReading = heartRateHistory.find(
    item => parseInt(item.heartRate, 10) !== 1,
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardRowContainer}>
        <CustomCard style={styles.fullWidthCard}>
          <View>
            <View style={styles.rowContainer}>
              <HeartIcon size={20} />
              <Text style={styles.cardTitle}>Heart Rate</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              {/* <LineChart
              areaChart
              initialSpacing={20}
              data={chartData}
              spacing={100}
              textColor1="black"
              textShiftY={-10}
              textFontSize={DimensionConstants.ten}
              thickness={5}
              hideRules
              height={DimensionConstants.oneHundredEighty}
              scrollAnimation={true}
              scrollToEnd
              color="#0279E1"
              curved
              startFillColor="#3f9ef1"
            /> */}
            </View>

            <Text style={styles.cardContent}>
              {latestReading?.heartRate || ''}
              <Text style={styles.bpmText}> BPM</Text>
            </Text>
            {/* <Text style={styles.bpmText}>{latestReading?.date || ''}</Text> */}
          </View>
        </CustomCard>
        <CustomCard style={styles.fullWidthCard}>
          <View>
            <View style={styles.rowContainer}>
              <StepsIcon/>
              <Text style={styles.cardTitle}>Steps</Text>
            </View>
            <View style={{alignItems: 'center'}}>
          
            </View>

            <Text style={styles.cardContent}>
              {stepData?.data?.totalStepsOverall}
              <Text style={styles.bpmText}> Steps</Text>
            </Text>
            {/* <Text style={styles.bpmText}>{latestReading?.date || ''}</Text> */}
          </View>
        </CustomCard>
      </View>
      <View style={styles.cardRowContainer}>
        <CustomCard style={{width: '48%'}}>
          <View>
            <View style={styles.rowContainer}>
              <BloodPressureIcon />
              <Text style={styles.cardTitle}>Blood Pressure</Text>
            </View>
            <Text style={styles.cardContent}>
              {bpData?.SystolicBP}/{bpData?.DiastolicBP} mm Hg
            </Text>
          </View>
        </CustomCard>

        <CustomCard style={{width: '48%'}}>
          <View>
            <View style={styles.rowContainer}>
              <BloodOxygenIcon />
              <Text style={styles.cardTitle}>Blood Oxygen</Text>
            </View>
            <Text style={styles.cardContent}>
              {oxygenData?.SPO2Rating || 98}%
            </Text>
          </View>
        </CustomCard>
      </View>
    </View>
  );
};

export default StatisticsCards;

const styles = StyleSheet.create({
  container: {
    marginTop: DimensionConstants.sixteen,
    flexDirection: 'column',
    gap: DimensionConstants.ten,
    padding: DimensionConstants.three,
  },
  fullWidthCard: {
    width: '48%',
  },
  cardRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontWeight: '500',
    fontSize: DimensionConstants.twelve,
    marginLeft: DimensionConstants.five,
  },
  cardContent: {
    fontSize: DimensionConstants.eighteen,
    fontWeight: '500',
    marginTop: DimensionConstants.five,
  },
  bpmText: {
    color: '#808080',
    fontSize: DimensionConstants.twelve,
    fontWeight: '500',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DimensionConstants.twenty,
  },
});
