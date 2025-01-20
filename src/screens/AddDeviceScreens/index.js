import {View, Text, Image} from 'react-native';
import React from 'react';
import MainBackground from '../../components/MainBackground';
import {ImageConstants} from '../../constants/ImageConstants';
import {height, width} from '../../constants/DimensionConstants';
import WatchIcon from '../../assets/icons/WatchIcon';
import CustomHeader from '../../components/CustomHeader';

const AddDeviceScreen = () => {
  return (
    <MainBackground noPadding>
      <Image
        source={ImageConstants.backgroundImage}
        style={{height: height, width: width, position: 'absolute'}}
      />
      <View style={{padding: 16}}>
        <CustomHeader skip/>

        <Text style={{fontSize: 32, fontWeight: '600'}}>Add device</Text>
        <Text style={{fontSize: 32, fontWeight: '600'}}>details</Text>

        <WatchIcon />
      </View>
    </MainBackground>
  );
};

export default AddDeviceScreen;
