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

const CommonForm = ({control, fields, errors, countryCode, setCountryCode}) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState({});

  const togglePasswordVisibility = fieldName => {
    setPasswordVisible(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const formatDate = date => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <View style={styles.container}>
      {fields.map((field, index) => (
        <View key={index} style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            {/* Icon */}
            {field.icon && <View style={styles.icon}>{field.icon}</View>}

            {/* Country Code Dropdown (only on fields where needed) */}
            {field.showCountryCodeDropdown && (
              <Dropdown
                style={styles.countryCodeDropdown}
                data={field.countryCodes}
                labelField="label"
                valueField="value"
                value={countryCode}
                onChange={item => setCountryCode(item.value)}
                placeholder=""
                selectedTextStyle={styles.countryCodeText}
                disable={field.disabled}
              />
            )}

            {/* Main Controller */}
            <Controller
              control={control}
              name={field.name}
              defaultValue={field.defaultValue || ''}
              render={({field: {onChange, value}}) =>
                field.options ? (
                  <Dropdown
                    style={[
                      styles.dropdown,
                      {opacity: field.disabled ? 0.5 : 1},
                    ]}
                    data={field.options}
                    labelField="label"
                    valueField="value"
                    value={value}
                    onChange={
                      !field.disabled ? item => onChange(item.value) : undefined
                    }
                    placeholder={field.placeholder}
                    placeholderStyle={styles.placeholderText}
                    selectedTextStyle={styles.selectedText}
                    disable={field.disabled}
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
            />

            {/* Optional Right-Aligned Text */}
            {field.text && (
              <TouchableOpacity>
                <Text style={styles.rightText}>{field.text}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Error Text */}
          {errors[field.name] && (
            <Text style={styles.errorText}>{errors[field.name].message}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
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
  icon: {
    marginRight: DimensionConstants.eight,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  countryCodeDropdown: {
    width: DimensionConstants.oneHundredThirty,
    height: DimensionConstants.forty,
    justifyContent: 'center',
    paddingLeft: DimensionConstants.ten,
  },
  countryCodeText: {
    fontSize: DimensionConstants.fourteen,
    color: '#000',
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
