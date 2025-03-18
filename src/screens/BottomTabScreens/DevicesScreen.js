import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import MainBackground from '../../components/MainBackground';
import LogoHeader from '../../components/LogoHeader';
import BlackWatchIcon from '../../assets/icons/BlackWatchIcon';
import CustomCard from '../../components/CustomCard';
import CustomButton from '../../components/CustomButton';
import Spacing from '../../components/Spacing';
import {DimensionConstants} from '../../constants/DimensionConstants';
import DownArrowIcon from '../../assets/icons/DownArrowIcon';
import {useSelector} from 'react-redux';
import DeviceCallIcon from '../../assets/icons/DeviceCallIcon';
import FitnessIcon from '../../assets/icons/FitnessIcon';
import AppsIcon from '../../assets/icons/AppsIcon';
import SystemIcon from '../../assets/icons/SystemIcon';
import {useQuery} from '@tanstack/react-query';
import RightArrowIcon from '../../assets/icons/RightArrowIcon';
import fetcher from '../../utils/ApiService';
import Loader from '../../components/Loader';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

const DevicesScreen = ({navigation}) => {
  const {appStrings} = useSelector(state => state.language);

  const icons = [
    // {
    //   component: <DeviceCallIcon />,
    //   navigation: () => navigation.navigate('CallsScreen'),
    //   label: 'Calls',
    // },
    {
      component: <FitnessIcon />,
      label: appStrings?.device?.fitnessHealth?.text,
      navigation: () => navigation.navigate('FitnessScreen'),
    },
    {
      component: <AppsIcon />,
      label: appStrings?.device?.apps?.text,
      navigation: () => navigation.navigate('AppScreen'),
    },
    {
      component: <SystemIcon />,
      label: appStrings?.device?.system?.text,
      navigation: () => navigation.navigate('SystemScreen'),
      line: 'no',
    },
    // {
    //   component: <FeaturesIcon />,
    //   navigation: () => navigation.navigate('FeaturesScreens'),
    //   label: 'Features',
    //   line: 'no',
    // },
  ];

  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['deviceDetails'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: '/devices/deviceDetails/67d151d59db44ff700d9bbae',
      }),
  });
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  console.log('*****', data);

  return (
    <MainBackground style={styles.mainBackground}>
      {isLoading ? (
        <Loader />
      ) : (
        <View>
          <LogoHeader
            onPress={() => navigation.navigate('NotificationScreen')}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <Spacing height={DimensionConstants.twentyFour} />
              <CustomCard style={styles.deviceCard}>
                <View style={styles.deviceHeader}>
                  <BlackWatchIcon />
                  <Spacing width={DimensionConstants.thirty} />
                  <View>
                    <View style={styles.deviceRow}>
                      <Text style={styles.deviceName}>
                        {data?.device?.deviceName}
                      </Text>
                      <DownArrowIcon marginLeft={DimensionConstants.twelve} />
                    </View>
                    <View style={styles.deviceRow}>
                      <Text style={styles.label}>
                        {appStrings?.device?.signal?.text} :
                      </Text>
                      <Text style={[styles.value, {color: theme.primary}]}>
                        Medium
                      </Text>
                    </View>
                    <View style={styles.deviceRow}>
                      <Text style={styles.label}>
                        {appStrings?.device?.battery?.text} :
                      </Text>
                      <Text style={[styles.value, {color: theme.primary}]}>
                        {data?.device?.batteryPer}%
                      </Text>
                    </View>
                    <CustomButton
                      text={appStrings?.device?.sync?.text}
                      color={'#F4D9DC'}
                      height={DimensionConstants.thirtyFive}
                      width={DimensionConstants.eighty}
                      textColor={'#FE605D'}
                    />
                  </View>
                </View>
                <CustomButton text={appStrings?.device?.edit?.text} />
              </CustomCard>
              <Spacing height={DimensionConstants.eighteen} />
              <CustomCard style={styles.featuresCard}>
                {icons.map((item, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      style={styles.featureRow}
                      onPress={item.navigation}>
                      <View style={styles.featureContent}>
                        {item.component}
                        <Text style={styles.featureText}>{item.label}</Text>
                      </View>
                      <TouchableOpacity onPress={item.navigation}>
                        <RightArrowIcon color="black" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                    {item?.line !== 'no' && <View style={styles.separator} />}
                  </View>
                ))}
              </CustomCard>
            </View>
          </ScrollView>
        </View>
      )}
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    justifyContent: 'space-between',
    flex: 1,
  },
  deviceCard: {
    padding: DimensionConstants.fifteen,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceName: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '500',
    lineHeight: DimensionConstants.thirty,
  },
  label: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.6)',
    lineHeight: DimensionConstants.twentyTwo,
  },
  value: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    marginLeft: DimensionConstants.ten,
  },
  featuresCard: {
    paddingRight: 0,
    borderRadius: DimensionConstants.twelve,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: DimensionConstants.ten,
    justifyContent: 'space-between',
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: DimensionConstants.twenty,
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    height: DimensionConstants.two,
    width: '90%',
    alignSelf: 'flex-end',
    marginVertical: DimensionConstants.ten,
  },
});

export default DevicesScreen;
