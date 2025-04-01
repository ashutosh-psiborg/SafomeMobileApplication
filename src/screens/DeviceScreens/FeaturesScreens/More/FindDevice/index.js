import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FindDeviceIcon from '../../../../../assets/icons/FindDeviceIcon';
import CustomCard from '../../../../../components/CustomCard';
import CustomHeader from '../../../../../components/CustomHeader';
import MainBackground from '../../../../../components/MainBackground';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import CustomButton from '../../../../../components/CustomButton';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../../../../utils/ApiService';

export default function FindDevice({navigation}) {
  const [deviceId, setDeviceId] = useState('');

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
  const findMutation = useMutation({
    mutationFn: async () => {
      return fetcher({
        method: 'POST',
        url: `deviceDataResponse/sendEvent/${deviceId}`,
        data: {data: '[FIND]'},
      });
    },
    onSuccess: () => {
      console.log('Device found');
    },
    onError: error => {
      console.error('Request failed', error);
    },
  });

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title={'Find Device'}
        backgroundColor={'#FFFFFF'}
        backPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View>
          <CustomCard style={styles.FindDeviceCard}>
            <FindDeviceIcon />
            <View>
              <Text style={styles.FindDeviceCardTxt}>Find Device</Text>
              <Text style={styles.FindDeviceCardTxt1}>
                Locate your device with sound
              </Text>
            </View>
          </CustomCard>
          <Text style={styles.instructions}>
            {`• Press "Find device" to activate sound on device \n• Device will play a sound`}
          </Text>
        </View>
        <CustomButton
          text="Play Sound"
          onPress={() => findMutation.mutate()}
          disabled={!deviceId}
        />
      </View>
    </MainBackground>
  );
}

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    padding: DimensionConstants.fifteen,
    justifyContent: 'space-between',
    flex: 1,
  },
  FindDeviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DimensionConstants.nineteen,
  },
  FindDeviceCardTxt: {
    fontSize: DimensionConstants.twelve,
    fontWeight: '500',
  },
  FindDeviceCardTxt1: {
    fontSize: DimensionConstants.twelve,
    fontWeight: '500',
    color: '#889CA3',
  },
  instructions: {
    padding: DimensionConstants.fifteen,
    fontSize: DimensionConstants.twelve,
    fontWeight: '500',
    color: '#889CA3',
  },
});
