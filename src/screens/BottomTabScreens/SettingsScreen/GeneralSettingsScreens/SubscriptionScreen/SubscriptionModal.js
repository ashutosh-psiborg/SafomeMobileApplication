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
import CrossIcon from '../../../../../assets/icons/CrossIcon';
import TickIcon from '../../../../../assets/icons/TickIcon';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import Spacing from '../../../../../components/Spacing';
import CustomButton from '../../../../../components/CustomButton';

const SubscriptionModal = ({visible, onClose, modalPlans, navigation}) => {
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
            <Text style={styles.modalTitle}>
              Subscribe to {modalPlans?.planName}
            </Text>
            <View style={styles.cardContainer}>
              <TouchableOpacity
                style={[
                  styles.planContainer,
                  {
                    backgroundColor: '#0279E1',
                    borderColor: '#0279E1',
                  },
                ]}>
                <View style={styles.planHeader}>
                  <Text style={[styles.priceText, {color: '#ffffff'}]}>
                    ₹ {modalPlans?.price}
                  </Text>
                  <View
                    style={[
                      styles.durationContainer,
                      {
                        backgroundColor: '#ffffff',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.durationText,
                        {
                          color: '#0279E1',
                        },
                      ]}>
                      {modalPlans?.durationInMonths} months
                    </Text>
                  </View>
                </View>
                <Spacing height={DimensionConstants.sixteen} />
                <Text
                  style={[
                    styles.descriptionText,
                    {
                      color: '#ffffff',
                    },
                  ]}>
                  {modalPlans?.planName}
                </Text>
              </TouchableOpacity>
            </View>
            <CustomButton
              text={`Subscribe Now ₹ ${modalPlans?.price}`}
              onPress={() =>
                navigation.replace('BuySubscription', {plan: modalPlans})
              }
            />
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
    fontSize: DimensionConstants.thirty,
    fontWeight: '600',
    marginBottom: DimensionConstants.sixteen,
  },
  cardContainer: {
    flex: 1,
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
