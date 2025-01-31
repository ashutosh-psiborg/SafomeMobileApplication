import {View, Text} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {HomeScreenStyles} from '../screens/BottomTabScreens/HomeScreen/Styles/HomeScreenStyles';
import CustomCard from './CustomCard';
import RevenueIcon from '../assets/icons/RevenueIcon';
import {LineChart} from 'react-native-chart-kit';
import { DimensionConstants } from '../constants/DimensionConstants';
import Spacing from './Spacing';
const StatisticsCards = () => {
  const dataPoints = [30, 60, 90, 72, 70, 100, 128];

  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = HomeScreenStyles(theme);
  return (
    <View style={styles.cardsContainer}>
      <CustomCard style={{width: '48%'}}>
        <View>
          <View style={styles.rowContainer}>
            <RevenueIcon />
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
            128
            <Text style={styles.bpmText}> BPM</Text>
          </Text>
          <Text style={styles.bpmText}> 01/07 12:47 PM</Text>
        </View>
      </CustomCard>
      <View>
        <CustomCard style={{width: DimensionConstants.oneHundredSixtyFour}}>
          <View>
            <View style={styles.rowContainer}>
              <RevenueIcon />
              <Text style={styles.cardTitle}>Today Calls</Text>
            </View>
            <Text style={styles.cardContent}>76</Text>
          </View>
        </CustomCard>
        <Spacing height={DimensionConstants.ten} />
        <CustomCard>
          <View>
            <View style={styles.rowContainer}>
              <RevenueIcon />
              <Text style={styles.cardTitle}>Blood Oxygen</Text>
            </View>
            <Text style={styles.cardContent}>98%</Text>
          </View>
        </CustomCard>
      </View>
    </View>
  );
};

export default StatisticsCards;
