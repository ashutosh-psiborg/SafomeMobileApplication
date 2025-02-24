import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {
  DimensionConstants,
  height,
} from '../../../../constants/DimensionConstants';
import RightArrowIcon from '../../../../assets/icons/RightArrowIcon';
import CustomModal from '../../../../components/CustomModal';
import CustomButton from '../../../../components/CustomButton';
import Spacing from '../../../../components/Spacing';

const ResetDeviceScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <MainBackground noPadding style={styles.container}>
      <CustomHeader
        title="Reset device"
        backgroundColor="#fff"
        backPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <View style={styles.resetContainer}>
          <Text style={styles.resetText}>Reset device</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <RightArrowIcon color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <CustomModal
        isVisible={modalVisible}
        modalHeight={height / 3.5}
        onClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Spacing height={DimensionConstants.twenty} />
            <Text style={styles.modalTitle}>Confirmation</Text>
            <Spacing height={DimensionConstants.twenty} />
            <Text style={styles.modalText}>
              Are you sure you want to reset your device?
            </Text>
            <Text style={styles.modalText}>This action cannot be undone.</Text>
          </View>
          <View style={styles.buttonRow}>
            <CustomButton
              text="Cancel"
              width="48%"
              color="#fff"
              textColor="rgba(0, 0, 0, 0.6)"
              borderColor="rgba(0, 0, 0, 0.3)"
              onPress={() => setModalVisible(false)}
            />
            <CustomButton text="Reset device" width="48%" color="#FF310C" />
          </View>
        </View>
      </CustomModal>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F7FC',
  },
  content: {
    padding: DimensionConstants.sixteen,
  },
  resetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: DimensionConstants.fifteen,
    borderRadius: DimensionConstants.twelve,
  },
  resetText: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  modalContent: {
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: DimensionConstants.fifteen,
  },
  modalHeader: {
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: '600',
    fontSize: DimensionConstants.sixteen,
  },
  modalText: {
    fontSize: DimensionConstants.fourteen,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ResetDeviceScreen;
