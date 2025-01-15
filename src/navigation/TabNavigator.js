import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default function TabNavigator() {
  const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator
      screenOptions={ {
          headerShown : false ,
          tabBarLabelStyle: {
            fontSize: 14,
          },
          tabBarStyle: {
            height: 60, 
            paddingBottom: 8,
          },
          tabBarIconStyle: {
            alignItems: 'center', 
            justifyContent: 'center',
          },
        }}
      >
        <Tab.Screen name="HomeScreen" component={HomeScreen} />
        <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
        <Tab.Screen name="NotificationsScreen" component={NotificationsScreen} />
        <Tab.Screen name="SettingsScreen" component={SettingsScreen} />
      </Tab.Navigator>
  );
}
