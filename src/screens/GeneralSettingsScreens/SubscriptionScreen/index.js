import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import CustomCard from '../../../components/CustomCard';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import Spacing from '../../../components/Spacing';
import CustomButton from '../../../components/CustomButton';
import SubscriptionModal from './SubscriptionModal';

const plans = [
  {id: 1, price: '₹ 199', duration: 'Monthly', description: 'Billed monthly'},
  {
    id: 2,
    price: '₹ 299',
    save: 'SAVE 33%',
    duration: 'Quarterly',
    description: 'Billed every 3 months',
  },
  {
    id: 3,
    price: '₹ 499',
    save: 'SAVE 33%',
    duration: 'Half-Yearly',
    description: 'Billed every 6 months',
  },
  {
    id: 4,
    price: '₹ 699',
    save: 'SAVE 33%',
    duration: 'Annually',
    description: 'Billed annually',
    last: 'yes',
  },
];

const SubscriptionScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [modalSelectedPlan, setModalSelectedPlan] = useState(1); // For modal selection
  const [modalVisible, setModalVisible] = useState(false);

  const modalPlans = plans.slice(0, 2); // Show only first 2 plans in modal

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader title={'Plans'} backgroundColor="#ffffff" />
      <Spacing height={DimensionConstants.eight} />

      <View style={styles.container}>
        <CustomCard style={styles.card}>
          {plans.map(plan => {
            const isSelected = selectedPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                style={[
                  styles.planContainer,
                  {
                    backgroundColor: isSelected ? '#0279E1' : '#ffffff',
                    borderColor: isSelected ? '#0279E1' : '#F4D9DC',
                    marginBottom:
                      plan?.last === 'yes' ? 0 : DimensionConstants.sixteen,
                  },
                ]}>
                <View style={styles.planHeader}>
                  <Text
                    style={[
                      styles.priceText,
                      {color: isSelected ? '#ffffff' : '#000000'},
                    ]}>
                    {plan?.price}
                  </Text>
                  <View
                    style={[
                      styles.durationContainer,
                      {backgroundColor: isSelected ? '#ffffff' : '#FE605D'},
                    ]}>
                    <Text
                      style={[
                        styles.durationText,
                        {color: isSelected ? '#0279E1' : '#ffffff'},
                      ]}>
                      {plan?.duration}
                    </Text>
                  </View>
                </View>

                {plan?.save && (
                  <View
                    style={[
                      styles.saveContainer,
                      {backgroundColor: isSelected ? '#ffffff' : '#0279E1'},
                    ]}>
                    <Text
                      style={[
                        styles.saveText,
                        {color: isSelected ? '#0279E1' : '#ffffff'},
                      ]}>
                      {plan?.save}
                    </Text>
                  </View>
                )}

                <Spacing height={DimensionConstants.sixteen} />
                <Text
                  style={[
                    styles.descriptionText,
                    {color: isSelected ? '#ffffff' : '#000000'},
                  ]}>
                  {plan?.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </CustomCard>

        <CustomButton
          text={'Have a coupon code'}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <SubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modalPlans={modalPlans}
        modalSelectedPlan={modalSelectedPlan}
        setModalSelectedPlan={setModalSelectedPlan}
      />
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    padding: DimensionConstants.sixteen,
    justifyContent: 'space-between',
    flex: 1,
  },
  card: {
    borderRadius: DimensionConstants.twelve,
  },
  planContainer: {
    padding: DimensionConstants.twelve,
    borderRadius: DimensionConstants.twelve,
    borderWidth: 1,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: DimensionConstants.twentyFour,
    fontWeight: '600',
  },
  durationContainer: {
    borderRadius: DimensionConstants.twenty,
    paddingHorizontal: DimensionConstants.ten,
    paddingVertical: DimensionConstants.two,
  },
  durationText: {
    fontWeight: '500',
  },
  saveContainer: {
    padding: DimensionConstants.three,
    width: DimensionConstants.sixtyFive,
    alignItems: 'center',
    borderRadius: DimensionConstants.five,
  },
  saveText: {
    fontSize: DimensionConstants.ten,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: DimensionConstants.twelve,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    height: '85%',
    borderRadius: DimensionConstants.twelve,
    // padding: DimensionConstants.sixteen,
  },
  modalTitle: {
    fontSize: DimensionConstants.thirtyTwo,
    fontWeight: '600',
    marginBottom: DimensionConstants.sixteen,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: DimensionConstants.eight,
    padding: DimensionConstants.twelve,
  },
  closeButton: {
    marginTop: DimensionConstants.eight,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#0279E1',
    fontWeight: '600',
  },
  gradientBackground: {
    flex: 1,
    borderRadius: DimensionConstants.twelve,
    padding: DimensionConstants.sixteen,
  },
});

export default SubscriptionScreen;
