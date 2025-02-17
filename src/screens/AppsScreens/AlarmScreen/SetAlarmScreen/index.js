import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import {Dropdown} from 'react-native-element-dropdown';
import CustomButton from '../../../../components/CustomButton';
import Spacing from '../../../../components/Spacing';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const repeatOptions = [
  {label: 'Once', value: 'Once'},
  {label: 'Repeat', value: 'Repeat'},
];

const SetAlarmScreen = ({navigation}) => {
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [repeat, setRepeat] = useState('Once');
  const [selectedDays, setSelectedDays] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);

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

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader title={'Set Alarm'} backgroundColor={'#ffffff'} />
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

          {repeat === 'Repeat' && (
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

        <CustomButton text={'Save'} onPress={() => navigation.goBack()} />
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
  },
  dayButton: {
    paddingVertical: DimensionConstants.five,
    paddingHorizontal: DimensionConstants.eight,
    backgroundColor: '#000000',
    borderRadius: DimensionConstants.ten,
    marginRight: DimensionConstants.two,
    minWidth: DimensionConstants.thirty,
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#0279E1',
  },
  dayText: {
    color: '#fff',
    fontSize: DimensionConstants.sixteen,
  },
  selectedDayText: {
    color: '#fff',
  },
});
