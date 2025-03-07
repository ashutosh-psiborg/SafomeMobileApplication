import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
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
import {validationSchema} from '../../../../utils/Validations';
import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddRemoveDeviceScreen = ({navigation}) => {
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const {t} = useTranslation();
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  const {data: uidData} = useQuery({
    queryKey: ['deviceUid'],
    queryFn: () => fetcher({method: 'GET', url: 'devices/getUid'}),
  });

  const {data, loading, refetch} = useQuery({
    queryKey: ['deviceDetails'],
    queryFn: () => fetcher({method: 'GET', url: 'devices/getDevices'}),
  });

  useEffect(() => {
    const getStoredDeviceId = async () => {
      try {
        const storedDeviceId = await AsyncStorage.getItem('selectedDeviceId');
        if (storedDeviceId) {
          setSelectedDeviceId(storedDeviceId);
        }
      } catch (error) {
        console.error('Failed to retrieve device ID:', error);
      }
    };

    getStoredDeviceId();
  }, []);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(
      validationSchema.pick(['deviceName', 'deviceId', 'imei']),
    ),
  });

  useEffect(() => {
    if (uidData?.data?.uid) {
      reset({uid: uidData.data.uid});
    }
  }, [uidData, reset]);

  const fields = [
    {
      name: 'uid',
      placeholder: uidData?.data?.uid || 'Fetching UID...',
      defaultValue: uidData?.data?.uid || '',
      disabled: true,
    },
    {
      name: 'deviceName',
      placeholder: t('Enter device name'),
    },
    {
      name: 'imei',
      placeholder: t('IMEI'),
      maxLength: 15,
      keyboardType: 'phone-pad',
    },
    {
      name: 'deviceId',
      placeholder: t('Device ID'),
      maxLength: 10,
      keyboardType: 'phone-pad',
    },
  ];

  const mutation = useMutation({
    mutationFn: data =>
      fetcher({method: 'POST', url: '/devices/addDevices', data}),
    onSuccess: () => {
      Alert.alert('Success', 'Device added successfully!');
      refetch();
      setInputModalVisible(false);
    },
    onError: error => {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to add device.',
      );
    },
  });

  const deleteDevice = useMutation({
    mutationFn: deviceId =>
      fetcher({method: 'PATCH', url: `devices/deleteDevice/${deviceId}`}),
    onSuccess: () => {
      Alert.alert('Success', 'Device removed successfully.');
      refetch();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to remove device.');
    },
  });

  const handleRemoveDevice = deviceId => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to remove this device?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteDevice.mutate(deviceId),
        },
      ],
      {cancelable: true},
    );
  };

  const handleSelectDevice = async deviceId => {
    setSelectedDeviceId(deviceId);
    console.log('dee', deviceId);
    try {
      await AsyncStorage.setItem('selectedDeviceId', deviceId);
    } catch (error) {
      console.error('Failed to save device ID:', error);
    }
  };

  return (
    <MainBackground noPadding style={{backgroundColor: theme.otpBox}}>
      <CustomHeader
        title="Add / Remove Device"
        backgroundColor={theme.background}
        backPress={() => navigation.goBack()}
      />
      {loading ? (
        <Loader />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.dashedContainer}>
              <Text style={styles.addDeviceText}>Add New Device</Text>
              <CustomButton
                width="100%"
                text="Add Device"
                onPress={() => setInputModalVisible(true)}
              />
            </View>
            <Spacing height={DimensionConstants.twenty} />
            <Text
              style={{
                fontSize: DimensionConstants.fourteen,
                fontWeight: '500',
              }}>
              {' '}
              Select Device
            </Text>
            {data?.devices
              ?.slice()
              .reverse()
              .map(item => (
                <TouchableOpacity
                  key={item?.deviceId}
                  activeOpacity={0.7}
                  onPress={() => handleSelectDevice(item?.deviceId)}>
                  <CustomCard
                    key={item?.deviceId}
                    style={[
                      styles.card,
                      selectedDeviceId === item?.deviceId &&
                        styles.selectedCard,
                    ]}>
                    {selectedDeviceId === item?.deviceId && (
                      <Text
                        style={{
                          color: theme.primary,
                          fontSize: DimensionConstants.fourteen,
                          fontWeight: '600',
                          textAlign: 'right',
                        }}>
                        Selected
                      </Text>
                    )}
                    <View style={styles.innerContainer}>
                      <Image source={ImageConstants.blackWatch} />
                      <Spacing height={DimensionConstants.thirty} />
                      <Text
                        style={[
                          styles.deviceName,
                          selectedDeviceId === item?.deviceId,
                        ]}>
                        SOS {item?.deviceName}
                      </Text>
                      <Text style={styles.macId}>MAC ID: {item?.deviceId}</Text>
                      <CustomButton
                        width="110%"
                        text="Remove Device"
                        onPress={e => {
                          e.stopPropagation();
                          handleRemoveDevice(item?._id);
                        }}
                      />
                    </View>
                  </CustomCard>
                </TouchableOpacity>
              ))}
          </View>
          <InputModal
            isVisible={inputModalVisible}
            onClose={() => setInputModalVisible(false)}
            control={control}
            fields={fields}
            errors={errors}
            onSubmit={handleSubmit(data => mutation.mutate(data))}
            theme={theme}
            t={t}
          />
        </ScrollView>
      )}
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
    marginTop: DimensionConstants.ten,
  },
  selectedCard: {
    backgroundColor: '#7fbaee', // Light blue background for selected
    borderWidth: 1,
    borderColor: '#599dd8',
  },
  selectedText: {
    fontWeight: '600',
    color: '#3B41AC', // Change text color for selected device
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
  addDeviceText: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '500',
  },
});

export default AddRemoveDeviceScreen;
