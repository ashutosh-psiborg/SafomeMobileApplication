import {View, Alert, Text} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../../../../components/Loader';

const AddSosContact = ({navigation}) => {
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

  const {data, refetch, isLoading} = useQuery({
    queryKey: ['sosContacts', deviceId],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getContactNumber/PHBX/${deviceId}`,
      }),
    enabled: !!deviceId, // Prevent query execution until deviceId is available
  });

  const {
    data: sos,
    refetch: sosRefetch,
    isLoading: isContactLoading,
  } = useQuery({
    queryKey: ['contacts', deviceId],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getEvent/SOS/${deviceId}`,
      }),
    enabled: !!deviceId, // Prevent query execution until deviceId is available
  });

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
      reset({
        phoneNumberOne: sosData.sosNumber1 || '',
        phoneNumberTwo: sosData.sosNumber2 || '',
        phoneNumberThree: sosData.sosNumber3 || '',
      });
    }
  }, [sos, reset]);

  const mutation = useMutation({
    mutationFn: async requestData => {
      return fetcher({
        method: 'POST',
        url: `deviceDataResponse/sendEvent/${deviceId}`,
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

  useFocusEffect(
    useCallback(() => {
      if (deviceId) {
        refetch();
        sosRefetch();
      }
    }, [deviceId, refetch, sosRefetch]),
  );

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
      {isLoading || isContactLoading ? (
        <Loader />
      ) : (
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
              Add up to three SOS emergency contacts. In case of an emergency,
              the device will notify these contacts automatically. Ensure that
              the phone numbers are valid and reachable.
            </Text>
            <Spacing height={DimensionConstants.sixteen} />
            <CommonForm control={control} fields={fields} errors={errors} />
          </View>
          <CustomButton
            text={'Save'}
            onPress={handleSubmit(onSubmit)}
            disabled={!deviceId} // Disable button if no deviceId
          />
        </View>
      )}
    </MainBackground>
  );
};

export default AddSosContact;
