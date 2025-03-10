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
import {useQuery} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import Spacing from '../../../components/Spacing';
import CircularProgress from 'react-native-circular-progress-indicator';
import CustomCard from '../../../components/CustomCard';
import CalorieBurnIcon from '../../../assets/icons/CalorieBurnIcon';
import BlueFlagIcon from '../../../assets/icons/BlueFlagIcon';
import BlueClockIcon from '../../../assets/icons/BlueClockIcon';
import HomeMidHeader from '../../../components/HomeMidHeader';
import StatisticsCards from '../../../components/StatisticsCards';
import FilterContainer from '../../../components/FilterContainer';
import Loader from '../../../components/Loader';
import fetcher from '../../../utils/ApiService';
import {ProgressBar} from 'react-native-paper'; // For bars
import moment from 'moment';

const FitnessScreen = ({navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  const [selected, setSelected] = useState('Month');
  const maxSteps = 8000;
  const options = ['Today', 'Week', 'Month', 'Custom'];
  const getDateRange = () => {
    const today = moment().format('DD-MM-YYYY');

    if (selected?.label === 'Custom') {
      return {
        startDate: moment(selected.startDate).format('DD-MM-YYYY'),
        endDate: moment(selected.endDate).format('DD-MM-YYYY'),
      };
    }

    switch (selected) {
      case 'Today':
        return {startDate: today, endDate: today};
      case 'Week':
        return {
          startDate: moment().subtract(7, 'days').format('DD-MM-YYYY'),
          endDate: today,
        };
      case 'Month':
        return {
          startDate: moment().subtract(30, 'days').format('DD-MM-YYYY'),
          endDate: today,
        };
      default:
        return {startDate: today, endDate: today};
    }
  };
  const {startDate, endDate} = getDateRange();
  console.log(startDate, endDate);
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['fitness', selected],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/fitness-health/${
          deviceId || 6907390711
        }?startDate=${startDate}&endDate=${endDate}`,
      }),
  });
  console.log('newdata+++++', data);
  const {
    data: stepData,
    isLoading: stepLoading,
    error: stepError,
    refetch: stepRefetch,
  } = useQuery({
    queryKey: ['steps'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getStepData/6907390711?startDate=${startDate}&endDate=${endDate}`,
      }),
  });
  console.log("dteps====",stepData)
  const steps =
    selected === 'Today'
      ? stepData?.data?.todaySteps || 0
      : selected === 'Week'
      ? stepData?.data?.weeklySteps || 0
      : stepData?.data?.monthlySteps || 0;

  if (isLoading || stepLoading) {
    return (
      <MainBackground style={{backgroundColor: theme.otpBox}}>
        <Loader />
      </MainBackground>
    );
  }
  const icon = [
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
      <CustomHeader
        title={'Fitness & Health'}
        backgroundColor={theme.background}
        backPress={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <FilterContainer
            options={options}
            selected={selected}
            onSelect={setSelected}
            theme={theme}
          />
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
                inActiveStrokeColor={theme.otpBox}
                showProgressValue={false}
              />
              <View style={styles.stepsTextContainer}>
                <Text style={styles.stepsLabel}>Steps</Text>
                <Text style={styles.stepsCount}>{steps}</Text>
              </View>
            </View>
            <Spacing height={DimensionConstants.eighteen} />

            <CustomCard
              style={{
                backgroundColor: '#F7FAFF',
                borderRadius: 16,
                padding: 16,
                shadowColor: '#3B41AC',
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 2,
              }}>
              <View style={{gap: 16}}>
                {icon?.map(item => (
                  <View key={item.id} style={{marginBottom: 8}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}>
                      <View
                        style={{
                          backgroundColor: 'rgba(59, 65, 172, 0.1)',
                          borderRadius: 8,
                          padding: 6,
                          marginRight: 12,
                        }}>
                        {item?.component}
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '500',
                            color: '#333333',
                          }}>
                          {item.label}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'baseline',
                          }}>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: '600',
                              color: '#333333',
                              marginRight: 4,
                            }}>
                            {item.value}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '500',
                              color: '#9E9E9E',
                            }}>
                            {item?.maxValue}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Calculate progress value */}
                    {(() => {
                      // Extract numeric values for calculations
                      const currentValue = parseInt(
                        item.value.replace(/,/g, ''),
                        10,
                      );
                      const maxValueString = item.maxValue.split('/')[1].trim();
                      const maxValue = parseInt(
                        maxValueString.split(' ')[0].replace(/,/g, ''),
                        10,
                      );
                      const progress = currentValue / maxValue;

                      // Determine color based on metric type
                      let progressColor = '#3B41AC'; // Default blue
                      if (item.label === 'Calories') progressColor = '#0279E1'; // Orange
                      if (item.label === 'Base goal') progressColor = '#0279E1'; // Green
                      if (item.label === 'Moving') progressColor = '#0279E1'; // Purple

                      return (
                        <View style={{height: 12, marginTop: 4}}>
                          <ProgressBar
                            progress={progress}
                            color={progressColor}
                            style={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            }}
                          />
                        </View>
                      );
                    })()}
                  </View>
                ))}
              </View>
            </CustomCard>
            <Spacing height={DimensionConstants.ten} />
          </CustomCard>
          <Spacing height={DimensionConstants.twentyFour} />
          <HomeMidHeader title={'Statistics'} showViewAll={false} />
          <StatisticsCards data={data} />
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
    padding: DimensionConstants.sixteen,
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
