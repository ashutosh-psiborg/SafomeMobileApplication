import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/BottomTabScreens/HomeScreen';
import SettingsScreen from '../screens/BottomTabScreens/SettingsScreen';
import HomeIcon from '../assets/icons/HomeIcon';
import SettingsIcon from '../assets/icons/SettingsIcon';
import DevicesScreen from '../screens/BottomTabScreens/DevicesScreen';
import LocationScreen from '../screens/BottomTabScreens/LocationScreen';
import SavioursScreen from '../screens/BottomTabScreens/SavioursScreen';
import DevicesIcon from '../assets/icons/DevicesIcon';
import LocationIcon from '../assets/icons/LocationIcon';
import SavioursIcon from '../assets/icons/SavioursIcon';
import {DimensionConstants} from '../constants/DimensionConstants';
import BlueHomeIcon from '../assets/icons/BlueHomeIcon';
import BlueDevicesIcon from '../assets/icons/BlueDevicesIcon';
import BlueLocationIcon from '../assets/icons/BlueLocationIcon';
import BlueSaviourIcon from '../assets/icons/BlueSaviourIcon';
import BlueSettingsIcon from '../assets/icons/BlueSettingsIcon';
import {View, Text} from 'react-native';
export default function TabNavigator() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarStyle: {
          height: DimensionConstants.seventyFive,
          paddingTop: DimensionConstants.twenty,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          alignItems: 'center',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={{marginBottom: DimensionConstants.fifteen}}>
                <BlueHomeIcon />
              </View>
            ) : (
              <HomeIcon />
            ),
        }}
      />
      <Tab.Screen
        name="Devices"
        component={DevicesScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={{marginBottom: DimensionConstants.fifteen}}>
                <BlueDevicesIcon />
              </View>
            ) : (
              <DevicesIcon />
            ),
        }}
      />
      <Tab.Screen
        name="Location"
        component={LocationScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={{marginBottom: DimensionConstants.fifteen}}>
                <BlueLocationIcon />
              </View>
            ) : (
              <LocationIcon />
            ),
        }}
      />
      <Tab.Screen
        name="Saviours"
        component={SavioursScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={{marginBottom: DimensionConstants.fifteen}}>
                <BlueSaviourIcon />
              </View>
            ) : (
              <SavioursIcon />
            ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={{marginBottom: DimensionConstants.fifteen}}>
                <BlueSettingsIcon />
                <Text style ={{fontSize :8}}>Settings</Text>
              </View>
            ) : (
              <SettingsIcon />
            ),
        }}
      />
    </Tab.Navigator>
  );
}
