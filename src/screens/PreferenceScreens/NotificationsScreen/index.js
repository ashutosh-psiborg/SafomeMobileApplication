import {View, Text, Switch} from 'react-native';
import React from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import CustomCard from '../../../components/CustomCard';
import Spacing from '../../../components/Spacing';
import {DimensionConstants} from '../../../constants/DimensionConstants';

const NotificationsScreen = () => {
  return (
    <MainBackground style={{backgroundColor: '#F2F7FC'}} noPadding>
      <CustomHeader title={'Notifications'} backgroundColor={'#ffffff'} />
      <Spacing height={DimensionConstants.eight} />
      <View style={{padding: DimensionConstants.sixteen}}>
        <CustomCard>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text>Enable notifications</Text>
            <Switch />
          </View>
        </CustomCard>
      </View>
    </MainBackground>
  );
};

export default NotificationsScreen;
