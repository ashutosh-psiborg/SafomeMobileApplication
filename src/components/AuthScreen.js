import React, {useState, useEffect} from 'react';
import {View, Text, Alert, StyleSheet} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = ({onAuthenticated}) => {
  const [mpin, setMpin] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [showMpinInput, setShowMpinInput] = useState(false);

  // Check if biometrics are available
  useEffect(() => {
    const checkBiometrics = async () => {
      const rnBiometrics = new ReactNativeBiometrics();
      try {
        const {available} = await rnBiometrics.isSensorAvailable();
        setIsBiometricSupported(available);
        if (available) {
          promptBiometric();
        } else {
          setShowMpinInput(true); // Show MPIN if biometrics not available
        }
      } catch (error) {
        console.error('Biometric check failed:', error);
        setShowMpinInput(true);
      }
    };
    checkBiometrics();
  }, []);

  // Prompt biometric authentication
  const promptBiometric = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    try {
      const {success, error} = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to unlock the app',
      });
      if (success) {
        onAuthenticated();
      } else {
        Alert.alert('Authentication Failed', 'Please use MPIN to unlock.');
        setShowMpinInput(true);
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      setShowMpinInput(true);
    }
  };

  // Validate MPIN
  const validateMpin = async () => {
    const storedMpin = await AsyncStorage.getItem('userMpin');
    if (mpin === storedMpin) {
      onAuthenticated();
    } else {
      Alert.alert('Error', 'Invalid MPIN. Try again.');
      setMpin('');
    }
  };

  return (
    <View style={styles.container}>
      {showMpinInput ? (
        <>
          <Text style={styles.title}>Enter MPIN to Unlock</Text>
          <TextInput
            mode="outlined"
            label="MPIN"
            value={mpin}
            onChangeText={setMpin}
            secureTextEntry
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={validateMpin} style={styles.button}>
            Unlock
          </Button>
        </>
      ) : (
        <Text style={styles.title}>Authenticating...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    padding: 10,
  },
});

export default AuthScreen;
