import {View, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery, useMutation} from '@tanstack/react-query';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import InfoCard from '../../../../../components/InfoCard';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import Spacing from '../../../../../components/Spacing';
import fetcher from '../../../../../utils/ApiService';

const SmsAlertScreen = ({navigation}) => {
  const [deviceId, setDeviceId] = useState('');
  const [switches, setSwitches] = useState({
    fallAlert: false,
    emergencyCall: false,
  });

  useEffect(() => {
    const getStoredDeviceId = async () => {
      try {
        const storedDeviceId = await AsyncStorage.getItem('selectedDeviceId');
        if (storedDeviceId) {
          setDeviceId(storedDeviceId);
        }
      } catch (error) {
        console.error('Failed to retrieve stored device data:', error);
      }
    };
    getStoredDeviceId();
  }, []);
console.log()
  const {data, refetch} = useQuery({
    queryKey: ['fallAlertStatus', deviceId],
    queryFn: () =>
      deviceId
        ? fetcher({
            method: 'GET',
            url: `/deviceDataResponse/getEvent/SOSSMS/${deviceId}`,
          })
        : null,
    enabled: !!deviceId, // Prevents execution if deviceId is not set
  });

  const {data: lowBattery, refetch: lowBatteryRefetch} = useQuery({
    queryKey: ['lowBatteryStatus', deviceId],
    queryFn: () =>
      deviceId
        ? fetcher({
            method: 'GET',
            url: `/deviceDataResponse/getEvent/LOWBAT/${deviceId}`,
          })
        : null,
    enabled: !!deviceId,
  });

  useEffect(() => {
    if (data?.data?.response || lowBattery?.data?.response) {
      setSwitches({
        fallAlert: lowBattery?.data?.response?.lowBatteryAlarmSms === '1',
        emergencyCall: data?.data?.response?.sosSms === '1',
      });
    }
  }, [data, lowBattery]);

  const mutation = useMutation({
    mutationFn: async requestData => {
      return fetcher({
        method: 'POST',
        url: `deviceDataResponse/sendEvent/${deviceId}`,
        data: {data: requestData},
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Settings updated successfully');
      refetch();
      lowBatteryRefetch();
    },
    onError: error => {
      console.error('Error updating settings', error);
    },
  });

  const handleToggle = key => {
    const newState = !switches[key];
    setSwitches(prev => ({...prev, [key]: newState}));

    const commandMap = {
      fallAlert: newState ? '[LOWBAT,1]' : '[LOWBAT,0]',
      emergencyCall: newState ? '[SOSSMS,1]' : '[SOSSMS,0]',
    };

    mutation.mutate(commandMap[key]);
  };

  const info = [
    {
      key: 'fallAlert',
      title: 'Low battery Alert',
      description: `Notifies the user when the device's battery level is critically low`,
    },
    {
      key: 'emergencyCall',
      title: 'SOS Alert',
      description: 'Sends an emergency message when the SOS button is pressed.',
    },
  ];

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'SMS Alert'}
        backgroundColor={'#FFFFFF'}
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.twenty}}>
        {info.map(({key, title, description}) => (
          <React.Fragment key={key}>
            <InfoCard
              title={title}
              description={description}
              isEnabled={switches[key]}
              onToggle={() => handleToggle(key)}
              disabled={!deviceId} // Prevent toggling if no deviceId
            />
            <Spacing height={DimensionConstants.ten} />
          </React.Fragment>
        ))}
      </View>
    </MainBackground>
  );
};

export default SmsAlertScreen;
