import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import CustomHeader from '../../../../../components/CustomHeader';
import MainBackground from '../../../../../components/MainBackground';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import {useMutation, useQuery} from '@tanstack/react-query';
import fetcher from '../../../../../utils/ApiService';
import InfoCard from '../../../../../components/InfoCard';
export default function RejectCallScreen({navigation}) {
  const [isEnabled, setIsEnabled] = useState(false);

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['unknownCall'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getEvent/DEVREFUSEPHONESWITCH/6907390711`,
      }),
  });
  console.log(data?.data?.response?.devRefusePhoneSwitch);
  useEffect(() => {
    if (data?.data?.response?.devRefusePhoneSwitch === '0') {
      setIsEnabled(false);
    } else {
      setIsEnabled(true);
    }
  }, [data]);

  const unknownCallMutation = useMutation({
    mutationFn: async requestData => {
      return fetcher({
        method: 'POST',
        url: 'deviceDataResponse/sendEvent/6907390711',
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
          />
          <Text
            style={[
              styles.FindDeviceCardTxt1,
              {padding: DimensionConstants.fifteen},
            ]}>{`• Only registered contacts can call \n• If there is unknown call, message will be sent to the app for parents to know`}</Text>
        </View>
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
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  FindDeviceCardTxt1: {
    fontSize: DimensionConstants.twelve,
    fontWeight: '500',
    color: '#889CA3',
  },
});
