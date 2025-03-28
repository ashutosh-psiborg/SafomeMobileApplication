import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
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
import DeleteIcon from '../../../../../assets/icons/DeleteIcon';

const SEND_EVENT_URL = `/deviceDataResponse/sendEvent/6907390711`;

const AddContact = ({navigation}) => {
  const {data, refetch, isLoading} = useQuery({
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

  const stringToHex = str =>
    str
      .split('')
      .map(char => char.charCodeAt(0).toString(16).padStart(4, '0'))
      .join('');

  const getNextIndex = existingIndexes => {
    if (!existingIndexes || existingIndexes.length === 0) return 1;

    const sortedIndexes = existingIndexes.sort((a, b) => a - b);
    for (let i = 1; i <= sortedIndexes.length; i++) {
      if (!sortedIndexes.includes(i)) {
        return i;
      }
    }
    return sortedIndexes.length + 1;
  };

  const addContactMutation = useMutation({
    mutationFn: async formData => {
      const {phoneNumberOne, phoneNumberTwo} = formData;

      if (!phoneNumberOne || !phoneNumberTwo) {
        Alert.alert('Error', 'Both fields are required.');
        return;
      }

      const existingIndexes =
        data?.data?.map(contact => parseInt(contact.response?.index, 10)) || [];
      const nextIndex = getNextIndex(existingIndexes);
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
      refetch();
    },
    onError: error => {
      console.error('Error adding contact:', error);
      Alert.alert('Error', 'Failed to add contact.');
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async index => {
      const formattedData = `[DPHBX,${index}]`;

      return fetcher({
        method: 'POST',
        url: SEND_EVENT_URL,
        data: {data: formattedData},
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Contact deleted successfully');
      refetch();
    },
    onError: error => {
      console.error('Error deleting contact:', error);
      Alert.alert('Error', 'Failed to delete contact.');
    },
  });

  const handleDeleteContact = index => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => deleteContactMutation.mutate(index)},
      ],
    );
  };

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

      <View style={{padding: DimensionConstants.sixteen, flex: 1}}>
        <CustomCard>
          <Spacing height={DimensionConstants.ten} />
          <CommonForm control={control} fields={fields} errors={errors} />
          <CustomButton
            text={'Add'}
            onPress={handleSubmit(addContactMutation.mutate)}
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

        {isLoading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data?.data || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View>
                <CustomCard>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={ImageConstants.avatar}
                        style={{
                          width: DimensionConstants.fifty,
                          height: DimensionConstants.fifty,
                        }}
                      />
                      <View style={{marginLeft: DimensionConstants.ten}}>
                        <Text>{item.response?.name || 'None'}</Text>
                        <Text>{item.response?.contactNumber || 'None'}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteContact(item.response?.index)}>
                      <DeleteIcon />
                    </TouchableOpacity>
                  </View>
                </CustomCard>
                <Spacing height={DimensionConstants.ten} />
              </View>
            )}
            ListEmptyComponent={<Text>No saved contacts.</Text>}
          />
        )}
      </View>
    </MainBackground>
  );
};

export default AddContact;
