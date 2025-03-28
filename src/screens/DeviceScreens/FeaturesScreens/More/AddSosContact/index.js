import {View, Alert, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import CommonForm from '../../../../../utils/CommonForm';
import CustomButton from '../../../../../components/CustomButton';
import SystemCallIcon from '../../../../../assets/icons/SystemCallIcon';
import fetcher from '../../../../../utils/ApiService';
import {useForm} from 'react-hook-form';
import CustomCard from '../../../../../components/CustomCard';
import Spacing from '../../../../../components/Spacing';

const DEVICE_ID = '6907390711';
const GET_EVENT_URL = `deviceDataResponse/getEvent/SOS/${DEVICE_ID}`;
const SEND_EVENT_URL = `deviceDataResponse/sendEvent/${DEVICE_ID}`;

const AddSosContact = ({navigation}) => {
  const {data, refetch} = useQuery({
    queryKey: ['sosContacts'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getContactNumber/PHBX/${DEVICE_ID}`,
      }),
  });
  const {data: sos, refetch: sosRefetch} = useQuery({
    queryKey: ['contacts'],
    queryFn: () => fetcher({method: 'GET', url: GET_EVENT_URL}),
  });
  console.log('-------*****88', sos?.data?.response);
  const contactOptions =
    data?.data?.map(contact => ({
      label: `${contact.response.name} (${contact.response.contactNumber})`,
      value: contact.response.contactNumber,
    })) || [];

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      phoneNumberOne: '',
      phoneNumberTwo: '',
      phoneNumberThree: '',
    },
  });

  useEffect(() => {
    if (sos?.data?.response) {
      const sosData = sos.data.response;
      console.log('ggggg====', sosData);
      reset({
        phoneNumberOne: sosData.sosNumber1 || '',
        phoneNumberTwo: sosData.sosNumber2 || '',
        phoneNumberThree: sosData.sosNumber3 || '',
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: async requestData => {
      return fetcher({
        method: 'POST',
        url: SEND_EVENT_URL,
        data: {data: requestData},
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'SOS contacts updated successfully', [
        {text: 'OK'},
      ]);
      refetch();
      sosRefetch();
    },
    onError: error => {
      console.error('Error updating SOS contacts:', error);
      Alert.alert('Error', 'Failed to update SOS contacts');
    },
  });

  const onSubmit = formData => {
    const newNumbers = [
      formData.phoneNumberOne,
      formData.phoneNumberTwo,
      formData.phoneNumberThree,
    ].filter(Boolean);
    mutation.mutate(`[SOS,${newNumbers.join(',')}]`);
  };

  const fields = [
    {
      name: 'phoneNumberOne',
      placeholder: 'SOS Contact Number 1',
      type: 'dropdown',
      options: contactOptions,
      icon: <SystemCallIcon />,
    },
    {
      name: 'phoneNumberTwo',
      placeholder: 'SOS Contact Number 2',
      type: 'dropdown',
      options: contactOptions,
      icon: <SystemCallIcon />,
    },
    {
      name: 'phoneNumberThree',
      placeholder: 'SOS Contact Number 3',
      type: 'dropdown',
      options: contactOptions,
      icon: <SystemCallIcon />,
    },
  ];

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Add SOS Contact'}
        backPress={() => navigation.goBack()}
        backgroundColor={'#fff'}
      />
      <View
        style={{
          padding: DimensionConstants.sixteen,
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <View>
          <Text
            style={{
              color: '#333',
              fontSize: DimensionConstants.twelve,
            }}>
            Add up to three SOS emergency contacts. In case of an emergency, the
            device will notify these contacts automatically. Ensure that the
            phone numbers are valid and reachable.
          </Text>
          <Spacing height={DimensionConstants.sixteen} />
          <CommonForm control={control} fields={fields} errors={errors} />
        </View>
        <CustomButton text={'Save'} onPress={handleSubmit(onSubmit)} />
      </View>
    </MainBackground>
  );
};

export default AddSosContact;
