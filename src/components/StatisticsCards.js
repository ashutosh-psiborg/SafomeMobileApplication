import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import React from 'react';
import {DimensionConstants} from '../constants/DimensionConstants';
import CustomCard from './CustomCard';
import HeartIcon from '../assets/icons/HeartIcon';
import BloodOxygenIcon from '../assets/icons/BloodOxygenIcon';
import BloodPressureIcon from '../assets/icons/BloodPressureIcon';
import StepsIcon from '../assets/icons/StepsIcon';

export default function StatisticsCards({data, stepData}) {
  const heartRateHistory = data?.data?.heartRateHistory || [];
  const latestReading = heartRateHistory.find(
    item => parseInt(item.heartRate, 10) !== 1,
  );

  const bpData = data?.data?.bphrt;
  const oxygenData = data?.data?.oxygen;

  const detailCardData = [
    {
      title: 'Heart Rate',
      icon: <HeartIcon width={25} height={25} />,
      value: latestReading?.heartRate,
      unit: 'BPM',
    },
    {
      title: 'Steps',
      icon: <StepsIcon width={25} height={25} />,
      value: stepData?.data?.totalStepsOverall,
      unit: 'Steps',
    },
    {
      title: 'B P',
      icon: <BloodPressureIcon width={25} height={25} />,
      value: bpData ? `${bpData?.SystolicBP}/${bpData?.DiastolicBP}` : '',
      unit: 'mm Hg',
    },
    {
      title: 'B O',
      icon: <BloodOxygenIcon width={25} height={25} />,
      value: oxygenData?.SPO2Rating || 98,
      unit: '%',
    },
  ];

  return (
    <CustomCard>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {detailCardData.map((item, index) => (
            <View key={index} style={{flex: 1, alignItems: 'center'}}>
              {item.icon}

              <Text
                style={[styles.titleTxt]}
                numberOfLines={2}
                ellipsizeMode="tail">
                {item.title}
              </Text>

              <Text style={styles.value}>
                {(item.value || 0) + ' ' + item.unit}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </CustomCard>
  );
  src / lang;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
  },

  title: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
  },
  titleTxt: {
    color: 'rgba(82, 82, 82)',
    flexWrap: 'wrap',
    textAlign: 'center',
    maxWidth: '100%',
    marginTop: 5,
  },
  value: {
    fontSize: DimensionConstants.fifteen,
    alignSelf: 'center',
    fontWeight: '500',
    color: 'black',
    marginVertical: 10,
  },
});
