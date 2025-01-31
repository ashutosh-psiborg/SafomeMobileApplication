import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import EditIcon from '../../../assets/icons/EditIcon';
import {useSelector} from 'react-redux';
import Spacing from '../../../components/Spacing';
import CircularProgress from 'react-native-circular-progress-indicator';
import CustomCard from '../../../components/CustomCard';
import CalorieBurnIcon from '../../../assets/icons/CalorieBurnIcon';
import BlueFlagIcon from '../../../assets/icons/BlueFlagIcon';
import BlueClockIcon from '../../../assets/icons/BlueClockIcon';
import HomeMidHeader from '../../../components/HomeMidHeader';
import StatisticsCards from '../../../components/StatisticsCards';

const FitnessScreen = () => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  const [selected, setSelected] = useState('Today');
  const steps = 5500;
  const maxSteps = 8000;
  const options = ['Today', 'Week', 'Month', 'All Time'];
  const data = [
    {
      id: 1,
      component: <CalorieBurnIcon />,
      label: 'Calories',
      value: '201',
      maxValue: '/ 400 Kcal',
    },
    {
      id: 2,
      component: <BlueFlagIcon />,
      label: 'Base goal',
      value: '5,500',
      maxValue: '/ 8000 steps',
    },
    {
      id: 3,
      component: <BlueClockIcon />,
      label: 'Moving',
      value: '7',
      maxValue: '/ 30 min',
      line: 'no',
    },
  ];
  return (
    <MainBackground style={styles.mainBackground} noPadding>
      <CustomHeader title={'Fitness & Health'} backgroundColor={'#fff'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.filterContainer}>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => setSelected(option)}
                style={[
                  styles.filterButton,
                  selected === option && {backgroundColor: theme.primary},
                ]}>
                <Text
                  style={[
                    styles.filterText,
                    selected === option && {color: 'white'},
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
            <EditIcon />
            <Spacing width={DimensionConstants.three} />
          </View>
          <Spacing height={DimensionConstants.twentyFour} />

          <CustomCard>
            <Spacing height={DimensionConstants.ten} />
            <Text style={styles.sectionTitle}>Steps</Text>
            <View style={styles.progressContainer}>
              <CircularProgress
                value={(steps / maxSteps) * 100}
                rotation={-180}
                radius={DimensionConstants.oneHundred}
                activeStrokeColor={'#FF310C'}
                activeStrokeWidth={DimensionConstants.twenty}
                inActiveStrokeWidth={DimensionConstants.twenty}
                inActiveStrokeColor={'#F2F7FC'}
                showProgressValue={false}
              />
              <View style={styles.stepsTextContainer}>
                <Text style={styles.stepsLabel}>Steps</Text>
                <Text style={styles.stepsCount}>{steps}</Text>
              </View>
            </View>
            <Spacing height={DimensionConstants.eighteen} />

            <CustomCard style={styles.statisticsCard}>
              <View style={styles.statisticsContainer}>
                {data.map(item => (
                  <View style={styles.statisticsItem} key={item.id}>
                    <View>
                      {item?.component}
                      <Text style={styles.statisticsLabel}>{item.label}</Text>
                      <Text style={styles.statisticsValue}>{item.value}</Text>
                      <Text style={styles.statisticsMaxValue}>
                        {item.maxValue}
                      </Text>
                    </View>
                    <Spacing width={DimensionConstants.twenty} />
                    {item.line !== 'no' && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            </CustomCard>
            <Spacing height={DimensionConstants.ten} />
          </CustomCard>
          <Spacing height={DimensionConstants.twentyFour} />
          <HomeMidHeader title={'Statistics'} showViewAll={false} />
          <StatisticsCards />
        </View>
      </ScrollView>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    padding: DimensionConstants.twenty,
  },
  filterContainer: {
    backgroundColor: 'white',
    borderColor: 'rgba(59, 65, 172, 0.2)',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: DimensionConstants.four,
    borderRadius: DimensionConstants.twentyNine,
    alignItems: 'center',
  },
  filterButton: {
    paddingVertical: DimensionConstants.five,
    paddingHorizontal: DimensionConstants.fifteen,
    borderRadius: DimensionConstants.twenty,
  },
  filterText: {
    color: '#797C7E',
    fontWeight: '500',
    fontSize: DimensionConstants.fourteen,
  },
  sectionTitle: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  stepsLabel: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '500',
  },
  stepsCount: {
    fontSize: DimensionConstants.thirtyTwo,
    fontWeight: '600',
  },
  statisticsCard: {
    backgroundColor: '#F2F7FC',
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statisticsItem: {
    flexDirection: 'row',
  },
  statisticsLabel: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    marginTop: DimensionConstants.seven,
  },
  statisticsValue: {
    fontSize: DimensionConstants.twentyFour,
    fontWeight: '500',
  },
  statisticsMaxValue: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    color: 'rgba(128, 128, 128, 1)',
  },
  divider: {
    height: DimensionConstants.oneHundred,
    width: DimensionConstants.two,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});

export default FitnessScreen;
