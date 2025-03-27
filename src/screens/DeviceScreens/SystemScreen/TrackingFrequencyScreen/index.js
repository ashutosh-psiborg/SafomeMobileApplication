import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import Spacing from '../../../../components/Spacing';
import CustomButton from '../../../../components/CustomButton';
import RadioButtonCard from '../../../../components/RadioButtonCard';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import fetcher from '../../../../utils/ApiService';
import {useMutation, useQuery} from '@tanstack/react-query';

const DEVICE_ID = '6907390711';
const GET_EVENT_URL = `/deviceDataResponse/getEvent/UPLOAD/${DEVICE_ID}`;
const SEND_EVENT_URL = `/deviceDataResponse/sendEvent/${DEVICE_ID}`;

const trackingOptions = [
  {label: 'Update every 5 minutes', value: 300},
  {label: 'Update every 10 minutes', value: 600},
  {label: 'Update every 30 minutes', value: 1800},
  {label: 'Update every hour', value: 3600, line: 'no'},
];

const TrackingFrequencyScreen = ({navigation}) => {
  const [selected, setSelected] = useState(0);

  const {data, refetch} = useQuery({
    queryKey: ['trackingFrequency'],
    queryFn: () => fetcher({method: 'GET', url: GET_EVENT_URL}),
  });

  useEffect(() => {
    if (data?.data?.response?.uploadTimeInterval) {
      const interval = Number(data.data.response.uploadTimeInterval);
      const index = trackingOptions.findIndex(
        option => option.value === interval,
      );
      if (index !== -1) {
        setSelected(index);
      }
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async seconds => {
      return fetcher({
        method: 'POST',
        url: SEND_EVENT_URL,
        data: {data: `[UPLOAD,${seconds}]`},
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Tracking frequency updated successfully');
      refetch();
    },
    onError: error => {
      console.error('Error updating tracking frequency:', error);
      Alert.alert('Error', 'Failed to update tracking frequency');
    },
  });

  const handleSave = () => {
    const selectedOption = trackingOptions[selected];
    if (!selectedOption) {
      Alert.alert('Error', 'Please select a tracking frequency.');
      return;
    }
    mutation.mutate(selectedOption.value);
  };

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title="Tracking Frequency"
        backgroundColor="#ffffff"
        backPress={() => navigation.goBack()}
      />
      <Spacing height={DimensionConstants.ten} />
      <View style={styles.container}>
        <RadioButtonCard
          data={trackingOptions}
          onSelect={setSelected}
          selected={selected}
        />
        <CustomButton text="Save" onPress={handleSave} />
      </View>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    padding: DimensionConstants.fifteen,
    justifyContent: 'space-between',
    flex: 1,
  },
});

export default TrackingFrequencyScreen;
