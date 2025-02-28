import {View, Text} from 'react-native';
import React from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import WatchIcon from '../../../assets/icons/WatchIcon';
import CustomButton from '../../../components/CustomButton';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import Spacing from '../../../components/Spacing';

const PairNewDeviceScreen = ({navigation}) => {
  return (
    <MainBackground style={{backgroundColor: '#F2F7FC'}} noPadding>
      <CustomHeader
        title={'Pair new device'}
        backgroundColor={ '#Ffffff' }
        backPress={() => navigation.goBack()}

      />
      <Spacing height={DimensionConstants.oneHundred} />
      <View
        style={{
          padding: DimensionConstants.twenty,
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View style={{alignItems: 'center'}}>
          <WatchIcon />
          <Spacing height={DimensionConstants.twentyFour} />

          <Text
            style={{
              color: 'rgba(0, 0, 0, 0.6)',
              fontWeight: '500',
              fontSize: DimensionConstants.fourteen,
            }}>
            You are all set now
          </Text>
        </View>
        <CustomButton
          text={'Go to home'}
          onPress={() => navigation.navigate('MainApp')}
        />
      </View>
    </MainBackground>
  );
};

export default PairNewDeviceScreen;
