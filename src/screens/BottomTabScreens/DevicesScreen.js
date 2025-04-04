import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import MainBackground from '../../components/MainBackground';
import LogoHeader from '../../components/LogoHeader';
import BlackWatchIcon from '../../assets/icons/BlackWatchIcon';
import CustomCard from '../../components/CustomCard';
import CustomButton from '../../components/CustomButton';
import Spacing from '../../components/Spacing';
import {DimensionConstants} from '../../constants/DimensionConstants';
import DownArrowIcon from '../../assets/icons/DownArrowIcon';
import {useSelector} from 'react-redux';
import SystemIcon from '../../assets/icons/SystemIcon';
import {useQuery} from '@tanstack/react-query';
import fetcher from '../../utils/ApiService';
import Loader from '../../components/Loader';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RightArrowIcon from '../../assets/icons/RightArrowIcon';
import FeaturesIcon from '../../assets/icons/FeaturesIcon';
import AddRemoteIcon from '../../assets/icons/AddRemoteIcon';
import AboutDeviceIcon from '../../assets/icons/AboutDeviceIcon';
import SubscriptionIcon from '../../assets/icons/SubscriptionIcon';
const DevicesScreen = ({navigation}) => {
  const [deviceId, setDeviceId] = useState('');

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['deviceDetails'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `/devices/deviceDetails/${deviceId}`,
      }),
  });

  useFocusEffect(
    useCallback(() => {
      const getStoredDeviceId = async () => {
        try {
          const storedMongoId = await AsyncStorage.getItem(
            'selectedDeviceMongoId',
          );
          setDeviceId(storedMongoId);
          console.log('Stored Mongo _id:=======', storedMongoId);
        } catch (error) {
          console.error('Failed to retrieve stored device data:', error);
        }
      };
      getStoredDeviceId();
    }, []),
  );

  useEffect(() => {
    if (deviceId) {
      refetch();
    }
  }, [deviceId, refetch]);

  const {appStrings} = useSelector(state => state.language);

  useEffect(() => {
    const getStoredDeviceId = async () => {
      try {
        const storedMongoId = await AsyncStorage.getItem(
          'selectedDeviceMongoId',
        );
        setDeviceId(storedMongoId);
        console.log('Stored Mongo _id:=======', storedMongoId);
      } catch (error) {
        console.error('Failed to retrieve stored device data:', error);
      }
    };

    getStoredDeviceId();
  }, []);

  const icons = [
    // {
    //   component: <AppsIcon />,
    //   label: appStrings?.device?.apps?.text,
    //   navigation: () => navigation.navigate('AppScreen'),
    // },
    {
      component: <AddRemoteIcon />,
      label: 'Manage Devices',
      navigation: () => navigation.navigate('AddRemoveDeviceScreen'),
    },
    {
      component: <SystemIcon />,
      label: appStrings?.device?.system?.text,
      navigation: () => navigation.navigate('SystemScreen'),
    },
    {
      component: <FeaturesIcon />,
      label: 'Features',
      navigation: () => navigation.navigate('FeaturesScreens'),
      // line: 'no',
    },

    {
      component: <SubscriptionIcon />,
      label: 'Subscription',
      navigation: () => navigation.navigate('SubscriptionScreen'),
    },
    {
      component: <AboutDeviceIcon />,
      label: 'About Device',
      navigation: () => navigation.navigate('AboutDeviceScreen'),
      line: 'no',
    },
  ];

  const fields = [
    {
      name: 'deviceName',
      placeholder: 'Device Name',
    },
  ];

  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  console.log('battery', data?.data?.batteryPer);
  return (
    <MainBackground style={styles.mainBackground}>
      {isLoading ? (
        <Loader />
      ) : (
        <View style={{flex: 1}}>
          <LogoHeader
            onPress={() => navigation.navigate('NotificationScreen')}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Spacing height={DimensionConstants.twentyFour} />
            <CustomCard style={styles.deviceCard}>
              <View style={styles.deviceHeader}>
                <BlackWatchIcon />
                <Spacing width={DimensionConstants.thirty} />
                <View>
                  <View style={styles.deviceRow}>
                    <Text style={styles.deviceName}>
                      {data?.data?.deviceName || 'Device'}
                    </Text>
                    <DownArrowIcon marginLeft={DimensionConstants.twelve} />
                  </View>
                  <View style={styles.deviceRow}>
                    <Text style={styles.label}>
                      {appStrings?.device?.battery?.text} :
                    </Text>
                    <Text style={[styles.value, {color: theme.primary}]}>
                      {data?.data?.batteryPer || 85}%
                    </Text>
                  </View>
                  <CustomButton
                    text={appStrings?.device?.sync?.text}
                    color={'#F4D9DC'}
                    height={DimensionConstants.thirtyFive}
                    width={DimensionConstants.eighty}
                    textColor={'#FE605D'}
                    onPress={() => {
                      refetch();
                    }}
                  />
                </View>
              </View>
              {/* <CustomButton
                text={appStrings?.device?.edit?.text}
                onPress={() => setModalVisible(true)}
              /> */}
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
    paddingHorizontal: DimensionConstants.fifteen,
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
