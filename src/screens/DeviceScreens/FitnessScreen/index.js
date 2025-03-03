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
const FitnessScreen = ({navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  const [selected, setSelected] = useState('Week');
  const steps = 5500;
  const maxSteps = 8000;
  const options = ['Today', 'Week', 'Month',];
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['fitness', selected],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/fitness-health/6907390711?range=${selected.toLowerCase()}`,
      }),
  });
  if (isLoading) {
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

            <CustomCard style={styles.statisticsCard}>
              <View style={styles.statisticsContainer}>
                {icon?.map(item => (
                  <View style={styles.statisticsItem} key={item.id}>
                    <View>
                      {item?.component}
                      <Text style={styles.statisticsLabel}>{item.label}</Text>
                      <Text style={styles.statisticsValue}>{item.value}</Text>
                      <Text style={styles.statisticsMaxValue}>
                        {item?.maxValue}
                      </Text>
                    </View>
                    <Spacing width={DimensionConstants.twenty} />
                    {item?.line !== 'no' && <View style={styles.divider} />}
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
