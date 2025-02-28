import {View, Text} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {HomeScreenStyles} from '../screens/BottomTabScreens/HomeScreen/Styles/HomeScreenStyles';
import CustomCard from './CustomCard';
import RevenueIcon from '../assets/icons/RevenueIcon';
import {LineChart} from 'react-native-chart-kit';
import {DimensionConstants} from '../constants/DimensionConstants';
import Spacing from './Spacing';
import HeartIcon from '../assets/icons/HeartIcon';
import BloodOxygenIcon from '../assets/icons/BloodOxygenIcon';
import BloodPressureIcon from '../assets/icons/BloodPressureIcon';
const StatisticsCards = ({data}) => {
  const dataPoints = data?.heartRateHistory || [0, 0, 0, 0, 0];
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
  const styles = HomeScreenStyles(theme);
  return (
    <View style={styles.cardsContainer}>
      <CustomCard style={{width: '48%'}}>
        <View>
          <View style={styles.rowContainer}>
            <HeartIcon size={20} />
            <Text style={styles.cardTitle}>Heart Rate</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <LineChart
              data={{
                datasets: [
                  {
                    data: dataPoints,
                  },
                ],
              }}
              width={320}
              height={40}
              chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: '#ffffff',
                color: () => theme.primary,
                style: {
                  borderRadius: DimensionConstants.sixteen,
                  marginLeft: DimensionConstants.ten,
                },
                propsForDots: {
                  display: 'none',
                },
              }}
              bezier
              withDots={false}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLabels={false}
              withHorizontalLabels={false}
              fromZero={true}
              style={{
                marginVertical: DimensionConstants.twenty,
              }}
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
      <View style={{justifyContent: 'space-between'}}>
        <CustomCard style={{width: DimensionConstants.oneHundredSixtyFour}}>
          <View>
            <View style={styles.rowContainer}>
              <BloodPressureIcon />
              <Text style={styles.cardTitle}>Blood pressure</Text>
            </View>
            <Text style={styles.cardContent}>
              {data?.bphrt?.SystolicBP}/{data?.bphrt?.DiastolicBP} mm Hg
            </Text>
          </View>
        </CustomCard>
        <CustomCard>
          <View>
            <View style={styles.rowContainer}>
              <BloodOxygenIcon />
              <Text style={styles.cardTitle}>Blood Oxygen</Text>
            </View>
            <Text style={styles.cardContent}>{data?.oxygen?.SPO2Rating}%</Text>
          </View>
        </CustomCard>
      </View>
    </View>
  );
};

export default StatisticsCards;
