import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Controller} from 'react-hook-form';
import {Dropdown} from 'react-native-element-dropdown';
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
                  // Dropdown Component
                  <Dropdown
                    style={styles.dropdown}
                    data={field.options}
                    labelField="label"
                    valueField="value"
                    value={value} // ✅ Displaying current value
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
                  />
                ) : (
                  // TextInput Component
                  <TextInput
                    style={styles.input}
                    onChangeText={onChange}
                    value={value} // ✅ Displaying current value
                    placeholder={field.placeholder}
                    secureTextEntry={field.secureTextEntry}
                    keyboardType={field.keyboardType}
                    placeholderTextColor={'#5E6368'}
                    maxLength={field.maxLength}
                  />
                )
              }
              name={field.name}
              defaultValue={field.defaultValue || ''} // ✅ Setting default value
            />

            {/* Show text at right end if passed */}
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
  icon: {
    marginRight: DimensionConstants.eight,
  },
  input: {
    flex: 1,
    height: DimensionConstants.forty,
    paddingHorizontal: DimensionConstants.eight,
    fontSize: DimensionConstants.fourteen,
    color: '#000', // ✅ Text color for visibility
  },
  dropdown: {
    flex: 1,
    height: DimensionConstants.forty,
    color: '#5E6368',
    paddingHorizontal: DimensionConstants.eight,
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
