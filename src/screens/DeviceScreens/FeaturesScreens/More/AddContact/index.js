import {View, Text, Alert, Image} from 'react-native';
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
import {ImageConstants} from '../../../../../constants/ImageConstants';

const SEND_EVENT_URL = `/deviceDataResponse/sendEvent/6907390711`;

const AddContact = ({navigation}) => {
  const {data, refetch} = useQuery({
    queryKey: ['sosContacts'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getContactNumber/PHBX/6907390711`,
      }),
  });

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

  const getNextIndex = existingIndexes => {
    if (!existingIndexes || existingIndexes.length === 0) return 1;

    // Sort indexes in ascending order
    const sortedIndexes = existingIndexes.sort((a, b) => a - b);

    // Find the first missing index
    for (let i = 1; i <= sortedIndexes.length; i++) {
      if (!sortedIndexes.includes(i)) {
        return i; // Return the missing index
      }
    }
    return sortedIndexes.length + 1; // If no missing index, return next in sequence
  };

  const mutation = useMutation({
    mutationFn: async formData => {
      const {phoneNumberOne, phoneNumberTwo} = formData;

      if (!phoneNumberOne || !phoneNumberTwo) {
        Alert.alert('Error', 'Both fields are required.');
        return;
      }

      // Get all indexes from existing contacts
      const existingIndexes =
        data?.data?.map(contact => parseInt(contact.response?.index, 10)) || [];

      // Find the next available index
      const nextIndex = getNextIndex(existingIndexes);

      // Convert Name to Hex
      const hexName = stringToHex(phoneNumberTwo);
      const formattedData = `[PHBX,${nextIndex},${hexName},${phoneNumberOne}]`;

      return fetcher({
        method: 'POST',
        url: SEND_EVENT_URL,
        data: {data: formattedData},
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Contact added successfully');
      reset();
      refetch(); // Refresh contact list after saving
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
        <View>
          <CustomCard>
            <Spacing height={DimensionConstants.ten} />
            <CommonForm control={control} fields={fields} errors={errors} />
            <CustomButton
              text={'Add'}
              onPress={handleSubmit(mutation.mutate)}
            />
          </CustomCard>

          <Text
            style={{
              marginVertical: DimensionConstants.ten,
              fontSize: DimensionConstants.fourteen,
              fontWeight: '500',
            }}>
            Contacts
          </Text>

          {data?.data?.length > 0 ? (
            data.data.map((contact, index) => (
              <View>
                <CustomCard key={index}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={ImageConstants.avatar}
                      style={{
                        width: DimensionConstants.fifty,
                        height: DimensionConstants.fifty,
                      }}
                    />
                    <View style={{marginLeft: DimensionConstants.ten}}>
                      <Text>{contact.response?.name || 'None'}</Text>
                      <Text>{contact.response?.contactNumber || 'None'}</Text>
                    </View>
                  </View>
                </CustomCard>
                <Spacing height={DimensionConstants.ten} />
              </View>
            ))
          ) : (
            <Text>No saved contacts.</Text>
          )}
        </View>
      </View>
    </MainBackground>
  );
};

export default AddContact;
