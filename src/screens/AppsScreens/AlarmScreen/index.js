import {View, Text, TouchableOpacity, Switch} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import PlusIcon from '../../../assets/icons/PlusIcon';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import ThreeDots from '../../../assets/icons/ThreeDots';
import Spacing from '../../../components/Spacing';

const AlarmScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);

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
        {[0, 1, 2].map(item => (
          <View>
            <Spacing height={DimensionConstants.eighteen} />
            <View
              style={{
                backgroundColor: '#fff',
                borderTopRightRadius: DimensionConstants.ten,
                borderTopLeftRadius: DimensionConstants.ten,
                paddingVertical: DimensionConstants.ten,
                paddingHorizontal: DimensionConstants.sixteen,
              }}>
              <Text
                style={{
                  fontSize: DimensionConstants.fourteen,
                  fontWeight: '500',
                }}>
                Scheduled Alarm
              </Text>
              <Spacing height={DimensionConstants.twelve} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: DimensionConstants.twentyFour,
                    fontWeight: '500',
                  }}>
                  5:30 AM
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Switch
                    value={isEnabled}
                    onValueChange={toggleSwitch}
                    trackColor={{false: '#ccc', true: 'rgba(0, 91, 187, 0.1)'}}
                    thumbColor={isEnabled ? '#0279E1' : '#f4f3f4'}
                  />
                  <ThreeDots />
                </View>
              </View>
            </View>
            <View
              style={{
                backgroundColor: 'rgba(255, 49, 12, 0.1)',
                paddingVertical: DimensionConstants.ten,
                paddingHorizontal: DimensionConstants.sixteen,
                borderBottomRightRadius: DimensionConstants.ten,
                borderBottomLeftRadius: DimensionConstants.ten,
              }}>
              <Text
                style={{
                  fontSize: DimensionConstants.fourteen,
                  letterSpacing: DimensionConstants.two,
                  color: '#979797',
                }}>
                S M{' '}
                <Text
                  style={{
                    fontSize: DimensionConstants.fourteen,
                    fontWeight: '500',
                    letterSpacing: DimensionConstants.two,
                    color: '#0279E1',
                  }}>
                  T W T
                </Text>{' '}
                F S
              </Text>
            </View>
          </View>
        ))}
      </View>
    </MainBackground>
  );
};

export default AlarmScreen;
