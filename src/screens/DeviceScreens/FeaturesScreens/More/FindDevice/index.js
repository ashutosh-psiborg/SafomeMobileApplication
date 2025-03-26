import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FindDeviceIcon from '../../../../../assets/icons/FindDeviceIcon';
import CustomCard from '../../../../../components/CustomCard';
import CustomHeader from '../../../../../components/CustomHeader';
import MainBackground from '../../../../../components/MainBackground';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import CustomButton from '../../../../../components/CustomButton';
import {useMutation, useQuery} from '@tanstack/react-query';
import fetcher from '../../../../../utils/ApiService';
export default function FindDevice({navigation}) {
  const findMutation = useMutation({
    mutationFn: async requestData => {
      return fetcher({
        method: 'POST',
        url: 'deviceDataResponse/sendEvent/6907390711',
        data: {data: '[FIND]'},
      });
    },
    onSuccess: () => {
      console.log('Device found');
    },
    onError: error => {
      console.error('request failed', error);
    },
  });

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title={'Find Device'}
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
          <CustomCard style={styles.FindDeviceCard}>
            <FindDeviceIcon />
            <View>
              <Text style={styles.FindDeviceCardTxt}>Find Device</Text>
              <Text style={styles.FindDeviceCardTxt1}>
                Locate your device with sound
              </Text>
            </View>
          </CustomCard>
          <Text
            style={[
              styles.FindDeviceCardTxt1,
              {padding: DimensionConstants.fifteen},
            ]}>{`• Press "Find device" to activate sound on device \n• Device will play a sound`}</Text>
        </View>
        <CustomButton text="Play Sound" onPress={() => findMutation.mutate()} />
      </View>
    </MainBackground>
  );
}

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  FindDeviceCard: {
    display: 'flex',
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
});
