import React from 'react';
import {View, TextInput, Text, StyleSheet, Platform} from 'react-native';
import {Controller} from 'react-hook-form';
import {Picker} from '@react-native-picker/picker';
import {DimensionConstants} from '../constants/DimensionConstants';

const CommonForm = ({control, fields, errors}) => {
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
                  // Dropdown Picker
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}>
                    {field.options.map((option, idx) => (
                      <Picker.Item
                        key={idx}
                        label={option.label}
                        value={option.value}
                        style={{fontSize: DimensionConstants.twelve}}
                      />
                    ))}
                  </Picker>
                ) : (
                  // TextInput
                  <TextInput
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                    placeholder={field.placeholder}
                    secureTextEntry={field.secureTextEntry}
                    keyboardType={field.keyboardType}
                    placeholderTextColor={'#5E6368'}
                    maxLength={field.maxLength}
                  />
                )
              }
              name={field.name}
              defaultValue={field.options ? field.options[0]?.value : ''}
            />
          </View>

          {/* ✅ Show Validation Errors Below Input */}
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
    // Padding removed to allow better spacing between inputs
  },
  inputWrapper: {
    marginBottom: DimensionConstants.sixteen, // Keeps spacing consistent
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
    marginRight: DimensionConstants.eight, // Space between icon and input field
  },
  input: {
    flex: 1,
    height: DimensionConstants.forty,
    paddingHorizontal: DimensionConstants.eight,
  },
  picker: {
    flex: 1,
    color: '#5E6368',
    height: Platform.OS === 'ios' ? DimensionConstants.forty : undefined,
  },
  errorText: {
    color: 'red',
    fontSize: DimensionConstants.twelve,
    marginTop: DimensionConstants.four,
    marginLeft: DimensionConstants.ten,
  },
});

export default CommonForm;
