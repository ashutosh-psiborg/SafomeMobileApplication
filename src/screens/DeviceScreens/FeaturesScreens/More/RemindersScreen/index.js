import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import CustomButton from '../../../../../components/CustomButton';
import fetcher from '../../../../../utils/ApiService';
import {useMutation} from '@tanstack/react-query';

const RemindersScreen = ({navigation}) => {
  const [deviceId, setDeviceId] = useState('');
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState('');

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

  const convertToHex = str =>
    str
      .split('')
      .map(char => char.charCodeAt(0).toString(16).padStart(4, '0'))
      .join('');

  const sendReminderMutation = useMutation({
    mutationFn: async formattedData => {
      if (!deviceId) {
        Alert.alert('Error', 'Device ID not found.');
        return;
      }
      return fetcher({
        method: 'POST',
        url: `/deviceDataResponse/sendEvent/${deviceId}`,
        data: {data: formattedData},
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Reminder sent successfully');
      setMessage('');
    },
    onError: error => {
      console.error('Error sending reminder:', error);
      Alert.alert('Error', 'Failed to send reminder.');
    },
  });

  const sendReminder = () => {
    if (!deviceId) {
      Alert.alert('Error', 'No device selected.');
      return;
    }
    if (!message) {
      Alert.alert('Error', 'Please enter a message.');
      return;
    }

    const formattedTime = `${String(time.getHours()).padStart(2, '0')}:${String(
      time.getMinutes(),
    ).padStart(2, '0')}-1-1`;
    const hexMessage = convertToHex(message);
    const formattedData = `[TAKEPILLS,${formattedTime},1,${hexMessage}]`;

    sendReminderMutation.mutate(formattedData);
  };

  return (
    <MainBackground noPadding style={styles.container}>
      <CustomHeader
        title="Reminder"
        backgroundColor="#ffffff"
        backPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={styles.label}>Reminder Time:</Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={styles.timeButton}
          disabled={!deviceId} // Disable if no device selected
        >
          <Text style={styles.timeText}>
            {`${String(time.getHours()).padStart(2, '0')}:${String(
              time.getMinutes(),
            ).padStart(2, '0')}`}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowPicker(false);
              if (selectedTime) setTime(selectedTime);
            }}
          />
        )}

        <Text style={styles.label}>Reminder Message:</Text>
        <TextInput
          placeholder="Enter reminder message"
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          editable={!!deviceId} // Disable input if no device selected
        />

        <CustomButton
          text="Set Reminder"
          onPress={sendReminder}
          style={styles.button}
          disabled={!deviceId} // Disable button if no device selected
        />
      </View>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F7FC',
  },
  content: {
    padding: DimensionConstants.sixteen,
  },
  label: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  timeButton: {
    padding: DimensionConstants.ten,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: DimensionConstants.eight,
    textAlign: 'center',
    marginVertical: DimensionConstants.ten,
    alignItems: 'center',
  },
  timeText: {
    fontSize: DimensionConstants.eighteen,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: DimensionConstants.twelve,
    borderRadius: DimensionConstants.eight,
    marginTop: DimensionConstants.ten,
  },
  button: {
    marginTop: DimensionConstants.twenty,
  },
});

export default RemindersScreen;
