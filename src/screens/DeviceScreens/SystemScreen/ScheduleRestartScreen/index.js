import {View, Text} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import InfoCard from '../../../../components/InfoCard';
import Spacing from '../../../../components/Spacing';
import {DimensionConstants} from '../../../../constants/DimensionConstants';

const ScheduleRestartScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isOn, setIsOn] = useState(true);

  const toggleSwitch = () => setIsEnabled(prevState => !prevState);
  const onSwitch = () => setIsOn(prevState => !prevState);

  return (
    <MainBackground
      noPadding
      style={{
        backgroundColor: '#F2F7FC',
      }}>
      <CustomHeader
        title={'Schedule Restart/Shutdown'}
        backgroundColor={'#fff'}
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.sixteen}}>
        <InfoCard
          title={'Shutdown'}
          description={'12:00 PM'}
          isEnabled={isEnabled}
          onToggle={toggleSwitch}
        />
        <Spacing height={DimensionConstants.ten} />
        <InfoCard
          title={'Restart'}
          description={'12:00 PM'}
          isEnabled={isOn}
          onToggle={onSwitch}
        />
      </View>
    </MainBackground>
  );
};

export default ScheduleRestartScreen;
