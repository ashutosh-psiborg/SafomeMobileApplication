import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import MainBackground from '../../components/MainBackground';
import CustomHeader from '../../components/CustomHeader';
import {DimensionConstants} from '../../constants/DimensionConstants';
import CustomCard from '../../components/CustomCard';
import Spacing from '../../components/Spacing';
import FilterContainer from '../../components/FilterContainer';
import {useSelector} from 'react-redux';
import {useQuery} from '@tanstack/react-query';
import fetcher from '../../utils/ApiService';
import Loader from '../../components/Loader';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PlanDetail({navigation}) {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  const [selected, setSelected] = useState('Active');
  const [deviceId, setDeviceId] = useState(null);
  const options = ['Active', 'Upcoming'];

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
    }, [deviceId]),
  );
  const {data: activeData, isLoading: isActiveLoading} = useQuery({
    queryKey: ['subscriptions', 'active', deviceId],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `coupon_subscription/getAllSubscription?deviceId=${deviceId}&status=active`,
      }),
  });

  const {data: upcomingData, isLoading: isUpcomingLoading} = useQuery({
    queryKey: ['subscriptions', 'upcoming', deviceId],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `coupon_subscription/getAllSubscription?deviceId=${deviceId}&status=upcoming`,
      }),
  });

  // Determine which data to display based on filter
  const subscriptions = useMemo(() => {
    if (selected === 'Active') {
      return activeData?.data?.results || [];
    }
    return upcomingData?.data?.results || [];
  }, [selected, activeData, upcomingData]);

  // Format date for display
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <CustomHeader
        backPress={() => navigation.goBack()}
        title="Plan Details"
        backgroundColor="white"
      />
      <MainBackground style={styles.mainBackground}>
        <FilterContainer
          options={options}
          selected={selected}
          onSelect={setSelected}
          theme={theme}
        />
        <Spacing height={DimensionConstants.ten} />
        {isActiveLoading || isUpcomingLoading ? (
          <Loader />
        ) : (
          <ScrollView
            contentContainerStyle={{paddingBottom: DimensionConstants.fifteen}}>
            {subscriptions.length === 0 ? (
              <Text style={styles.noPlansText}>
                No {selected.toLowerCase()} plans available.
              </Text>
            ) : (
              subscriptions.map((subscription, index) => (
                <CustomCard key={subscription._id} style={styles.card}>
                  <View style={styles.gradientContainer}>
                    <View style={styles.header}>
                      <Text style={styles.planTitle}>
                        {subscription.plan.planName}
                      </Text>
                      <Text style={styles.planPrice}>
                        ₹{subscription.finalPrice}
                      </Text>
                    </View>
                    <View style={styles.details}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          {selected === 'Active'
                            ? 'Expires on'
                            : 'Activates on'}
                        </Text>
                        <Text style={styles.detailValue}>
                          {formatDate(
                            selected === 'Active'
                              ? subscription.ActiveStatus.expireDate
                              : subscription.ActiveStatus.activeDate,
                          )}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Validity</Text>
                        <Text style={styles.detailValue}>
                          {subscription.ActiveStatus.daysLeft} Days
                        </Text>
                      </View>
                    </View>

                    {selected === 'Upcoming' && (
                      <>
                        <Spacing height={DimensionConstants.seven} />
                        <View style={styles.divider} />
                        <Text
                          style={{
                            fontSize: DimensionConstants.fourteen,
                            fontWeight: '500',
                          }}>
                          Upcoming plan
                        </Text>
                        <Spacing height={DimensionConstants.five} />
                        <Text
                          style={{
                            fontSize: DimensionConstants.thirteen,
                          }}>
                          Your plan will be automatically activated after your
                          current plan expires.
                        </Text>
                      </>
                    )}
                  </View>
                </CustomCard>
              ))
            )}
          </ScrollView>
        )}
      </MainBackground>
    </>
  );
}

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  card: {
    borderRadius: DimensionConstants.sixteen,
    overflow: 'hidden',
    padding: 0,
    marginBottom: DimensionConstants.ten,
  },
  gradientContainer: {
    padding: DimensionConstants.fifteen,
    borderRadius: DimensionConstants.sixteen,
  },
  header: {
    marginBottom: DimensionConstants.fifteen,
  },
  planTitle: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '500',
    opacity: 0.9,
  },
  planPrice: {
    fontSize: DimensionConstants.twenty,
    fontWeight: '800',
    marginTop: DimensionConstants.five,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.2)',
    marginVertical: DimensionConstants.ten,
  },
  details: {
    marginBottom: DimensionConstants.fifteen,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: DimensionConstants.ten,
  },
  detailLabel: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '400',
    opacity: 0.8,
  },
  detailValue: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  activePlanText: {
    fontSize: DimensionConstants.fifteen,
    fontWeight: '500',
    opacity: 0.9,
  },
  button: {
    width: 120,
    borderRadius: DimensionConstants.twentyFive,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DimensionConstants.five,
    borderWidth: 1,
    borderColor: 'rgba(18,18,18,0.2)',
  },
  buttonText: {
    fontSize: DimensionConstants.fifteen,
    fontWeight: '600',
    textAlign: 'center',
    color: '#0279E1',
  },
  noPlansText: {
    fontSize: DimensionConstants.sixteen,
    textAlign: 'center',
    marginTop: DimensionConstants.twenty,
    color: '#666',
  },
});
