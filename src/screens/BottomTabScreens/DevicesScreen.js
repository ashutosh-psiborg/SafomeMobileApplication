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
import Spacing from '../../components/Spacing';
import {DimensionConstants} from '../../constants/DimensionConstants';
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
import LinearGradient from 'react-native-linear-gradient';

const DevicesScreen = ({navigation}) => {
  const [deviceId, setDeviceId] = useState('');

  // Static subscription data - replace with actual data from API when available

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['deviceDetails', deviceId],
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

  // Function to render subscription status badge
  const renderSubscriptionBadge = () => {
    if (data?.data?.subscription?.ActiveStatus?.status === 'active') {
      return (
        <View style={[styles.subscriptionBadge, {backgroundColor: '#E8F5E9'}]}>
          <Text style={[styles.subscriptionBadgeText, {color: '#2E7D32'}]}>
            Active
          </Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.subscriptionBadge, {backgroundColor: '#FFEBEE'}]}>
          <Text style={[styles.subscriptionBadgeText, {color: '#C62828'}]}>
            Expired
          </Text>
        </View>
      );
    }
  };

  return (
    <MainBackground style={styles.mainBackground}>
      {isLoading ? (
        <Loader />
      ) : (
        <View style={{flex: 1}}>
          <LogoHeader
            title="Device"
            onPress={() => navigation.navigate('NotificationScreen')}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Spacing height={DimensionConstants.fifteen} />
            <CustomCard style={styles.deviceCard}>
              <View style={styles.deviceHeader}>
                <View style={styles.deviceInfoContainer}>
                  <BlackWatchIcon width={60} height={60} />
                  <View style={styles.deviceDetails}>
                    <Text style={styles.deviceName}>
                      {data?.data?.deviceName || 'Refresh app'}
                    </Text>
                    <View style={styles.deviceStatusRow}>
                      <View style={styles.statusItem}>
                        <Text style={styles.label}>
                          {appStrings?.device?.battery?.text}:
                        </Text>
                        <Text style={[styles.value, {color: theme.primary}]}>
                          {data?.data?.batteryPer || 85}%
                        </Text>
                      </View>
                      {/* <View style={styles.statusItem}>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={[styles.value, {color: theme.primary}]}>
                          {data?.data?.isConnected
                            ? 'Connected'
                            : 'Disconnected'}
                        </Text>
                      </View> */}
                    </View>
                  </View>
                </View>
                {/* <CustomButton
                  text={appStrings?.device?.sync?.text}
                  color={'#F4D9DC'}
                  height={DimensionConstants.thirtyFive}
                  width={DimensionConstants.ninety}
                  textColor={'#FE605D'}
                  onPress={() => refetch()}
                  style={styles.syncButton}
                /> */}
              </View>

              <View style={styles.divider} />
              <LinearGradient
                colors={['#007bff', '#0056b3']}
                style={styles.subscriptionContainer}>
                <View
                  style={{
                    padding: DimensionConstants.ten,
                    borderRadius: 25,
                  }}>
                  <View style={styles.subscriptionHeader}>
                    <Text style={styles.sectionTitle}>
                      Subscription Details
                    </Text>
                    {renderSubscriptionBadge()}
                  </View>
                  <View style={styles.subscriptionDetails}>
                    <View style={styles.subscriptionInfo}>
                      <Text style={styles.subscriptionLabel}>Plan:</Text>
                      <Text style={styles.subscriptionValue}>
                        {data?.data?.subscription?.subscriptionPlan?.planName ||
                          'N/A'}
                      </Text>
                    </View>
                    <View style={styles.subscriptionInfo}>
                      <Text style={styles.subscriptionLabel}>Expires:</Text>
                      <Text
                        style={[
                          styles.subscriptionValue,
                          {
                            color:
                              data?.data?.subscription?.ActiveStatus?.daysLeft <
                              10
                                ? '#FE605D'
                                : 'white',
                          },
                        ]}>
                        {data?.data?.subscription?.ActiveStatus?.daysLeft || 0}{' '}
                        days left
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.viewMoreButton}
                      onPress={() => navigation.navigate('PlanDetail')}>
                      <Text style={styles.viewMoreText}>View More</Text>
                      <RightArrowIcon color="#fff" width={16} height={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </CustomCard>
            <Spacing height={DimensionConstants.ten} />
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
    padding: DimensionConstants.five,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  // New subscription styles
  deviceCard: {
    padding: DimensionConstants.ten,
    borderRadius: DimensionConstants.sixteen,
    backgroundColor: '#FFFFFF',
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceDetails: {
    marginLeft: DimensionConstants.fifteen,
    flex: 1,
  },
  deviceName: {
    fontSize: DimensionConstants.eighteen,
    fontWeight: '600',
    color: '#212121',
    marginBottom: DimensionConstants.five,
  },
  deviceStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '400',
    color: '#666666',
    marginRight: DimensionConstants.five,
  },
  value: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  syncButton: {
    borderRadius: DimensionConstants.eight,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: DimensionConstants.ten,
  },
  subscriptionContainer: {
    // backgroundColor: '#FAFAFA',
    borderRadius: 10,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DimensionConstants.ten,
  },
  sectionTitle: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '600',
    color: 'white',
  },
  subscriptionBadge: {
    paddingHorizontal: DimensionConstants.ten,
    paddingVertical: DimensionConstants.four,
    borderRadius: DimensionConstants.twelve,
  },
  subscriptionBadgeText: {
    fontSize: DimensionConstants.twelve,
    fontWeight: '600',
    color: 'white',
  },
  subscriptionDetails: {
    flexDirection: 'column',
    gap: DimensionConstants.eight,
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionLabel: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '400',
    color: 'white',
    width: DimensionConstants.sixty,
  },
  subscriptionValue: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    color: 'yellow',
    flex: 1,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: DimensionConstants.ten,
  },
  viewMoreText: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    color: '#fff',
    marginRight: DimensionConstants.five,
  },
});

export default DevicesScreen;
