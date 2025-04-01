import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import CustomButton from '../../../../components/CustomButton';
import Spacing from '../../../../components/Spacing';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SetDndScreen = ({navigation}) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
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
  console.log('Device', deviceId);
  const route = useRoute();
  const {index} = route.params;
  console.log(index);
  const onChange = (event, selectedTime, type) => {
    setShowPicker(null);
    if (selectedTime) {
      type === 'start' ? setStartTime(selectedTime) : setEndTime(selectedTime);
    }
  };

  const toggleDay = day => {
    setSelectedDays(prevDays =>
      prevDays.includes(day)
        ? prevDays.filter(d => d !== day)
        : [...prevDays, day],
    );
  };

  const setDndMutation = useMutation({
    mutationFn: async () => {
      const startHours = startTime.getHours();
      const startMinutes = startTime.getMinutes();
      const endHours = endTime.getHours();
      const endMinutes = endTime.getMinutes();

      const formattedStartTime = `${startHours
        .toString()
        .padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
      const formattedEndTime = `${endHours
        .toString()
        .padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

      const daysBinary = daysOfWeek
        .map(day => (selectedDays.includes(day) ? '1' : '0'))
        .join('');

      const commas = ','.repeat(index);
      const remindString = `[SILENCETIME2${commas},${formattedStartTime}-${formattedEndTime}-${daysBinary}]`;
      console.log('Payload:', remindString);
      return fetcher({
        method: 'POST',
        url: `deviceDataResponse/sendEvent/${deviceId}`,
        data: {data: remindString},
      });
    },
    onSuccess: data => {
      console.log('Alarm set successfully:', data);
      navigation.goBack();
    },
    onError: error => {
      console.error('Alarm failed to set', error);
    },
  });

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Set time period'}
        backgroundColor={'#ffffff'}
        backPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          {['Start', 'End'].map(type => (
            <View key={type} style={styles.section}>
              <Text style={styles.label}>{type} Time:</Text>
              <TouchableOpacity
                onPress={() => setShowPicker(type.toLowerCase())}
                style={styles.timeButton}>
                <Text style={styles.timeText}>
                  {(type === 'Start' ? startTime : endTime).toLocaleTimeString(
                    [],
                    {hour: '2-digit', minute: '2-digit'},
                  )}
                </Text>
              </TouchableOpacity>
              {showPicker === type.toLowerCase() && (
                <DateTimePicker
                  value={type === 'Start' ? startTime : endTime}
                  mode="time"
                  display="default"
                  onChange={(event, time) =>
                    onChange(event, time, type.toLowerCase())
                  }
                />
              )}
            </View>
          ))}

          <View style={styles.section}>
            <View style={styles.daysContainer}>
              {daysOfWeek.map(day => (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.selectedDayButton,
                  ]}>
                  <Text
                    style={[
                      styles.dayText,
                      selectedDays.includes(day) && styles.selectedDayText,
                    ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Spacing height={DimensionConstants.twentyFour} />
        </View>
        <CustomButton text={'Save'} onPress={() => setDndMutation.mutate()} />
      </ScrollView>
    </MainBackground>
  );
};

export default SetDndScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    padding: DimensionConstants.sixteen,
  },
  section: {
    marginVertical: DimensionConstants.five,
  },
  label: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '500',
    marginBottom: DimensionConstants.five,
  },
  timeButton: {
    padding: DimensionConstants.fifteen,
    backgroundColor: '#e0e0e0',
    borderRadius: DimensionConstants.eight,
    alignItems: 'center',
  },
  timeText: {
    fontSize: DimensionConstants.eighteen,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: DimensionConstants.eight,
  },
  dayButton: {
    width: DimensionConstants.fortyTwo,
    height: DimensionConstants.thirtyTwo,
    backgroundColor: '#000000',
    borderRadius: DimensionConstants.ten,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: DimensionConstants.five,
  },
  selectedDayButton: {
    backgroundColor: '#0279E1',
  },
  dayText: {
    color: '#fff',
    fontSize: DimensionConstants.sixteen,
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#fff',
  },
});
