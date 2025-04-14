import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../../../../components/CustomHeader';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import {useMutation, useQuery} from '@tanstack/react-query';
import fetcher from '../../../../../utils/ApiService';
import {useRoute} from '@react-navigation/native';
import CustomButton from '../../../../../components/CustomButton';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BuySubscription = ({navigation}) => {
  const route = useRoute();
  const {plan} = route.params;
  const [selectedCouponCode, setSelectedCouponCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [appliedDetails, setAppliedDetails] = useState(null);

  const {data} = useQuery({
    queryKey: ['coupons'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `/coupon/fetchAllCoupons`,
      }),
  });

  const {data: data1} = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => fetcher({method: 'GET', url: 'auth/profile'}),
  });

  const applyCouponMutation = useMutation({
    mutationFn: () =>
      fetcher({
        method: 'POST',
        url: '/coupon/apply',
        data: {
          couponCode: selectedCouponCode,
          userId: data1?.data?.user?._id,
          orderAmount: plan?.price,
          planId: plan?._id,
        },
      }),

    onSuccess: response => {
      setAppliedDetails(response?.couponDetails);
      setApplied(true);
      Alert.alert('Success', 'Coupon applied successfully!');
    },
    onError: error => {
      Alert.alert(
        `${selectedCouponCode}`,
        error?.response?.data?.message || 'Failed to apply coupon.',
      );
    },
  });

  return (
    <View style={styles.mainBackground}>
      <CustomHeader
        title={'Buy Subscription'}
        backPress={() => navigation.goBack()}
        backgroundColor={'#fff'}
        titleColor="#FFFFFF"
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainCard}>
          <Text style={styles.sectionTitle}>Plan Details</Text>
          <View style={styles.planDetailsCard}>
            <View style={styles.planIconRow}>
              <View style={styles.planIconContainer}>
                <Text style={styles.planInitial}>
                  {plan?.planName?.[0] || 'P'}
                </Text>
              </View>
              <View>
                <Text style={styles.planName}>{plan?.planName}</Text>
                <Text style={styles.planDuration}>
                  {plan?.durationInMonths} months
                </Text>
              </View>
            </View>
            <Text style={styles.planPrice}>₹{plan?.price}</Text>
          </View>

          <Text style={[styles.sectionTitle, {marginTop: 20}]}>
            Apply Coupon
          </Text>
          <View style={styles.couponContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={'Enter coupon code'}
              placeholderTextColor="#9EA3B8"
              value={selectedCouponCode}
              onChangeText={text => setSelectedCouponCode(text.toUpperCase())}
              autoCapitalize={'characters'}
              editable={!applied}
            />
            <View
              style={[
                styles.applyButton,
                applied && styles.appliedButton,
                (!selectedCouponCode || applyCouponMutation.isLoading) &&
                  styles.disabledButton,
              ]}
              disabled={
                !selectedCouponCode || applyCouponMutation.isLoading || applied
              }
              onPress={() => applyCouponMutation.mutate()}>
              <Text style={styles.applyText}>
                {applyCouponMutation.isLoading
                  ? 'Applying...'
                  : applied
                  ? 'Applied'
                  : 'Apply'}
              </Text>
              {applied && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={20}
                  color={'white'}
                  style={{marginLeft: 5}}
                />
              )}
            </View>
          </View>

          {data?.coupons?.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>
                Available Coupons ({data?.coupons?.length})
              </Text>
              <View>
                {data?.coupons?.map((item, index) => {
                  const isSelected = selectedCouponCode === item.couponCode;

                  return isSelected && applied ? (
                    <View key={index}>
                      <LinearGradient
                        colors={['#ECF1FF', '#F2F8FF', '#E8F4FF']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={[styles.couponCard, styles.selectedCouponCard]}>
                        <View style={styles.couponHeader}>
                          <Text style={styles.couponCode}>
                            {item.couponCode}
                          </Text>
                          <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>
                              {item.discountValue}% OFF
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.couponName}>{item.couponName}</Text>
                        <Text style={styles.couponDescription}>
                          {item.description}
                        </Text>
                        <View style={styles.couponDetailRow}>
                          <View style={styles.couponDetailRow}>
                            <Text style={styles.couponDetailLabel}>
                              Min spend:{' '}
                            </Text>
                            <Text style={styles.couponDetailValue}>
                              ₹{item.minSpend}
                            </Text>
                          </View>
                          <View style={styles.couponDetailRow}>
                            <Text style={styles.couponDetailLabel}>
                              Max spend:{' '}
                            </Text>
                            <Text style={styles.couponDetailValue}>
                              ₹{item.maxSpend}
                            </Text>
                          </View>
                        </View>
                        {applied && (
                          <View style={styles.savingsContainer}>
                            <Text style={styles.savingsText}>
                              You save: ₹{appliedDetails?.discountAmount}
                            </Text>
                          </View>
                        )}
                      </LinearGradient>
                    </View>
                  ) : (
                    <TouchableOpacity
                      key={index}
                      disabled={applied}
                      onPress={() => setSelectedCouponCode(item.couponCode)}
                      style={[
                        styles.couponCard,
                        isSelected && !applied && styles.selectedCouponCard,
                      ]}>
                      <View style={styles.couponHeader}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <AntDesign name="tag" color={'green'} size={20} />
                          <Text style={styles.couponCode}>
                            {item.couponCode}
                          </Text>
                        </View>
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountText}>
                            {item.discountValue}% OFF
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.couponName}>{item.couponName}</Text>
                      <Text style={styles.couponDescription}>
                        {item.description}
                      </Text>
                      <View style={styles.couponDetailRow}>
                        <View style={styles.couponDetailRow}>
                          <Text style={styles.couponDetailLabel}>
                            Min spend:{' '}
                          </Text>
                          <Text style={styles.couponDetailValue}>
                            ₹{item.minSpend}
                          </Text>
                        </View>
                        <View style={styles.couponDetailRow}>
                          <Text style={styles.couponDetailLabel}>
                            Max spend:{' '}
                          </Text>
                          <Text style={styles.couponDetailValue}>
                            ₹{item.maxSpend}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : (
            <View style={styles.noCouponsContainer}>
              <Text style={styles.noCouponsText}>No coupons available</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Duration</Text>
            <Text>{plan?.durationInMonths} months</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Plan</Text>
            <Text>{plan?.planName}</Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Plan Price</Text>
            <Text>₹ {plan?.price}</Text>
          </View>

          {applied && (
            <View style={styles.summaryRow}>
              <Text>Discount</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                - ₹ {appliedDetails?.discountAmount}
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>93288
            <Text style={styles.totalValue}>
              ₹
              {applied
                ? appliedDetails?.originalAmount -
                  appliedDetails?.discountAmount
                : plan?.price}
            </Text>
          </View>
        </View>
        {/* <View
          style={
            {
              // marginHorizontal: DimensionConstants.twenty,
              // marginBottom: DimensionConstants.ten,
            }
          }> */}
        <CustomButton
          text={'Proceed to Payment'}
          style={styles.paymentButton}
          textStyle={styles.paymentButtonText}
        />
        {/* </View> */}
      </View>
    </View>
  );
};

export default BuySubscription;

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F5F7FA',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  mainCard: {
    padding: DimensionConstants.twenty,
  },
  sectionTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  planDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3EAFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  planInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A6FFF',
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  planDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  couponContainer: {
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    height: DimensionConstants.fortyFour,
    paddingHorizontal: 16,
    color: '#333',
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#4A6FFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    flexDirection: 'row',
  },
  appliedButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#B0B0B0',
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  couponCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    position: 'relative',
    overflow: 'hidden',
  },
  selectedCouponCard: {
    borderColor: '#4A6FFF',
    borderWidth: 2,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountBadge: {
    backgroundColor: '#FFE8EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#FF3B4E',
    fontWeight: '700',
    fontSize: 14,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A6FFF',
    marginLeft: 10,
  },
  couponName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  couponDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  couponDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginVertical: 4,
  },
  couponDetailLabel: {
    fontSize: 14,
    color: '#666',
  },
  couponDetailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  noCouponsContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 20,
  },
  noCouponsText: {
    fontSize: 16,
    color: '#666',
  },
  summaryContainer: {
    backgroundColor: '#F5F7FA',
    marginHorizontal: DimensionConstants.twenty,
    paddingVertical: 16,
    borderTopWidth: 0.5,
    borderColor: '#D1D5DB',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  discountValue: {
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 10,
  },
  savingsContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  savingsText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1.5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  discountValue: {
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A6FFF',
  },
  paymentButton: {
    backgroundColor: '#4A6FFF',
    height: 50,
    borderRadius: 12,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
