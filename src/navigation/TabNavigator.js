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
import {useSelector} from 'react-redux';

export default function TabNavigator() {
  const Tab = createBottomTabNavigator();
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
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
              <View
                style={{
                  marginBottom: DimensionConstants.five,
                  alignItems: 'center',
                  width: DimensionConstants.fifty,
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: -20,
                    width: DimensionConstants.sixty,
                    height: DimensionConstants.two,
                    backgroundColor: theme.primary,
                    borderRadius: DimensionConstants.five,
                  }}
                />
                <BlueHomeIcon height={DimensionConstants.seventeen} />
                <Text
                  style={{
                    fontSize: DimensionConstants.twelve,
                    marginTop: DimensionConstants.five,
                    color: theme.primary,
                  }}>
                  Home
                </Text>
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
              <View
                style={{
                  marginBottom: DimensionConstants.fifteen,
                  alignItems: 'center',
                  width: DimensionConstants.fifty,
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: -20,
                    width: DimensionConstants.sixty,
                    height: DimensionConstants.two,
                    backgroundColor: theme.primary,
                    borderRadius: DimensionConstants.five,
                  }}
                />
                <BlueDevicesIcon height={DimensionConstants.seventeen} />
                <Text
                  style={{
                    fontSize: DimensionConstants.twelve,
                    marginTop: DimensionConstants.five,
                    color: theme.primary,
                  }}>
                  Devices
                </Text>
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
              <View
                style={{
                  marginBottom: DimensionConstants.fifteen,
                  alignItems: 'center',
                  width: DimensionConstants.fifty,
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: -20,
                    width: DimensionConstants.sixty,
                    height: DimensionConstants.two,
                    backgroundColor: theme.primary,
                    borderRadius: DimensionConstants.five,
                  }}
                />
                <BlueLocationIcon height={DimensionConstants.seventeen} />
                <Text
                  style={{
                    fontSize: DimensionConstants.twelve,
                    marginTop: DimensionConstants.five,
                    color: theme.primary,
                  }}>
                  Location
                </Text>
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
              <View
                style={{
                  marginBottom: DimensionConstants.fifteen,
                  alignItems: 'center',
                  width: DimensionConstants.fifty,
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: -20,
                    width: DimensionConstants.sixty,
                    height: DimensionConstants.two,
                    backgroundColor: theme.primary,
                    borderRadius: DimensionConstants.five,
                  }}
                />
                <BlueSaviourIcon height={DimensionConstants.seventeen} />
                <Text
                  style={{
                    fontSize: DimensionConstants.twelve,
                    marginTop: DimensionConstants.five,
                    color: theme.primary,
                  }}>
                  Saviours
                </Text>
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
              <View
                style={{
                  marginBottom: DimensionConstants.fifteen,
                  alignItems: 'center',
                  width: DimensionConstants.fifty,
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: -20,
                    width: DimensionConstants.sixty,
                    height: DimensionConstants.two,
                    backgroundColor: theme.primary,
                    borderRadius: DimensionConstants.five,
                  }}
                />
                <BlueSettingsIcon height={DimensionConstants.seventeen} />
                <Text
                  style={{
                    fontSize: DimensionConstants.twelve,
                    marginTop: DimensionConstants.five,
                    color: theme.primary,
                  }}>
                  Settings
                </Text>
              </View>
            ) : (
              <SettingsIcon />
            ),
        }}
      />
    </Tab.Navigator>
  );
}
