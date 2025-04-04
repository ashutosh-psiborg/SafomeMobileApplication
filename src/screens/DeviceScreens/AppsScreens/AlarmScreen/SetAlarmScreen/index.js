import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import {Dropdown} from 'react-native-element-dropdown';
import CustomButton from '../../../../../components/CustomButton';
import Spacing from '../../../../../components/Spacing';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../../../../utils/ApiService';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const repeatOptions = [
  {label: 'Once', value: 'Once'},
  {label: 'Daily', value: 'Daily'},
  {label: 'Custom', value: 'Custom'},
];

const SetAlarmScreen = ({navigation}) => {
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [repeat, setRepeat] = useState('Once');
  const [selectedDays, setSelectedDays] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [deviceId, setDeviceId] = useState('');
  // Fetch Device ID from AsyncStorage
  console.log('Fetching device ID from AsyncStorage', deviceId);
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
  const route = useRoute();
  const {index} = route.params;
  console.log(index);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);

  const onChange = (event, selectedTime) => {
    setShowPicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const toggleDay = day => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  const setAlarmMutation = useMutation({
    mutationFn: async () => {
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;

      let repeatFlag = '1';
      if (repeat === 'Daily') {
        repeatFlag = '2';
      } else if (repeat === 'Custom') {
        // Changed from "Repeat" to "Custom"
        repeatFlag = '3';
      }

      let daysBinary = '';
      if (repeat === 'Custom') {
        // Updated condition
        const weekDaysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysBinary = weekDaysMap
          .map(day => (selectedDays.includes(day) ? '1' : '0'))
          .join('');
      }

      const commas = ','.repeat(index + 1);
      let remindString = `[REMIND${commas}${formattedTime}-1-${repeatFlag}`;

      if (repeat === 'Custom') {
        // Updated condition
        remindString += `-${daysBinary}`;
      }

      remindString += ']';
      console.log(remindString);

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
        title={'Set Alarm'}
        backgroundColor={'#ffffff'}
        backPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'space-between',
          flex: 1,
          padding: DimensionConstants.sixteen,
        }}>
        <View>
          <View style={styles.section}>
            <Text style={styles.label}>Time:</Text>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.timeButton}>
              <Text style={styles.timeText}>
                {time.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onChange}
              />
            )}
          </View>

          <View style={styles.section}>
            <Dropdown
              data={repeatOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Repeat Option"
              value={repeat}
              onChange={item => {
                setRepeat(item.value);
              }}
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              selectedTextStyle={styles.selectedText}
              placeholderStyle={styles.placeholderText}
            />
          </View>

          {repeat === 'Custom' && (
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
          )}

          <Spacing height={DimensionConstants.twentyFour} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.selectedText}>Vibrate</Text>
            <Switch
              value={isEnabled}
              onValueChange={toggleSwitch}
              trackColor={{false: '#ccc', true: 'rgba(0, 91, 187, 0.1)'}}
              thumbColor={isEnabled ? '#0279E1' : '#f4f3f4'}
            />
          </View>
        </View>

        <CustomButton text={'Save'} onPress={() => setAlarmMutation.mutate()} />
      </ScrollView>
    </MainBackground>
  );
};

export default SetAlarmScreen;

const styles = StyleSheet.create({
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
  dropdown: {
    height: DimensionConstants.fortyFive,
  },
  dropdownContainer: {
    borderRadius: DimensionConstants.eight,
  },
  selectedText: {
    color: '#000',
    fontSize: DimensionConstants.sixteen,
    fontWeight: '500',
  },
  placeholderText: {
    color: '#aaa',
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
