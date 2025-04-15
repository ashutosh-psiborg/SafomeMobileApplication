import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import {
  DimensionConstants,
  height,
} from '../../../constants/DimensionConstants';
import {useQuery, useMutation} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import Spacing from '../../../components/Spacing';
import CircularProgress from 'react-native-circular-progress-indicator';
import CustomCard from '../../../components/CustomCard';
import CalorieBurnIcon from '../../../assets/icons/CalorieBurnIcon';
import BlueFlagIcon from '../../../assets/icons/BlueFlagIcon';
import HomeMidHeader from '../../../components/HomeMidHeader';
import FilterContainer from '../../../components/FilterContainer';
import Loader from '../../../components/Loader';
import fetcher from '../../../utils/ApiService';
import moment from 'moment';
import {BarChart} from 'react-native-gifted-charts';
import EditIcon from '../../../assets/icons/EditIcon';
import {useForm} from 'react-hook-form';
import CommonForm from '../../../utils/CommonForm';
import CustomButton from '../../../components/CustomButton';
import CustomModal from '../../../components/CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HealthGraph from '../../../components/HealthGraph';
import LinearGradient from 'react-native-linear-gradient';

const FitnessScreen = ({navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [devId, setDevId] = useState('');
  const [isStepReady, setIsStepReady] = useState(false);
  const [selected, setSelected] = useState('Today');

  // Memoized options and fields to prevent re-creation
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

  const getSelectedDevice = async () => {
    try {
      const devId = await AsyncStorage.getItem('selectedDeviceId');
      const storedMongoId = await AsyncStorage.getItem('selectedDeviceMongoId');
      setDevId(devId || '');
      setDeviceId(storedMongoId || '');
      console.log('Stored Mongo _id:', storedMongoId, 'Device ID:', devId);
    } catch (error) {
      console.error('Error retrieving device IDs:', error);
    }
  };

  // Use useFocusEffect to refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      getSelectedDevice();
      refetchProfileData();
      refetchFitnessData();
      refetchStepData();
    }, [refetchProfileData, refetchFitnessData, refetchStepData]),
  );

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {weight: '', stepLength: '', speed: '', baseGoal: ''},
  });

  const {
    data: profileData,
    isLoading: profileLoading,
    refetch: refetchProfileData,
  } = useQuery({
    queryKey: ['userProfile', deviceId],
    queryFn: () =>
      fetcher({method: 'GET', url: `/devices/deviceDetails/${deviceId}`}),
    enabled: !!deviceId,
  });

  useEffect(() => {
    if (profileData?.data) {
      const {weight, stepLength, speed, baseGoal} = profileData.data;
      setValue('weight', weight?.toString() || '');
      setValue('stepLength', stepLength?.toString() || '');
      setValue('speed', speed?.toString() || '');
      setValue('baseGoal', baseGoal?.toString() || '');
    }
  }, [profileData, setValue]);

  const updateUserMutation = useMutation({
    mutationFn: updatedData =>
      fetcher({
        method: 'PATCH',
        url: `/devices/updateDevice/${deviceId}`,
        data: updatedData,
      }),
    onSuccess: () => {
      refetchFitnessData();
      refetchStepData();
      setModalVisible(false);
    },
    onError: error => console.log('Update failed', error.message),
  });

  const onSubmit = useCallback(
    data => {
      const payload = {
        baseGoal: Number(data.baseGoal),
        weight: Number(data.weight),
        stepLength: Number(data.stepLength),
        speed: Number(data.speed),
      };
      updateUserMutation.mutate(payload);
    },
    [updateUserMutation],
  );

  const getDateRange = useCallback(selection => {
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
  }, []);

  const {startDate, endDate} = useMemo(
    () => getDateRange(selected),
    [selected, getDateRange],
  );

  const {
    data: fitnessData,
    isLoading: fitnessLoading,
    refetch: refetchFitnessData,
  } = useQuery({
    queryKey: ['fitness', startDate, endDate, devId],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/healthData/${devId}?startDate=${startDate}&endDate=${endDate}`,
      }),
    enabled: !!devId,
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
    enabled: !!devId,
  });

  useEffect(() => {
    if (!stepLoading && stepData) {
      const timeout = setTimeout(() => setIsStepReady(true), 300);
      return () => clearTimeout(timeout);
    }
    setIsStepReady(false);
  }, [stepData, stepLoading]);

  const steps = stepData?.data?.totalStepsOverall || 0;
  const maxSteps = 8000;

  const barChartData = useMemo(
    () =>
      stepData?.data?.data?.length > 1
        ? stepData.data.data.map(item => ({
            value: item.totalSteps,
            label: `${item.date.split('-')[0]}/${item.date.split('-')[1]}`,
            frontColor: '#FF310C',
          }))
        : [],
    [stepData],
  );

  const stats = useMemo(
    () => ({
      calories:
        stepData?.data?.data?.length > 1
          ? stepData.data.totalCaloriesBurned || 0
          : stepData?.data?.totalCaloriesBurned || 0,
      goalOrAvg:
        stepData?.data?.data?.length > 1
          ? Math.floor(
              stepData.data.totalStepsOverall / stepData.data.dateDifference,
            )
          : stepData?.data?.baseGoal || 0,
      label: stepData?.data?.data?.length > 1 ? 'Average' : 'Goal',
    }),
    [stepData],
  );

  if (fitnessLoading || stepLoading || profileLoading) {
    return (
      <MainBackground style={{backgroundColor: theme.otpBox}}>
        <Loader />
      </MainBackground>
    );
  }

  return (
    <MainBackground style={styles.mainBackground} noPadding>
      <CustomHeader
        title="Fitness & Health"
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
            <View style={styles.header}>
              <Text style={styles.sectionTitle}>Steps</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <EditIcon />
              </TouchableOpacity>
            </View>
            {stepData?.data?.data?.length > 1 ? (
              <View style={styles.chartContainer}>
                <BarChart
                  data={barChartData}
                  barWidth={24}
                  barBorderRadius={6}
                  yAxisThickness={1}
                  yAxisColor="#333"
                  yAxisTextStyle={{color: '#333', fontSize: 10}}
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
                  activeStrokeColor="#FF310C"
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
            <CustomCard style={styles.innerCard}>
              <LinearGradient
                colors={['#F7FAFF', '#F7FAFF']}
                style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <View style={{flexDirection: 'row', gap: 15}}>
                    <CalorieBurnIcon />
                    <Text style={styles.statLabel}>Calories</Text>
                  </View>
                  <Text style={styles.statValue}>{stats.calories} kcal</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <View style={{flexDirection: 'row', gap: 15}}>
                    <BlueFlagIcon />
                    <Text style={styles.statLabel}>{stats.label}</Text>
                  </View>
                  <Text style={styles.statValue}>{stats.goalOrAvg} steps</Text>
                </View>
              </LinearGradient>
            </CustomCard>
            {/* <Spacing height={DimensionConstants.five} /> */}
          </CustomCard>
          <Spacing height={DimensionConstants.twentyFour} />
          <HomeMidHeader title="Statistics" showViewAll={false} />
          <Spacing height={DimensionConstants.ten} />
          <HealthGraph data={fitnessData} />
        </View>
      </ScrollView>
      <View>
        <CustomModal
          isVisible={modalVisible}
          modalHeight={height / 1.7}
          onClose={() => setModalVisible(false)}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Personalize Your Fitness Goals
            </Text>
            <Text>
              Enter your weight, step length, speed, and step goal to
              personalize your fitness tracking.
            </Text>
            <Spacing height={DimensionConstants.ten} />
            <CommonForm control={control} fields={fields} errors={errors} />
            <Spacing height={DimensionConstants.twentyFour} />
            <View style={styles.modalButtons}>
              <CustomButton
                text="Cancel"
                width="48%"
                color="white"
                textColor="#000"
                borderColor="#C4C4C4"
                onPress={() => setModalVisible(false)}
              />
              <CustomButton
                text="Add"
                width="48%"
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </ScrollView>
        </CustomModal>
      </View>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: {backgroundColor: '#F2F7FC'},
  container: {padding: DimensionConstants.sixteen},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {fontSize: DimensionConstants.fourteen, fontWeight: '500'},
  chartContainer: {paddingVertical: 20},
  progressContainer: {alignItems: 'center', justifyContent: 'center'},
  stepsTextContainer: {position: 'absolute', alignItems: 'center'},
  stepsLabel: {fontSize: DimensionConstants.sixteen, fontWeight: '500'},
  stepsCount: {fontSize: DimensionConstants.thirtyTwo, fontWeight: '600'},
  innerCard: {
    backgroundColor: '#F7FAFF',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#3B41AC',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9E9E9E',
    marginBottom: 4,
  },
  statValue: {fontSize: 18, fontWeight: '600', color: '#333333'},
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(59, 65, 172, 0.1)',
    height: '100%',
  },
  modalContent: {paddingBottom: 20},
  modalTitle: {fontSize: 18, fontWeight: '600', marginBottom: 16},
  modalButtons: {flexDirection: 'row', justifyContent: 'space-between'},
});

export default FitnessScreen;
