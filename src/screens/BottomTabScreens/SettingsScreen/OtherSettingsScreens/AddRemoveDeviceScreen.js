import {View, Text, Image, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {useSelector} from 'react-redux';
import CustomCard from '../../../../components/CustomCard';
import Spacing from '../../../../components/Spacing';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import {ImageConstants} from '../../../../constants/ImageConstants';
import {useQuery, useMutation} from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';
import CustomButton from '../../../../components/CustomButton';
import InputModal from '../../../../components/InputModal';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';

const AddRemoveDeviceScreen = ({navigation}) => {
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const {t} = useTranslation();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({});
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
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
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['deviceDetails'],
    queryFn: () => fetcher({method: 'GET', url: 'devices/getDevices'}),
  });
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
      refetch();
      setInputModalVisible(false);
    },
    onError: error => {
      const errorMessage = error?.response?.data?.message;
      Alert.alert('Error', errorMessage);
    },
  });

  const onSubmit = data => {
    console.log('🚀 Submitting Data:', data);
    mutation.mutate(data);
  };
  const deleteDevice = useMutation({
    mutationFn: deviceId =>
      fetcher({
        method: 'PATCH',
        url: `devices/deleteDevice/${deviceId}`,
      }),
    onSuccess: () => {
      Alert.alert('Success', 'Device removed successfully.');
      refetch();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to remove device.');
    },
  });

  const handleRemoveDevice = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to remove this device?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const deviceId = data?.devices[0]?._id;
            if (deviceId) {
              deleteDevice.mutate(deviceId);
            } else {
              Alert.alert('Error', 'Device ID not found.');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <MainBackground noPadding style={{backgroundColor: theme.otpBox}}>
      <CustomHeader
        title={'Add / remove device'}
        backgroundColor={theme.background}
        backPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {data?.devices[0]?.deviceId ? (
          <CustomCard style={styles.card}>
            <View style={styles.innerContainer}>
              <Image source={ImageConstants.blackWatch} />
              <Spacing height={DimensionConstants.thirty} />
              <Text style={styles.deviceName}>
                SOS {data?.devices[0]?.deviceName}
              </Text>
              <Text style={styles.macId}>
                MAC ID : {data?.devices[0]?.deviceId}
              </Text>
              <CustomButton
                width={'110%'}
                text={'Remove device'}
                onPress={handleRemoveDevice}
              />
            </View>
          </CustomCard>
        ) : (
          <View style={styles.dashedContainer}>
            <Text
              style={{fontSize: DimensionConstants.sixteen, fontWeight: '500'}}>
              No device found
            </Text>
            <CustomButton
              width={'100%'}
              text={'Add device'}
              onPress={() => setInputModalVisible(true)}
            />
          </View>
        )}
      </View>
      <InputModal
        isVisible={inputModalVisible}
        onClose={() => setInputModalVisible(false)}
        control={control}
        fields={fields}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        theme={theme}
        t={t}
      />
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: DimensionConstants.sixteen,
    paddingVertical: DimensionConstants.twentyFour,
  },
  card: {
    borderRadius: DimensionConstants.twelve,
  },
  innerContainer: {
    alignItems: 'center',
    paddingHorizontal: DimensionConstants.sixteen,
    paddingVertical: DimensionConstants.twentyFour,
  },
  deviceName: {
    fontSize: DimensionConstants.sixteen,
  },
  macId: {
    fontSize: DimensionConstants.fourteen,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  dashedContainer: {
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: DimensionConstants.one,
    borderRadius: DimensionConstants.twelve,
    padding: DimensionConstants.fifteen,
  },
});

export default AddRemoveDeviceScreen;
