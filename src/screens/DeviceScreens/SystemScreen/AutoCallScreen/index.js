import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import InfoCard from '../../../../components/InfoCard';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import {useSelector} from 'react-redux';
import {useMutation, useQuery} from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';
import Spacing from '../../../../components/Spacing';

const DEVICE_ID = '6907390711';

const AutoCallScreen = ({navigation}) => {
  const {appStrings} = useSelector(state => state.language);
  const [isEnabled, setIsEnabled] = useState(false);
  const [contactNumbers, setContactNumbers] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  // Fetch Auto Call Status
  const {data, refetch} = useQuery({
    queryKey: ['autoCall'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getEvent/ACALL/${DEVICE_ID}`,
      }),
  });

  // Fetch Contact Numbers
  const {data: contactData} = useQuery({
    queryKey: ['contactNumbers'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getContactNumber/PHBX/${DEVICE_ID}`,
      }),
  });

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

  const autoCallMutation = useMutation({
    mutationFn: async requestData => {
      return fetcher({
        method: 'POST',
        url: `deviceDataResponse/sendEvent/${DEVICE_ID}`,
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

  const toggleContactSelection = contactNumber => {
    setSelectedContacts(prevSelected => {
      if (prevSelected.includes(contactNumber)) {
        return prevSelected.filter(num => num !== contactNumber);
      } else {
        return [...prevSelected, contactNumber];
      }
    });
  };

  const toggleSwitch = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);

    const requestData = newState
      ? `[ACALL,${selectedContacts.join(',')}]`
      : '[ACALL,0]';

    autoCallMutation.mutate(requestData);
  };

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={appStrings?.system?.autoCallAnswer?.text}
        backgroundColor={'#fff'}
        backPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
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
                selectedContacts.includes(item.contactNumber) &&
                  styles.selectedCard,
              ]}
              onPress={() => toggleContactSelection(item.contactNumber)}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactNumber}>{item.contactNumber}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </MainBackground>
  );
};

export default AutoCallScreen;

const styles = StyleSheet.create({
  container: {
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
