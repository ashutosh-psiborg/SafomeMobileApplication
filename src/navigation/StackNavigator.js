import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import ProfileInformationScreen from '../screens/BottomTabScreens/SettingsScreen/GeneralSettingsScreens/ProfileInformationScreen/index';
import LanguageScreen from '../screens/BottomTabScreens/SettingsScreen/GeneralSettingsScreens/LanguageScreen/index';
import SubscriptionScreen from '../screens/BottomTabScreens/SettingsScreen/GeneralSettingsScreens/SubscriptionScreen/index';
import NotificationsScreen from '../screens/BottomTabScreens/SettingsScreen/PreferenceScreens/NotificationsScreen/index';
import {ActivityIndicator, View} from 'react-native';
import PauseNotificationScreen from '../screens/BottomTabScreens/SettingsScreen/PreferenceScreens/NotificationsScreen/PauseNotificationScreen';
import DeleteNotificationScreen from '../screens/BottomTabScreens/SettingsScreen/PreferenceScreens/NotificationsScreen/DeleteNotificationScreen';
import AboutDeviceScreen from '../screens/BottomTabScreens/SettingsScreen/GeneralSettingsScreens/AboutDeviceScreen/index';
import AddRemoveDeviceScreen from '../screens/BottomTabScreens/SettingsScreen/OtherSettingsScreens/AddRemoveDeviceScreen';
import AppScreen from '../screens/AppsScreens/index';
import AlarmScreen from '../screens/AppsScreens/AlarmScreen/index';
import SetAlarmScreen from '../screens/AppsScreens/AlarmScreen/SetAlarmScreen/index';
import AutoCallScreen from '../screens/DeviceScreens/SystemScreen/AutoCallScreen/index';
import SleepModeScreen from '../screens/DeviceScreens/SystemScreen/SleepModeScreen/index';
import DisableFunctionScreen from '../screens/DeviceScreens/SystemScreen/DisableFunctionScreen/index';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log('Error checking token:', error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'MainApp' : 'LoginScreen'}>
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
      <Stack.Screen
        options={{headerShown: false}}
        name="LanguageScreen"
        component={LanguageScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SubscriptionScreen"
        component={SubscriptionScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="PauseNotificationScreen"
        component={PauseNotificationScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="DeleteNotificationScreen"
        component={DeleteNotificationScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="AboutDeviceScreen"
        component={AboutDeviceScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="AddRemoveDeviceScreen"
        component={AddRemoveDeviceScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="AppScreen"
        component={AppScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="AlarmScreen"
        component={AlarmScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SetAlarmScreen"
        component={SetAlarmScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="AutoCallScreen"
        component={AutoCallScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SleepModeScreen"
        component={SleepModeScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="DisableFunctionScreen"
        component={DisableFunctionScreen}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
