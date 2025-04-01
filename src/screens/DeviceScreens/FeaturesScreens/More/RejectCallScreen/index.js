import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../../../../components/CustomHeader';
import MainBackground from '../../../../../components/MainBackground';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import {useMutation, useQuery} from '@tanstack/react-query';
import fetcher from '../../../../../utils/ApiService';
import InfoCard from '../../../../../components/InfoCard';

export default function RejectCallScreen({navigation}) {
  const [deviceId, setDeviceId] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

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

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['unknownCall', deviceId], // Re-fetch when deviceId changes
    queryFn: () => {
      if (!deviceId) return;
      return fetcher({
        method: 'GET',
        url: `deviceDataResponse/getEvent/DEVREFUSEPHONESWITCH/${deviceId}`,
      });
    },
    enabled: !!deviceId, // Only fetch if deviceId is available
  });

  useEffect(() => {
    if (data?.data?.response?.devRefusePhoneSwitch === '0') {
      setIsEnabled(false);
    } else {
      setIsEnabled(true);
    }
  }, [data]);

  const unknownCallMutation = useMutation({
    mutationFn: async requestData => {
      if (!deviceId) {
        Alert.alert('Error', 'Device ID not found.');
        return;
      }
      return fetcher({
        method: 'POST',
        url: `deviceDataResponse/sendEvent/${deviceId}`,
        data: {data: requestData},
      });
    },
    onSuccess: () => {
      console.log('Unknown call rejection setting updated');
      Alert.alert(
        isEnabled
          ? 'Reject unknown calls Enabled'
          : 'Reject unknown calls Disabled',
        isEnabled
          ? 'Your device will automatically reject calls from unknown numbers.'
          : 'Your device will now allow calls from unknown numbers.',
      );
      refetch();
    },
  });

  const toggleSwitch = () => {
    if (!deviceId) {
      Alert.alert('Error', 'No device selected.');
      return;
    }

    const newState = !isEnabled;
    setIsEnabled(newState);

    const requestData = newState
      ? '[DEVREFUSEPHONESWITCH,1]'
      : '[DEVREFUSEPHONESWITCH,0]';

    unknownCallMutation.mutate(requestData);
  };

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title={'Reject unknown calls'}
        backgroundColor={'#FFFFFF'}
        backPress={() => navigation.goBack()}
      />
      <View
        style={{
          padding: DimensionConstants.fifteen,
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View>
          <InfoCard
            title={'Reject unknown calls'}
            description={'Automatically rejects unknown calls'}
            isEnabled={isEnabled}
            onToggle={toggleSwitch}
            disabled={!deviceId} // Disable toggle if no deviceId
          />
          <Text
            style={[
              styles.FindDeviceCardTxt1,
              {padding: DimensionConstants.fifteen},
            ]}>
            {'\u2022'} Only registered contacts can call {'\n'}
            {'\u2022'} If there is an unknown call, a message will be sent to
            the app for parents to know
          </Text>
        </View>
      </View>
    </MainBackground>
  );
}

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  FindDeviceCardTxt1: {
    fontSize: DimensionConstants.twelve,
    fontWeight: '500',
    color: '#889CA3',
  },
});
