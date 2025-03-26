import {View, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import InfoCard from '../../../../../components/InfoCard';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import Spacing from '../../../../../components/Spacing';
import fetcher from '../../../../../utils/ApiService';

const SmsAlertScreen = () => {
  const [switches, setSwitches] = useState({
    fallAlert: false,
    emergencyCall: false,
  });

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['fallAlertStatus'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: '/deviceDataResponse/getEvent/SOSSMS/6907390711',
      }),
  });
  const {
    data: lowBattery,
    isLoading: lowBatteryloading,
    error: lowBatteryError,
    refetch: lowBatteryRefetch,
  } = useQuery({
    queryKey: ['lowBatteryStatus'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: '/deviceDataResponse/getEvent/LOWBAT/6907390711',
      }),
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
        url: 'deviceDataResponse/sendEvent/6907390711',
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
        {info?.map(({key, title, description}) => (
          <React.Fragment key={key}>
            <InfoCard
              title={title}
              description={description}
              isEnabled={switches[key]}
              onToggle={() => handleToggle(key)}
            />
            <Spacing height={DimensionConstants.ten} />
          </React.Fragment>
        ))}
      </View>
    </MainBackground>
  );
};

export default SmsAlertScreen;
