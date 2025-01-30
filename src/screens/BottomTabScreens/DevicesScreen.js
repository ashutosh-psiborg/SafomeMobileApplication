import {View, Text} from 'react-native';
import React from 'react';
import MainBackground from '../../components/MainBackground';
import LogoHeader from '../../components/LogoHeader';
import BlackWatchIcon from '../../assets/icons/BlackWatchIcon';
import CustomCard from '../../components/CustomCard';

const DevicesScreen = () => {
  return (
    <MainBackground style={{backgroundColor: '#F2F7FC'}}>
      <LogoHeader />
      <CustomCard>
        <BlackWatchIcon />
      </CustomCard>
    </MainBackground>
  );
};

export default DevicesScreen;
