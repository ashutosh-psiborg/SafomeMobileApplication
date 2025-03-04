import React from 'react';
import {View, Text} from 'react-native';
import CustomModal from './CustomModal';
import CustomButton from './CustomButton';
import Spacing from './Spacing';
import CommonForm from '../utils/CommonForm';
import { DimensionConstants,height } from '../constants/DimensionConstants';

const InputModal = ({
  isVisible,
  onClose,
  control,
  fields,
  errors,
  onSubmit,
  theme,
  t,
}) => {
  return (
    <CustomModal
      isVisible={isVisible}
      modalHeight={height / 1.6}
      onClose={onClose}>
      <View
        style={{
          justifyContent: 'space-between',
          flex: 1,
          paddingBottom: DimensionConstants.fifteen,
        }}>
        <View style={{alignItems: 'center'}}>
          <Spacing height={DimensionConstants.twenty} />
          <Text
            style={{
              fontWeight: '600',
              fontSize: DimensionConstants.sixteen,
            }}>
            {t('Add device details')}
          </Text>
        </View>
        <Spacing height={DimensionConstants.twenty} />

        <CommonForm control={control} fields={fields} errors={errors} />

        <View
          style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <CustomButton
            width={'48%'}
            text={t('Cancel')}
            color={theme.background}
            borderColor={theme.otpBox}
            textColor={theme.text}
            onPress={onClose}
          />
          <CustomButton
            text={t('Add')}
            width={'48%'}
            onPress={onSubmit}
          />
        </View>
      </View>
    </CustomModal>
  );
};

export default InputModal;
