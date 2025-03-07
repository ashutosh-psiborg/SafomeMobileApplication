import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import CustomCard from './CustomCard';
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
  RadarChart,
} from 'react-native-gifted-charts';
import {DimensionConstants} from '../constants/DimensionConstants';
import HeartIcon from '../assets/icons/HeartIcon';
import BloodOxygenIcon from '../assets/icons/BloodOxygenIcon';
import BloodPressureIcon from '../assets/icons/BloodPressureIcon';

const StatisticsCards = ({data}) => {
  const dataPoints =
    data?.heartRateHistory?.length > 0
      ? data.heartRateHistory
      : [70, 70, 70, 75, 78, 80];

  const newData = dataPoints
    .filter(value => value !== '1')
    .map(value => ({
      value: parseInt(value, 10),
      dataPointText: value,
    }))
    .reverse();

  const formatCustomDate = isoString => {
    const date = new Date(isoString);
    const options = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  return (
    <View style={styles.container}>
      <CustomCard style={styles.fullWidthCard}>
        <View>
          <View style={styles.rowContainer}>
            <HeartIcon size={20} />
            <Text style={styles.cardTitle}>Heart Rate</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <LineChart
              areaChart
              initialSpacing={15}
              data={newData}
              spacing={60}
              textColor1="black"
              textShiftY={-10}
              textFontSize={DimensionConstants.ten}
              thickness={5}
              hideRules
              height={DimensionConstants.oneHundredEighty}
              hideYAxisText
              yAxisColor="white"
              // showVerticalLines
              scrollAnimation={true}
              scrollToEnd
              xAxisColor="white"
              color="#0279E1"
              curved
              startFillColor="#3f9ef1"
            />
          </View>

          <Text style={styles.cardContent}>
            {data?.bphrt?.heartRate}
            <Text style={styles.bpmText}> BPM</Text>
          </Text>
          <Text style={styles.bpmText}>
            {formatCustomDate(data?.bphrt?.date)}
          </Text>
        </View>
      </CustomCard>

      {/* Row for Blood Pressure & Blood Oxygen Cards */}
      <View style={styles.cardRowContainer}>
        {/* Blood Pressure Card */}
        <CustomCard style={{width: '48%'}}>
          <View>
            <View style={styles.rowContainer}>
              <BloodPressureIcon />
              <Text style={styles.cardTitle}>Blood Pressure</Text>
            </View>
            <Text style={styles.cardContent}>
              {data?.bphrt?.SystolicBP}/{data?.bphrt?.DiastolicBP} mm Hg
            </Text>
          </View>
        </CustomCard>

        {/* Blood Oxygen Card */}
        <CustomCard style={{width: '48%'}}>
          <View>
            <View style={styles.rowContainer}>
              <BloodOxygenIcon />
              <Text style={styles.cardTitle}>Blood Oxygen</Text>
            </View>
            <Text style={styles.cardContent}>
              {data?.oxygen?.SPO2Rating || 98}%
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
    flexDirection: 'column', // Ensures full-width card is stacked above row
    gap: DimensionConstants.ten, // Adds spacing between the Heart Rate and row below
    padding: DimensionConstants.three,
  },

  fullWidthCard: {
    width: '100%',
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
    fontSize: DimensionConstants.twentyFour,
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
});
