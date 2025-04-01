import {View, Text, TextInput, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import CustomButton from '../../../../../components/CustomButton';
import fetcher from '../../../../../utils/ApiService';
import {useMutation} from '@tanstack/react-query';

const SoundGuardian = ({navigation}) => {
  const [deviceId, setDeviceId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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

  const sendCallRequest = type => {
    if (!deviceId) {
      Alert.alert('Error', 'No device selected.');
      return;
    }
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number.');
      return;
    }

    const formattedData = `[${type},${phoneNumber}]`;
    callGuardianMutation.mutate(formattedData);
  };

  const callGuardianMutation = useMutation({
    mutationFn: async formattedData => {
      if (!deviceId) {
        Alert.alert('Error', 'Device ID not found.');
        return;
      }
      return fetcher({
        method: 'POST',
        url: `/deviceDataResponse/sendEvent/${deviceId}`,
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
            editable={!!deviceId} // Disable input if no device selected
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
            disabled={!deviceId} // Disable button if no device selected
          />
          <CustomButton
            text={'Call'}
            borderColor={'#FF310C'}
            color={'#fff'}
            textColor={'#FF310C'}
            onPress={() => sendCallRequest('CALL')}
            style={{marginTop: 10}}
            disabled={!deviceId} // Disable button if no device selected
          />
        </View>
      </View>
    </MainBackground>
  );
};

export default SoundGuardian;
