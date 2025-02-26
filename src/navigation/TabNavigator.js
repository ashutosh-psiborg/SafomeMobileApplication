import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import HomeScreen from '../screens/BottomTabScreens/HomeScreen/HomeScreen';
import SettingsScreen from '../screens/BottomTabScreens/SettingsScreen/SettingsScreen';
import DevicesScreen from '../screens/BottomTabScreens/DevicesScreen';
import LocationScreen from '../screens/BottomTabScreens/LocationScreen';
import SavioursScreen from '../screens/BottomTabScreens/SavioursScreen';
import HomeIcon from '../assets/icons/HomeIcon';
import SettingsIcon from '../assets/icons/SettingsIcon';
import DevicesIcon from '../assets/icons/DevicesIcon';
import LocationIcon from '../assets/icons/LocationIcon';
import SavioursIcon from '../assets/icons/SavioursIcon';
import BlueHomeIcon from '../assets/icons/BlueHomeIcon';
import BlueDevicesIcon from '../assets/icons/BlueDevicesIcon';
import BlueLocationIcon from '../assets/icons/BlueLocationIcon';
import BlueSaviourIcon from '../assets/icons/BlueSaviourIcon';
import BlueSettingsIcon from '../assets/icons/BlueSettingsIcon';
import {DimensionConstants} from '../constants/DimensionConstants';

export default function TabNavigator() {
  const Tab = createBottomTabNavigator();
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  const renderIcon = (focused, Icon, BlueIcon, label) =>
    focused ? (
      <View style={styles.iconContainer}>
        <View
          style={[styles.activeIndicator, {backgroundColor: theme.primary}]}
        />
        <BlueIcon height={DimensionConstants.seventeen} />
        <Text style={[styles.iconText, {color: theme.primary}]}>{label}</Text>
      </View>
    ) : (
      <Icon />
    );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) =>
            renderIcon(focused, HomeIcon, BlueHomeIcon, 'Home'),
        }}
      />
      <Tab.Screen
        name="Devices"
        component={DevicesScreen}
        options={{
          tabBarIcon: ({focused}) =>
            renderIcon(focused, DevicesIcon, BlueDevicesIcon, 'Devices'),
        }}
      />
      <Tab.Screen
        name="Location"
        component={LocationScreen}
        options={{
          tabBarIcon: ({focused}) =>
            renderIcon(focused, LocationIcon, BlueLocationIcon, 'Location'),
        }}
      />
      <Tab.Screen
        name="Saviours"
        component={SavioursScreen}
        options={{
          tabBarIcon: ({focused}) =>
            renderIcon(focused, SavioursIcon, BlueSaviourIcon, 'Saviours'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({focused}) =>
            renderIcon(focused, SettingsIcon, BlueSettingsIcon, 'Settings'),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: DimensionConstants.seventyFive,
    paddingTop: DimensionConstants.twenty,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: DimensionConstants.fifteen,
    alignItems: 'center',
    width: DimensionConstants.fifty,
  },
  activeIndicator: {
    position: 'absolute',
    top: -20,
    width: DimensionConstants.sixty,
    height: DimensionConstants.two,
    borderRadius: DimensionConstants.five,
  },
  iconText: {
    fontSize: DimensionConstants.twelve,
    marginTop: DimensionConstants.five,
  },
});
