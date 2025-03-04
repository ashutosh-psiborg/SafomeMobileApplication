import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Controller} from 'react-hook-form';
import {Dropdown} from 'react-native-element-dropdown';
import {DimensionConstants} from '../constants/DimensionConstants';
import EyeCloseIcon from '../assets/icons/EyeCloseIcon';
import EyeOpenIcon from '../assets/icons/EyeOpenIcon';

const CommonForm = ({control, fields, errors}) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState({});

  // Toggle password visibility
  const togglePasswordVisibility = fieldName => {
    setPasswordVisible(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  // Date formatting function
  const formatDate = date => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <View style={styles.container}>
      {fields.map((field, index) => (
        <View key={index} style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            {field.icon && <View style={styles.icon}>{field.icon}</View>}
            <Controller
              control={control}
              render={({field: {onChange, value}}) =>
                field.options ? (
                  <Dropdown
                    style={[
                      styles.dropdown,
                      field.disabled && {color: '#A0A0A0'},
                    ]}
                    data={field.options}
                    labelField="label"
                    valueField="value"
                    value={value}
                    onChange={item => onChange(item.value)}
                    placeholder={field.placeholder}
                    placeholderStyle={{
                      fontSize: DimensionConstants.fourteen,
                      color: '#5E6368',
                    }}
                    selectedTextStyle={{
                      fontSize: DimensionConstants.fourteen,
                      color: '#000',
                    }}
                    disabled={field.disabled}
                  />
                ) : field.isDate ? (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        if (!field.disabled) {
                          setCurrentField(field.name);
                          setDatePickerVisible(true);
                        }
                      }}
                      activeOpacity={field.disabled ? 1 : 0.7}>
                      <TextInput
                        style={styles.input}
                        value={formatDate(value)}
                        placeholder={field.placeholder}
                        editable={false}
                        placeholderTextColor={'#5E6368'}
                      />
                    </TouchableOpacity>

                    {/* DateTimePicker Component */}
                    {datePickerVisible && currentField === field.name && (
                      <DateTimePicker
                        value={value ? new Date(value) : new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                          setDatePickerVisible(false);
                          if (selectedDate) {
                            onChange(selectedDate.toISOString().split('T')[0]);
                          }
                        }}
                      />
                    )}
                  </>
                ) : (
                  <View style={styles.textInputWrapper}>
                    <TextInput
                      style={[
                        styles.input,
                        field.disabled && {color: '#A0A0A0'},
                      ]}
                      onChangeText={onChange}
                      value={value}
                      placeholder={field.placeholder}
                      secureTextEntry={
                        field.secureTextEntry && !passwordVisible[field.name]
                      }
                      keyboardType={field.keyboardType}
                      placeholderTextColor={'#5E6368'}
                      maxLength={field.maxLength}
                      editable={!field.disabled}
                    />

                    {/* Show/Hide Password Icon */}
                    {field.secureTextEntry && (
                      <TouchableOpacity
                        onPress={() => togglePasswordVisibility(field.name)}
                        style={styles.eyeIcon}>
                        {passwordVisible[field.name] ? (
                          <EyeOpenIcon />
                        ) : (
                          <EyeCloseIcon />
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                )
              }
              name={field.name}
              defaultValue={field.defaultValue || ''}
            />

            {/* Right Text or Button */}
            {field.text && (
              <TouchableOpacity>
                <Text style={styles.rightText}>{field.text}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Show Validation Errors Below Input */}
          {errors[field.name] && (
            <Text style={styles.errorText}>{errors[field.name].message}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: DimensionConstants.sixteen,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: DimensionConstants.one,
    borderColor: 'rgba(107, 115, 122, 0.1)',
    borderRadius: DimensionConstants.thirty,
    paddingHorizontal: DimensionConstants.ten,
    height: DimensionConstants.fortyEight,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: DimensionConstants.eight,
  },
  input: {
    flex: 1,
    height: DimensionConstants.forty,
    paddingHorizontal: DimensionConstants.eight,
    fontSize: DimensionConstants.fourteen,
    color: '#000',
  },
  dropdown: {
    flex: 1,
    height: DimensionConstants.forty,
    color: '#5E6368',
    paddingHorizontal: DimensionConstants.eight,
  },
  eyeIcon: {
    padding: DimensionConstants.eight,
  },
  rightText: {
    marginLeft: DimensionConstants.eight,
    color: '#0279E1',
    fontSize: DimensionConstants.fourteen,
  },
  errorText: {
    color: 'red',
    fontSize: DimensionConstants.twelve,
    marginTop: DimensionConstants.four,
    marginLeft: DimensionConstants.ten,
  },
});

export default CommonForm;
