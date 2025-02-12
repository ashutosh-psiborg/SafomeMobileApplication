import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CrossIcon from '../../../assets/icons/CrossIcon';
import TickIcon from '../../../assets/icons/TickIcon';
import { DimensionConstants } from '../../../constants/DimensionConstants';
import Spacing from '../../../components/Spacing';
import CustomButton from '../../../components/CustomButton';

const SubscriptionModal = ({
  visible,
  onClose,
  modalPlans,
  modalSelectedPlan,
  setModalSelectedPlan,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}>
          <LinearGradient
            colors={['#ffffff', '#005BBB']}
            start={{x: 0, y: 0.3}}
            end={{x: 0, y: 1}}
            style={styles.gradientBackground}>
            <TouchableOpacity
              onPress={onClose}
              style={{alignItems: 'flex-end'}}>
              <CrossIcon />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Subscribe to premium</Text>

            {modalPlans.map(plan => {
              const isSelected = modalSelectedPlan === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  onPress={() => setModalSelectedPlan(plan.id)}
                  style={[
                    styles.planContainer,
                    {
                      backgroundColor: isSelected ? '#0279E1' : null,
                      borderColor: '#0279E1',
                      marginBottom:
                        plan?.last === 'yes'
                          ? 0
                          : DimensionConstants.sixteen,
                    },
                  ]}>
                  <View style={styles.planHeader}>
                    <Text
                      style={[
                        styles.priceText,
                        {color: isSelected ? '#ffffff' : '#0279E1'},
                      ]}>
                      {plan?.price}
                    </Text>
                    <View
                      style={[
                        styles.durationContainer,
                        {
                          backgroundColor: isSelected
                            ? '#ffffff'
                            : '#FE605D',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.durationText,
                          {
                            color: isSelected ? '#0279E1' : '#ffffff',
                          },
                        ]}>
                        {plan?.duration}
                      </Text>
                    </View>
                  </View>
                  {plan?.save && (
                    <View
                      style={[
                        styles.saveContainer,
                        {
                          backgroundColor: isSelected
                            ? '#ffffff'
                            : '#0279E1',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.saveText,
                          {
                            color: isSelected ? '#0279E1' : '#ffffff',
                          },
                        ]}>
                        {plan?.save}
                      </Text>
                    </View>
                  )}
                  <Spacing height={DimensionConstants.sixteen} />
                  <Text
                    style={[
                      styles.descriptionText,
                      {
                        color: isSelected
                          ? '#ffffff'
                          : '#0279E1',
                      },
                    ]}>
                    {plan?.description}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {[0, 1, 2].map(index => (
              <View key={index}>
                <View style={{flexDirection: 'row'}}>
                  <TickIcon />
                  <Text
                    style={{
                      flex: 1,
                      flexWrap: 'wrap',
                      marginLeft: DimensionConstants.ten,
                      color: '#FFFFFF',
                    }}>
                    Lorem ipsum dolor sit amet, sfvbfdcfh adipiscing elit
                  </Text>
                </View>
                <Spacing height={DimensionConstants.twelve} />
              </View>
            ))}
            <CustomButton text={'Subscribe now'} />
            <CustomButton
              onPress={onClose}
              text={'See all plans'}
              textColor={'#000000'}
              color={'#ffffff'}
            />
          </LinearGradient>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '85%',
    borderRadius: DimensionConstants.twelve,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: DimensionConstants.twelve,
    padding: DimensionConstants.sixteen,
  },
  modalTitle: {
    fontSize: DimensionConstants.thirtyTwo,
    fontWeight: '600',
    marginBottom: DimensionConstants.sixteen,
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
});

export default SubscriptionModal;
