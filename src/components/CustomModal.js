import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { height } from '../constants/DimensionConstants';


const CustomModal = ({isVisible, onClose, children}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end', 
  },
  modalContent: {
    height: height * 0.4, 
    backgroundColor: 'white', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    padding: 16, 
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2}, 
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, 
  },
});

export default CustomModal;
