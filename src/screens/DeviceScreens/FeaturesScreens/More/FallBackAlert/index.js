import {View, Alert} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import InfoCard from '../../../../../components/InfoCard';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import Spacing from '../../../../../components/Spacing';
import fetcher from '../../../../../utils/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../../../../components/Loader';
const FallBackAlert = ({navigation}) => {
  const [deviceId, setDeviceId] = useState('');

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

  useEffect(() => {
    getStoredDeviceId();
  }, []);

  const [switches, setSwitches] = useState({
    fallAlert: false,
    emergencyCall: false,
  });

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['fallAlertStatus'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getEvent/FALLDOWN/${deviceId}`,
      }),
  });

  useEffect(() => {
    if (data?.data?.response) {
      setSwitches({
        fallAlert: data.data.response.alarm === '1',
        emergencyCall: data.data.response.call === '1',
      });
    }
  }, [data]);

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
    },
    onError: error => {
      console.error('Error updating settings', error);
    },
  });

  // const handleToggle = key => {
  //   const newState = !switches[key];
  //   setSwitches(prev => ({...prev, [key]: newState}));

  //   const commandMap = {
  //     fallAlert: newState ? '[FALLDOWN,1,0]' : '[FALLDOWN,0,0]',
  //     emergencyCall: newState ? '[FALLDOWN,1,1]' : '[FALLDOWN,1,0]',
  //   };

  //   mutation.mutate(commandMap[key]);
  // };
  const handleToggle = key => {
    const newState = !switches[key];
    const otherState =
      switches[key === 'fallAlert' ? 'emergencyCall' : 'fallAlert'];

    const fallAlertValue =
      key === 'fallAlert' ? (newState ? '1' : '0') : otherState ? '1' : '0';
    const emergencyCallValue =
      key === 'emergencyCall'
        ? newState
          ? '1'
          : '0'
        : switches.emergencyCall
        ? '1'
        : '0';

    const command = `[FALLDOWN,${fallAlertValue},${emergencyCallValue}]`;

    setSwitches(prev => ({...prev, [key]: newState}));
    mutation.mutate(command);
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch, deviceId]),
  );
  const info = [
    {
      key: 'fallAlert',
      title: 'Fall Alert',
      description:
        'Notifies the app when a fall is detected for immediate assistance.',
    },
    {
      key: 'emergencyCall',
      title: 'Emergency Fall Call',
      description:
        'Automatically calls a registered contact in case of a detected fall.',
    },
  ];
  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Fall Alert'}
        backgroundColor={'#FFFFFF'}
        backPress={() => navigation.goBack()}
      />
      {isLoading ? (
        <Loader />
      ) : (
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
      )}
    </MainBackground>
  );
};

export default FallBackAlert;
