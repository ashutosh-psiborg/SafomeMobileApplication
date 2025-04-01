import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useMutation, useQuery} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetcher from '../../../../utils/ApiService';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import InfoCard from '../../../../components/InfoCard';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import Spacing from '../../../../components/Spacing';
import Loader from '../../../../components/Loader';

const AutoCallScreen = ({navigation}) => {
  const {appStrings} = useSelector(state => state.language);
  const [isEnabled, setIsEnabled] = useState(false);
  const [contactNumbers, setContactNumbers] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [deviceId, setDeviceId] = useState('');

  // Fetch Device ID from AsyncStorage
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

  useEffect(() => {
    getStoredDeviceId();
  }, []);

  // Fetch AutoCall Data
  const {data, refetch, isLoading} = useQuery({
    queryKey: ['autoCall', deviceId],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getEvent/ACALL/${deviceId}`,
      }),
    enabled: !!deviceId, // Only fetch if deviceId is available
  });

  // Fetch Contact Numbers
  const {
    data: contactData,
    isLoading: contactIsLoading,
    refetch: refetchContacts,
  } = useQuery({
    queryKey: ['contactNumbers', deviceId],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getContactNumber/PHBX/${deviceId}`,
      }),
    enabled: !!deviceId,
  });

  // Refetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchContacts();
    }, [deviceId]),
  );

  // Update state when new data is available
  useEffect(() => {
    if (data?.data?.response?.acOff === 0) {
      setIsEnabled(false);
    } else {
      setIsEnabled(true);
    }
  }, [data]);

  useEffect(() => {
    if (contactData?.data) {
      const numbers = contactData.data.map(contact => ({
        name: contact.response.name,
        contactNumber: contact.response.contactNumber,
      }));
      setContactNumbers(numbers);
    }
  }, [contactData]);

  // Auto Call Mutation
  const autoCallMutation = useMutation({
    mutationFn: async requestData => {
      return fetcher({
        method: 'POST',
        url: `deviceDataResponse/sendEvent/${deviceId}`,
        data: {data: requestData},
      });
    },
    onSuccess: () => {
      console.log('Auto call request successful');
      refetch();
    },
    onError: error => {
      console.error('Auto call request failed', error);
    },
  });

  // Toggle contact selection
  const toggleContactSelection = contactNumber => {
    setSelectedContacts(prevSelected =>
      prevSelected.includes(contactNumber)
        ? prevSelected.filter(num => num !== contactNumber)
        : [...prevSelected, contactNumber],
    );
  };

  // Toggle Auto Call Switch
  const toggleSwitch = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);

    const requestData = newState
      ? `[ACALL,${selectedContacts.join(',')}]`
      : '[ACALL,0]';

    autoCallMutation.mutate(requestData);
  };

  return (
    <MainBackground noPadding style={styles.container}>
      <CustomHeader
        title={appStrings?.system?.autoCallAnswer?.text}
        backgroundColor={'#fff'}
        backPress={() => navigation.goBack()}
      />
      {contactIsLoading || isLoading ? (
        <Loader />
      ) : (
        <View style={styles.content}>
          <InfoCard
            title={appStrings?.system?.autoCallAnswer?.text}
            description={appStrings?.system?.autoCallDescription?.text}
            isEnabled={isEnabled}
            onToggle={toggleSwitch}
          />
          <Spacing height={DimensionConstants.ten} />
          <Text style={styles.label}>Select Contacts for Auto Call:</Text>
          <FlatList
            data={contactNumbers}
            keyExtractor={item => item.contactNumber}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.contactCard,
                  selectedContacts.includes(item?.contactNumber) &&
                    styles.selectedCard,
                ]}
                onPress={() => toggleContactSelection(item?.contactNumber)}>
                <Text style={styles.contactName}>{item?.name}</Text>
                <Text style={styles.contactNumber}>{item?.contactNumber}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </MainBackground>
  );
};

export default AutoCallScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F7FC',
  },
  content: {
    padding: DimensionConstants.sixteen,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  contactCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    borderColor: 'grey',
    borderWidth: 1,
  },
  selectedCard: {
    backgroundColor: '#d1e7ff',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
  },
});
