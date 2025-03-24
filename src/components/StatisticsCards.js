import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import CustomCard from './CustomCard';
import {DimensionConstants} from '../constants/DimensionConstants';
import HeartIcon from '../assets/icons/HeartIcon';
import BloodOxygenIcon from '../assets/icons/BloodOxygenIcon';
import BloodPressureIcon from '../assets/icons/BloodPressureIcon';
import StepsIcon from '../assets/icons/StepsIcon';

const StatisticsCards = ({data, loading, stepData, navigation}) => {
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
  const latestReading = heartRateHistory.find(
    item => parseInt(item.heartRate, 10) !== 1,
  );

  const bpData = data?.data?.bphrt;
  const oxygenData = data?.data?.oxygen;

  const cardData = [
    {
      title: 'Heart Rate',
      icon: <HeartIcon size={20} />,
      value: latestReading?.heartRate,
      unit: 'BPM',
    },
    {
      title: 'Steps',
      icon: <StepsIcon />,
      value: stepData?.data?.totalStepsOverall,
      unit: 'Steps',
    },
    {
      title: 'Blood Pressure',
      icon: <BloodPressureIcon />,
      value: bpData ? `${bpData?.SystolicBP}/${bpData?.DiastolicBP}` : '',
      unit: 'mm Hg',
    },
    {
      title: 'Blood Oxygen',
      icon: <BloodOxygenIcon />,
      value: oxygenData?.SPO2Rating || 98,
      unit: '%',
    },
  ];

  return (
    <View style={styles.container}>
      {Array.from({length: 2}).map((_, rowIndex) => (
        <View style={styles.cardRowContainer} key={rowIndex}>
          {cardData.slice(rowIndex * 2, rowIndex * 2 + 2).map((card, index) => (
            <CustomCard style={styles.fullWidthCard} key={index}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MainApp', {screen: 'Health'});
                }}>
                <View style={styles.rowContainer}>
                  {card.icon}
                  <Text style={styles.cardTitle}>{card.title}</Text>
                </View>
                <Text style={styles.cardContent}>
                  {card.value}
                  {card.unit && (
                    <Text style={styles.bpmText}> {card.unit}</Text>
                  )}
                </Text>
              </TouchableOpacity>
            </CustomCard>
          ))}
        </View>
      ))}
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
