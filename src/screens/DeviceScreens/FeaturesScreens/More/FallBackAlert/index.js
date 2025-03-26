import {View, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import InfoCard from '../../../../../components/InfoCard';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import Spacing from '../../../../../components/Spacing';
import fetcher from '../../../../../utils/ApiService';

const API_URL = 'deviceDataResponse/sendEvent/6907390711';
const FETCH_URL = 'deviceDataResponse/getEvent/FALLDOWN/6907390711';

const FallBackAlert = () => {
  const [switches, setSwitches] = useState({
    fallAlert: false,
    emergencyCall: false,
  });

  // Fetch Initial Status
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['fallAlertStatus'],
    queryFn: () => fetcher({method: 'GET', url: FETCH_URL}),
  });

  useEffect(() => {
    if (data?.data?.response) {
      setSwitches({
        fallAlert: data.data.response.alarm === '1',
        emergencyCall: data.data.response.call === '1',
      });
    }
  }, [data]);

  // Update Switch State via API
  const mutation = useMutation({
    mutationFn: async requestData => {
      return fetcher({
        method: 'POST',
        url: API_URL,
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

  // Handle Switch Toggle
  const handleToggle = key => {
    const newState = !switches[key];
    setSwitches(prev => ({...prev, [key]: newState}));

    // Define API Payloads
    const commandMap = {
      fallAlert: newState ? '[FALLDOWN,1,0]' : '[FALLDOWN,0,0]',
      emergencyCall: newState ? '[FALLDOWN,1,1]' : '[FALLDOWN,1,0]',
    };

    mutation.mutate(commandMap[key]);
  };

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Fall Alert'}
        backgroundColor={'#FFFFFF'}
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.twenty}}>
        {[
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
        ].map(({key, title, description}) => (
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

export default FallBackAlert;
