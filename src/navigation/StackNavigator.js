import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/AuthScreens/Login/index';
import RegisterScreen from '../screens/AuthScreens/Register/index';
import OnboardingScreen from '../screens/AuthScreens/Onboarding/index';
import WelcomeScreen from '../screens/AuthScreens/Welcome/index';
import VerifyMailOtpScreen from '../screens/AuthScreens/Register/VerifyMailOtpScreen/index';
import VerifyPhoneOtpScreen from '../screens/AuthScreens/Register/VerifyPhoneOtpScreen/index';
import CreatePasswordScreen from '../screens/AuthScreens/Register/CreatePasswordScreen/index';
import BioMetricScreen from '../screens/AuthScreens/Register/BioMetricScreen/index';
import SecurityPinScreen from '../screens/AuthScreens/Register/SecurityPinScreen/index';
import LoginWithMobileScreen from '../screens/AuthScreens/Login/LoginWithMobileScreen/index';
import TabNavigator from './TabNavigator';
import AddDeviceScreen from '../screens/AddDeviceScreens/index';
import PairNewDeviceScreen from '../screens/AddDeviceScreens/PairNewDeviceScreen/index';
import FitnessScreen from '../screens/DeviceScreens/FitnessScreen/index';
import SystemScreen from '../screens/DeviceScreens/SystemScreen/index';
import TrackingFrequencyScreen from '../screens/DeviceScreens/SystemScreen/TrackingFrequencyScreen/index';
import ProfileInformationScreen from '../screens/GeneralSettingsScreens/ProfileInformationScreen/index';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="OnboardingScreen">
      <Stack.Screen
        options={{headerShown: false}}
        name="LoginScreen"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="MainApp"
        component={TabNavigator}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="RegisterScreen"
        component={RegisterScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="VerifyMailOtpScreen"
        component={VerifyMailOtpScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="VerifyPhoneOtpScreen"
        component={VerifyPhoneOtpScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="CreatePasswordScreen"
        component={CreatePasswordScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="BioMetricScreen"
        component={BioMetricScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SecurityPinScreen"
        component={SecurityPinScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="LoginWithMobileScreen"
        component={LoginWithMobileScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="AddDeviceScreen"
        component={AddDeviceScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="PairNewDeviceScreen"
        component={PairNewDeviceScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="OnboardingScreen"
        component={OnboardingScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="WelcomeScreen"
        component={WelcomeScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="FitnessScreen"
        component={FitnessScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SystemScreen"
        component={SystemScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TrackingFrequencyScreen"
        component={TrackingFrequencyScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="ProfileInformationScreen"
        component={ProfileInformationScreen}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
