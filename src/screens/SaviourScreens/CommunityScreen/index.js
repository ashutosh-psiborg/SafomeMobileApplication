import {View, Text} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import PlusIcon from '../../../assets/icons/PlusIcon';
import {DimensionConstants} from '../../../constants/DimensionConstants';

const CommunityScreen = () => {
  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        backgroundColor={'#fff'}
        title={'My communities'}
        icon={<PlusIcon marginRight={DimensionConstants.ten} />}
      />
      <View></View>
    </MainBackground>
  );
};

export default CommunityScreen;
