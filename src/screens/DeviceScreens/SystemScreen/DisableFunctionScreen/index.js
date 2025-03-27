import {View, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import RadioButtonCard from '../../../../components/RadioButtonCard';
import Spacing from '../../../../components/Spacing';
import CustomButton from '../../../../components/CustomButton';
import fetcher from '../../../../utils/ApiService';

const DEVICE_ID = '6907390711';
const GET_EVENT_URL = `/deviceDataResponse/getEvent/profile/${DEVICE_ID}`;
const SEND_EVENT_URL = `/deviceDataResponse/sendEvent/${DEVICE_ID}`;

const options = [
  {label: 'Vibration and ringing', value: 1},
  {label: 'Ringing', value: 2},
  {label: 'Vibration', value: 3},
  {label: 'Silence', value: 4, line: 'no'},
];

const DisableFunctionScreen = ({navigation}) => {
  const [selected, setSelected] = useState(0);

  const {data, refetch} = useQuery({
    queryKey: ['deviceAlertMode'],
    queryFn: () => fetcher({method: 'GET', url: GET_EVENT_URL}),
  });

  useEffect(() => {
    if (data?.data?.response?.profile) {
      const mode = Number(data.data.response.profile);
      const index = options.findIndex(option => option.value === mode);
      if (index !== -1) {
        setSelected(index);
      }
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async selectedValue => {
      return fetcher({
        method: 'POST',
        url: SEND_EVENT_URL,
        data: {data: `[profile,${selectedValue}]`}, // Send the correct value
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Alert mode updated successfully');
      refetch();
    },
    onError: error => {
      console.error('Error updating alert mode:', error);
      Alert.alert('Error', 'Failed to update alert mode');
    },
  });

  const handleSave = () => {
    const selectedOption = options[selected];
    if (!selectedOption) {
      Alert.alert('Error', 'Please select an alert mode.');
      return;
    }
    mutation.mutate(selectedOption.value); // Send `value`, not `index`
  };

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Device Alert Mode'}
        backgroundColor={'#ffffff'}
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.sixteen}}>
        <RadioButtonCard
          data={options}
          onSelect={setSelected}
          selected={selected} // Store index, not value
        />
        <Spacing height={DimensionConstants.twenty} />
        <CustomButton text="Save" onPress={handleSave} />
      </View>
    </MainBackground>
  );
};

export default DisableFunctionScreen;
