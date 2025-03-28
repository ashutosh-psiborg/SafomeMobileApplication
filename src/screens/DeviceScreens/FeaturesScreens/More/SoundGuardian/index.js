import {View, Text, TextInput, Alert} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import CustomButton from '../../../../../components/CustomButton';
import fetcher from '../../../../../utils/ApiService';
import {useMutation} from '@tanstack/react-query';

const SEND_EVENT_URL = `/deviceDataResponse/sendEvent/6907390711`;

const SoundGuardian = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const sendCallRequest = type => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number.');
      return;
    }

    const formattedData = `[${type},${phoneNumber}]`;
    callGuardianMutation.mutate(formattedData);
  };

  const callGuardianMutation = useMutation({
    mutationFn: async formattedData => {
      return fetcher({
        method: 'POST',
        url: SEND_EVENT_URL,
        data: {data: formattedData},
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Request sent successfully');
      setPhoneNumber('');
    },
    onError: error => {
      console.error('Error sending request:', error);
      Alert.alert('Error', 'Failed to send request.');
    },
  });

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Call & Monitoring'}
        backgroundColor={'#FFFFFF'}
        backPress={() => navigation.goBack()}
      />
      <View
        style={{
          padding: DimensionConstants.sixteen,
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View>
          <TextInput
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 15,
              borderRadius: 8,
              marginBottom: 16,
            }}
          />

          <View>
            <Text>
              {'\u2022'} Enter the phone number you want to monitor or call.
            </Text>
            <Text>
              {'\u2022'} "Monitor" allows silent listening, while "Call"
              initiates a direct call.
            </Text>
          </View>
        </View>
        <View>
          <CustomButton
            text={'Monitor'}
            onPress={() => sendCallRequest('MONITOR')}
          />
          <CustomButton
            text={'Call'}
            borderColor={'#FF310C'}
            color={'#fff'}
            textColor={'#FF310C'}
            onPress={() => sendCallRequest('CALL')}
            style={{marginTop: 10}}
          />
        </View>
      </View>
    </MainBackground>
  );
};

export default SoundGuardian;
