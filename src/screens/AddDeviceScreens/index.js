import {View, Text, Image, Alert} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../components/MainBackground';
import {ImageConstants} from '../../constants/ImageConstants';
import {DimensionConstants, height} from '../../constants/DimensionConstants';
import CustomHeader from '../../components/CustomHeader';
import Spacing from '../../components/Spacing';
import CustomButton from '../../components/CustomButton';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import CustomModal from '../../components/CustomModal';
import {AddDeviceStyles} from './Styles/AddDeviceStyles';
import GlobeIcon from '../../assets/icons/GlobeIcon';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../utils/ApiService';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {validationSchema} from '../../utils/Validations';
import CommonForm from '../../utils/CommonForm';

const AddDeviceScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputModalVisible, setInputModalVisible] = useState(false);

  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const {t} = useTranslation();
  const styles = AddDeviceStyles(theme);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    // resolver: yupResolver(validationSchema.pick(['deviceName', 'macId'])),
  });

  const fields = [
    {
      name: 'deviceName',
      placeholder: t('Enter device name'),
    },
    {
      name: 'imei',
      placeholder: t('IMEI'),
    },
    {
      name: 'deviceId',
      placeholder: t('Device ID'),
    },
  ];

  const mutation = useMutation({
    mutationFn: async data => {
      return fetcher({
        method: 'POST',
        url: '/devices/addDevices',
        data,
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Device added successfully!');
      navigation.navigate('MainApp');
    },
    onError: error => {
      const errorMessage = error?.response?.data?.message || 'Unknown error';
      Alert.alert('Error', errorMessage);
    },
  });

  const onSubmit = data => {
    console.log('🚀 Submitting Data:', data);
    mutation.mutate(data);
  };

  return (
    <MainBackground noPadding>
      <Image
        source={ImageConstants.backgroundImage}
        style={styles.backgroundImage}
      />

      <View style={styles.container}>
        <View>
          <CustomHeader
            skip
            onSkipPress={() => navigation.navigate('MainApp')}
          />
          <Spacing height={DimensionConstants.twentyEight} />
          <Text style={styles.title}>{t('Add device details')}</Text>
        </View>

        <View style={styles.iconContainer}>
          <Image source={ImageConstants.watch} />
        </View>

        <CustomButton text={t('Next')} onPress={() => setModalVisible(true)} />

        <CustomModal
          isVisible={modalVisible}
          modalHeight={height / 3.5}
          onClose={() => setModalVisible(false)}>
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
            <View>
              <CustomButton text={t('Scan QR code')} />
              <CustomButton
                text={t('Enter details manually')}
                onPress={() => {
                  setModalVisible(false);
                  setTimeout(() => setInputModalVisible(true), 300);
                }}
                color={theme.background}
                borderColor={theme.midBorderColor}
                textColor={theme.text}
              />
            </View>
          </View>
        </CustomModal>

        <CustomModal
          isVisible={inputModalVisible}
          modalHeight={height / 2.2}
          onClose={() => setInputModalVisible(false)}>
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
                onPress={() => setInputModalVisible(false)}
              />
              <CustomButton
                text={t('Add')}
                width={'48%'}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </CustomModal>
      </View>
    </MainBackground>
  );
};

export default AddDeviceScreen;
