import {View, TextInput} from 'react-native';
import React from 'react';
import MainBackground from '../../components/MainBackground';
import CustomHeader from '../../components/CustomHeader';
import SearchIcon from '../../assets/icons/SearchIcon';
import CustomCard from '../../components/CustomCard';
import {DimensionConstants} from '../../constants/DimensionConstants';

const SavioursScreen = () => {
  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader title={'Saviours'} backgroundColor={'#fff'} />
      <View style={{padding: DimensionConstants.sixteen}}>
        <CustomCard style={{padding: 0}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: DimensionConstants.five,
              paddingHorizontal: DimensionConstants.fifteen,
            }}>
            <SearchIcon />
            <TextInput
              style={{
                flex: 1,
                marginLeft: DimensionConstants.eight,
                fontSize: 16,
              }}
              placeholder="Search here..."
              placeholderTextColor="#888"
            />
          </View>
        </CustomCard>
      </View>
    </MainBackground>
  );
};

export default SavioursScreen;
