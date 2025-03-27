import {View, Text, Alert} from 'react-native';
import React from 'react';
import {useForm} from 'react-hook-form';
import MainBackground from '../../../../../components/MainBackground';
import CustomCard from '../../../../../components/CustomCard';
import CustomHeader from '../../../../../components/CustomHeader';
import SystemCallIcon from '../../../../../assets/icons/SystemCallIcon';
import CommonForm from '../../../../../utils/CommonForm';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import CustomButton from '../../../../../components/CustomButton';
import Spacing from '../../../../../components/Spacing';
import fetcher from '../../../../../utils/ApiService';
import {useMutation, useQuery} from '@tanstack/react-query';

const SEND_EVENT_URL = `/deviceDataResponse/sendEvent/6907390711`;

const AddContact = ({navigation}) => {
  const {data, refetch} = useQuery({
    queryKey: ['sosContacts'],
    queryFn: () =>
      fetcher({method: 'GET', url: `/getContactNumber/PHBX/6907390711`}),
  });
  co;
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      phoneNumberOne: '',
      phoneNumberTwo: '',
    },
  });

  // Function to convert a string to hex
  const stringToHex = str => {
    return str
      .split('')
      .map(char => char.charCodeAt(0).toString(16).padStart(4, '0'))
      .join('');
  };

  const mutation = useMutation({
    mutationFn: async formData => {
      const {phoneNumberOne, phoneNumberTwo} = formData;

      if (!phoneNumberOne || !phoneNumberTwo) {
        Alert.alert('Error', 'Both fields are required.');
        return;
      }

      // Convert Name to Hex
      const hexName = stringToHex(phoneNumberTwo);
      const formattedData = `[PHBX,1,${hexName},${phoneNumberOne}]`;

      return fetcher({
        method: 'POST',
        url: SEND_EVENT_URL,
        data: {data: formattedData},
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Contact added successfully');
      reset();
    },
    onError: error => {
      console.error('Error adding contact:', error);
      Alert.alert('Error', 'Failed to add contact.');
    },
  });

  const fields = [
    {
      name: 'phoneNumberOne',
      placeholder: 'Mobile number',
      keyboardType: 'phone-pad',
      maxLength: 10,
      icon: <SystemCallIcon />,
    },
    {
      name: 'phoneNumberTwo',
      placeholder: 'Name',
      maxLength: 20,
      icon: <SystemCallIcon />,
    },
  ];

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Add Contacts'}
        backgroundColor={'#FFFFFF'}
        backPress={() => navigation.goBack()}
      />
      <View
        style={{
          padding: DimensionConstants.sixteen,
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <CustomCard>
          <Spacing height={DimensionConstants.ten} />
          <CommonForm control={control} fields={fields} errors={errors} />
        </CustomCard>
        <CustomButton text={'Save'} onPress={handleSubmit(mutation.mutate)} />
      </View>
    </MainBackground>
  );
};

export default AddContact;
