import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import PlusIcon from '../../../assets/icons/PlusIcon';
import {DimensionConstants} from '../../../constants/DimensionConstants';

const AlarmScreen = ({navigation}) => {
  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader title={'Alarm'} backgroundColor={'#ffffff'} />
      <View style={{padding: DimensionConstants.sixteen}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: DimensionConstants.fourteen,
              justifyContent: 'space-between',
              fontWeight: '500',
            }}>
            Set Alarm
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SetAlarmScreen')}>
            <PlusIcon marginLeft={DimensionConstants.ten} />
          </TouchableOpacity>
        </View>
      </View>
    </MainBackground>
  );
};

export default AlarmScreen;
