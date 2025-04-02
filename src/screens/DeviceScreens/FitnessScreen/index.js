import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import {
  DimensionConstants,
  height,
} from '../../../constants/DimensionConstants';
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
import {ProgressBar} from 'react-native-paper';
import moment from 'moment';
import {BarChart} from 'react-native-gifted-charts';
import EditIcon from '../../../assets/icons/EditIcon';
import {useForm} from 'react-hook-form';
import CommonForm from '../../../utils/CommonForm';
import CustomButton from '../../../components/CustomButton';
import {useMutation} from '@tanstack/react-query';
import CustomModal from '../../../components/CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HealthGraph from '../../../components/HealthGraph';
import {useFocusEffect} from '@react-navigation/native';

const FitnessScreen = ({navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [devId, setDevId] = useState('');
  const [isStepReady, setIsStepReady] = useState(false);
  const [selected, setSelected] = useState('Today');

  useEffect(() => {
    const getStoredDeviceId = async () => {
      try {
        const storedDeviceId = await AsyncStorage.getItem('selectedDeviceId');

        const storedMongoId = await AsyncStorage.getItem(
          'selectedDeviceMongoId',
        );
        if (storedDeviceId) {
          setDevId(storedDeviceId);
        }
        setDeviceId(storedMongoId);
        console.log('Stored Mongo _id:', storedMongoId);
      } catch (error) {
        console.error('Failed to retrieve stored device data:', error);
      }
    };

    getStoredDeviceId();
  }, []);
  console.log('deviceId::::::::::', devId);
  const {
    data: profileData,
    isLoading: profileDataLoading,
    error: profileError,
    refetch: profileRefetch,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `/devices/deviceDetails/${deviceId}`,
      }),
  });
  // console.log('/==', profileData.data.weight, profileError);
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      weight: '',
      stepLength: '',
      speed: '',
      baseGoal: '',
    },
  });
  useEffect(() => {
    if (profileData?.data) {
      setValue('weight', profileData?.data?.weight || 0);
      setValue('stepLength', profileData?.data.stepLength || 0);
      setValue('speed', profileData?.data?.speed || 0);
      setValue('baseGoal', profileData?.data?.baseGoal || 0);
    }
  }, [profileData, setValue]);

  // const userWeight = profileData?.user?.weight;
  // console.log('profile', profileData?.user?.weight);

  // console.log('Weight:', userWeight);
  const maxSteps = 8000;
  const onSubmit = data => {
    console.log('before payload:', data);

    const payload = {
      baseGoal: Number(data?.baseGoal),
      weight: Number(data?.weight),
      stepLength: Number(data?.stepLength),
      speed: Number(data?.speed),
    };

    console.log('Submitting payload:', payload);
    updateUserMutation.mutate(payload);
    refetchStepData();
    setModalVisible(false);
  };
  const updateUserMutation = useMutation({
    mutationFn: updatedData =>
      fetcher({
        method: 'PATCH',
        url: `/devices/updateDevice/${deviceId}`,
        data: updatedData,
      }),
    onSuccess: response => {
      console.log('Update successful', response);
      refetchFitnessData();
      refetchStepData();
      setModalVisible(false);
    },
    onError: error => {
      console.log('Update failed', error.message);
    },
  });

  const options = ['Today', 'Week', 'Month', 'Custom'];
  const fields = [
    {
      name: 'weight',
      placeholder: 'Weight(in kg)',
      keyboardType: 'phone-pad',
      maxLength: 3,
    },
    {
      name: 'baseGoal',
      placeholder: 'Base Goal',
      maxLength: 6,
      keyboardType: 'phone-pad',
    },
    {
      name: 'stepLength',
      placeholder: 'Step Length(in cm)',
      maxLength: 10,
      keyboardType: 'phone-pad',
    },

    {
      name: 'speed',
      placeholder: 'Select speed',
      options: [
        {label: 'Slow Walk (< 3.2 km/h)', value: 2},
        {label: 'Moderate Walk (3.2 - 5.5 km/h)', value: 3.5},
        {label: 'Fast Walk (5.5 - 8.0 km/h)', value: 5},
        {label: 'Running (> 8.0 km/h)', value: 8},
      ],
    },
  ];
  const getDateRange = selection => {
    const today = moment().format('DD-MM-YYYY');

    if (typeof selection === 'object' && selection.label === 'Custom') {
      return {
        startDate: moment(selection.startDate).format('DD-MM-YYYY'),
        endDate: today,
      };
    }

    switch (selection) {
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

  const {startDate, endDate} = useMemo(
    () => getDateRange(selected),
    [selected],
  );
  const {
    data,
    isLoading,
    error,
    refetch: refetchFitnessData,
  } = useQuery({
    queryKey: ['fitness', startDate, endDate, devId],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/healthData/${devId}?startDate=${startDate}&endDate=${endDate}`,
      }),
    enabled: !!devId, // Prevents query from running with an empty deviceId
  });

  const {
    data: stepData,
    isLoading: stepLoading,
    refetch: refetchStepData,
  } = useQuery({
    queryKey: ['steps', startDate, endDate, devId],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getStepData/${devId}?startDate=${startDate}&endDate=${endDate}`,
      }),
    enabled: !!devId, // Prevents query from running with an empty deviceId
  });
  console.log('+++++++++++', stepData?.data?.totalStepsOverall);
  const steps = stepData?.data?.totalStepsOverall;

  useEffect(() => {
    if (!stepLoading && stepData) {
      const timeout = setTimeout(() => {
        setIsStepReady(true);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setIsStepReady(false);
    }
  }, [stepData, stepLoading]);
  useFocusEffect(
    useCallback(() => {
      refetchFitnessData();
      refetchStepData();
    }, [deviceId]),
  );
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
      value: stepData?.data?.totalCaloriesBurned,
      maxValue: '',
    },
    {
      id: 2,
      component: <BlueFlagIcon />,
      label: 'Base goal',
      value: stepData?.data?.totalStepsOverall,
      maxValue: `/ ${stepData?.data?.baseGoal} steps`,
    },
  ];
  console.log(stepData);

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
          <Spacing height={DimensionConstants.fifteen} />
          <CustomCard>
            <Spacing height={DimensionConstants.ten} />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.sectionTitle}>Steps</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <EditIcon />
              </TouchableOpacity>
            </View>
            {isStepReady && stepData?.data?.data.length > 1 ? (
              <View style={{paddingVertical: 20}}>
                <BarChart
                  data={stepData.data.data.map(item => ({
                    value: item.totalSteps,
                    label: `${item.date.split('-')[0]}/${
                      item.date.split('-')[1]
                    }`,
                    frontColor: '#FF310C',
                  }))}
                  barWidth={24}
                  barBorderRadius={6}
                  yAxisThickness={1} // Show Y-axis
                  yAxisColor="#333" // Optional: Set axis color
                  yAxisTextStyle={{color: '#333', fontSize: 10}} // Optional: Label style
                  xAxisLabelTextStyle={{color: '#333', fontSize: 10}}
                  maxValue={2000}
                  noOfSections={5}
                  isAnimated
                />
              </View>
            ) : (
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
            )}

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
                {icon?.map(item => {
                  const numericMax = parseInt(
                    item.maxValue.replace(/[^0-9]/g, ''),
                    10,
                  );
                  const progress =
                    typeof numericMax === 'number' &&
                    !isNaN(numericMax) &&
                    numericMax > 0
                      ? item.value / numericMax
                      : 0;

                  return (
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
                          {item.component}
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
                              {item.maxValue}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {item.label !== 'Calories' && (
                        <View style={{height: 12, marginTop: 4}}>
                          <ProgressBar
                            progress={progress}
                            color={'#0279E1'}
                            style={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            }}
                          />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </CustomCard>
            <Spacing height={DimensionConstants.ten} />
          </CustomCard>
          <Spacing height={DimensionConstants.twentyFour} />
          <HomeMidHeader title={'Statistics'} showViewAll={false} />
          <Spacing height={DimensionConstants.ten} />
          {/* <StatisticsCards data={data} /> */}
          <HealthGraph data={data} />
        </View>
      </ScrollView>
      <View>
        <CustomModal
          isVisible={modalVisible}
          modalHeight={height / 1.7}
          onClose={() => setModalVisible(false)}>
          <View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 20}}>
              <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 16}}>
                Personalize Your Fitness Goals
              </Text>
              <Text>
                Enter your weight, step length, speed, and step goal to
                personalize your fitness tracking.
              </Text>
              <Spacing height={DimensionConstants.ten} />
              <CommonForm control={control} fields={fields} errors={errors} />
              <Spacing height={DimensionConstants.twentyFour} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <CustomButton
                  text={'Cancel'}
                  width={'48%'}
                  color={'white'}
                  textColor={'#000'}
                  borderColor={'#C4C4C4'}
                  onPress={() => setModalVisible(false)}
                />
                <CustomButton
                  text={'Add'}
                  width={'48%'}
                  onPress={handleSubmit(onSubmit)}
                />
              </View>
            </ScrollView>
          </View>
        </CustomModal>
      </View>
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
});

export default FitnessScreen;
