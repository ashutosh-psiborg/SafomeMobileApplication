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

const AddRemoveDeviceScreen = ({navigation}) => {
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const {t} = useTranslation();
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  /** ✅ Fetch UID */
  const {data: uidData} = useQuery({
    queryKey: ['deviceUid'],
    queryFn: () => fetcher({method: 'GET', url: 'devices/getUid'}),
  });

  /** ✅ Fetch device details */
  const {data, loading, refetch} = useQuery({
    queryKey: ['deviceDetails'],
    queryFn: () => fetcher({method: 'GET', url: 'devices/getDevices'}),
  });

  // Set the first device as selected when data is loaded
  useEffect(() => {
    if (data?.devices && data.devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(data.devices[data.devices.length - 1]?._id);
    }
  }, [data, selectedDeviceId]);

  /** ✅ Form setup */
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

  /** ✅ Reset UID when available */
  useEffect(() => {
    if (uidData?.data?.uid) {
      reset({uid: uidData.data.uid});
    }
  }, [uidData, reset]);

  /** ✅ Form fields */
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

  /** ✅ Add Device Mutation */
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

  /** ✅ Remove Device Mutation */
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

  /** ✅ Handle device removal */
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

  // Handle device selection
  const handleSelectDevice = deviceId => {
    setSelectedDeviceId(deviceId);
    // No API call needed as requested
  };

  return (
    <MainBackground noPadding style={{backgroundColor: theme.otpBox}}>
      {/* ✅ Pass function reference instead of executing navigation.goBack() */}
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
            {/* ✅ Add Device Section */}
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
            {/* ✅ Display Devices */}
            {data?.devices
              ?.slice()
              .reverse()
              .map(item => (
                <TouchableOpacity
                  key={item?._id}
                  activeOpacity={0.7}
                  onPress={() => handleSelectDevice(item?._id)}>
                  <CustomCard
                    key={item?._id}
                    style={[
                      styles.card,
                      selectedDeviceId === item?._id && styles.selectedCard,
                    ]}>
                    <View style={styles.innerContainer}>
                      <Image source={ImageConstants.blackWatch} />
                      <Spacing height={DimensionConstants.thirty} />
                      <Text
                        style={[
                          styles.deviceName,
                          selectedDeviceId === item?._id,
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

          {/* ✅ Input Modal */}
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

/** ✅ Styles Optimized */
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
