import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import TabNavigator from './TabNavigator';

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StackNavigator>
        <TabNavigator />
      </StackNavigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
