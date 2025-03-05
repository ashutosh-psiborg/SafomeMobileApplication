import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import CustomCard from './CustomCard';
import {LineChart} from 'react-native-chart-kit';
import {DimensionConstants} from '../constants/DimensionConstants';
import HeartIcon from '../assets/icons/HeartIcon';
import BloodOxygenIcon from '../assets/icons/BloodOxygenIcon';
import BloodPressureIcon from '../assets/icons/BloodPressureIcon';

const StatisticsCards = ({data}) => {
  const dataPoints =
    data?.heartRateHistory?.length > 0 ? data.heartRateHistory : [0, 0, 0, 0];

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
      {/* Full-width Heart Rate Card */}
      <CustomCard style={styles.fullWidthCard}>
        <View>
          <View style={styles.rowContainer}>
            <HeartIcon size={20} />
            <Text style={styles.cardTitle}>Heart Rate</Text>
          </View>
          {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
            <View style={{alignItems: 'center'}}>
              <LineChart
                data={{
                  datasets: [{data: dataPoints}],
                }}
                width={DimensionConstants.fiveHundred}
                height={DimensionConstants.oneHundred}
                chartConfig={{
                  backgroundColor: 'white',
                  backgroundGradientFrom: 'white',
                  backgroundGradientTo: '#ffffff',
                  color: () => theme.primary,
                  style: {
                    borderRadius: DimensionConstants.sixteen,
                    marginLeft: DimensionConstants.ten,
                  },
                  propsForDots: {display: 'none'},
                }}
                bezier
                withDots={false}
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels={false}
                withHorizontalLabels={false}
                fromZero={true}
                style={{marginVertical: DimensionConstants.twenty}}
              />
            </View>
          {/* </ScrollView> */}

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
