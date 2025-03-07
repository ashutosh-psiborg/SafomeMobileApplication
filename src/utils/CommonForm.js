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
                      {opacity: field.disabled ? 0.5 : 1}, // Visually dimmed
                    ]}
                    data={field.options}
                    labelField="label"
                    valueField="value"
                    value={value}
                    onChange={
                      !field.disabled ? item => onChange(item.value) : undefined
                    } // Prevent selection
                    placeholder={field.placeholder}
                    placeholderStyle={{
                      fontSize: DimensionConstants.fourteen,
                      color: field.disabled ? '#A0A0A0' : '#5E6368', // Change color when disabled
                    }}
                    selectedTextStyle={{
                      fontSize: DimensionConstants.fourteen,
                      color: field.disabled ? '#565454' : '#000', // Change selected text color
                    }}
                    disable={field.disabled} // Fully disables the dropdown
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
                        style={[
                          styles.input,
                          field.disabled && styles.disabledInput,
                        ]}
                        value={formatDate(value)}
                        placeholder={field.placeholder}
                        editable={false}
                        placeholderTextColor={'#A0A0A0'}
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
                        field.disabled && styles.disabledInput,
                      ]}
                      onChangeText={onChange}
                      value={value}
                      placeholder={field.placeholder}
                      secureTextEntry={
                        field.secureTextEntry && !passwordVisible[field.name]
                      }
                      keyboardType={field.keyboardType}
                      placeholderTextColor={'#A0A0A0'}
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
    paddingHorizontal: DimensionConstants.eight,
  },
  disabledInput: {
    color: '#A0A0A0',
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
  placeholderText: {
    fontSize: DimensionConstants.fourteen,
    color: '#A0A0A0',
  },
  selectedText: {
    fontSize: DimensionConstants.fourteen,
    color: '#000',
  },
});

export default CommonForm;
