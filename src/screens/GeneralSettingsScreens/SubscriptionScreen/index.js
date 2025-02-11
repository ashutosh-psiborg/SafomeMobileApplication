import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import CustomCard from '../../../components/CustomCard';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import Spacing from '../../../components/Spacing';
import CustomButton from '../../../components/CustomButton';

const plans = [
  {id: 1, price: '₹ 199', duration: 'Monthly', description: 'Billed monthly'},
  {
    id: 2,
    price: '₹ 499',
    save: 'SAVE 33%',
    duration: 'Quarterly',
    description: 'Billed every 3 months',
  },
  {
    id: 3,
    price: '₹ 899',
    save: 'SAVE 33%',
    duration: 'Half-Yearly',
    description: 'Billed every 6 months',
  },
  {
    id: 4,
    price: '₹ 1599',
    save: 'SAVE 33%',
    duration: 'Annually',
    description: 'Billed annually',
    last: 'yes',
  },
];

const SubscriptionScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState(1);

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
                    {plan.price}
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
                      {plan.duration}
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
                  {plan.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </CustomCard>

        <CustomButton text={'Have a coupon code'} />
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
    width: '20%',
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
});

export default SubscriptionScreen;
