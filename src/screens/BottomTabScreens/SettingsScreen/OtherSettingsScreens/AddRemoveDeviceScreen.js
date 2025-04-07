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
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import {ImageConstants} from '../../../../constants/ImageConstants';
import {useQuery, useMutation} from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';
import InputModal from '../../../../components/InputModal';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';
import {validationSchema} from '../../../../utils/Validations';
import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
    queryKey: ['allDevice'],
    queryFn: () => fetcher({method: 'GET', url: 'devices/getDevices'}),
  });
  useEffect(() => {
    const getStoredDeviceId = async () => {
      try {
        const storedDeviceId = await AsyncStorage.getItem('selectedDeviceId');
        const storedMongoId = await AsyncStorage.getItem(
          'selectedDeviceMongoId',
        );
        if (storedDeviceId) setSelectedDeviceId(storedDeviceId);
        console.log('Stored Mongo _id:', storedMongoId);
      } catch (error) {
        console.error('Failed to retrieve stored device data:', error);
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
      fetcher({
        method: 'DELETE',
        url: `devices/deleteDevicePermanent/${deviceId}`,
      }),
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

  const handleSelectDevice = async (deviceId, mongoId) => {
    setSelectedDeviceId(deviceId);
    console.log('Selected Device ID:', deviceId);
    console.log('Selected Mongo _id:', mongoId);
    try {
      await AsyncStorage.setItem('selectedDeviceId', deviceId);
      await AsyncStorage.setItem('selectedDeviceMongoId', mongoId);
    } catch (error) {
      console.error('Failed to save device ID or Mongo ID:', error);
    }
  };

  return (
    <MainBackground noPadding style={{backgroundColor: theme.otpBox}}>
      <CustomHeader
        title="Add / Remove Device"
        backgroundColor={theme.background}
        backPress={() => navigation.goBack()}
        icon={
          <MaterialIcons
            name="add-circle-outline"
            size={26}
            marginRight={DimensionConstants.thirteen}
          />
        }
        onIconPress={() => setInputModalVisible(true)}
      />
      {loading ? (
        <Loader />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
          <Text
            style={{
              fontSize: DimensionConstants.fourteen,
              fontWeight: '500',
            }}>
            Select Device
          </Text>
          {data?.data?.results
            ?.slice()
            .reverse()
            .map(item => (
              <TouchableOpacity
                key={item?.deviceId}
                activeOpacity={0.7}
                onPress={() => handleSelectDevice(item?.deviceId, item?._id)}>
                <CustomCard
                  key={item?.deviceId}
                  style={[
                    styles.card,
                    selectedDeviceId === item?.deviceId && styles.card1,
                  ]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={ImageConstants.blackWatch}
                        style={styles.watchImage}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={{gap: DimensionConstants.five}}>
                      <Text
                        style={[
                          styles.deviceName,
                          selectedDeviceId === item?.deviceId &&
                            styles.selectedText,
                        ]}>
                        SOS: {item?.deviceName}
                      </Text>
                      <Text
                        style={[
                          styles.macId,
                          selectedDeviceId === item?.deviceId &&
                            styles.selectedMacId,
                        ]}>
                        MAC ID: {item?.deviceId}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={handleRemoveDevice}>
                    <MaterialIcons
                      name="delete"
                      size={28}
                      color={
                        selectedDeviceId === item?.deviceId ? 'white' : 'red'
                      }
                    />
                  </TouchableOpacity>
                </CustomCard>
              </TouchableOpacity>
            ))}

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
    paddingVertical: DimensionConstants.ten,
  },
  card: {
    borderRadius: DimensionConstants.twelve,
    marginTop: DimensionConstants.ten,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card1: {
    borderRadius: DimensionConstants.twelve,
    marginTop: DimensionConstants.ten,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#7fbaee',
    borderWidth: 1,
    borderColor: '#599dd8',
  },
  selectedCard: {
    backgroundColor: '#7fbaee', // Light blue background for selected
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
    fontWeight: '600',
    color: '#333333',
  },
  selectedText: {
    fontWeight: '700',
    color: '#FFFFFF', // White text for contrast on selected gradient
  },
  macId: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  selectedMacId: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    color: '#FFFFFF',
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
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 65, 172, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DimensionConstants.twelve,
  },
  watchImage: {
    width: 40,
    height: 40,
  },
});

export default AddRemoveDeviceScreen;
