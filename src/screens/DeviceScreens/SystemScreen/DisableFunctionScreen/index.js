import {View, Text} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import InfoCard from '../../../../components/InfoCard';
import Spacing from '../../../../components/Spacing';

const DisableFunctionScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Disable Function'}
        backgroundColor={'#ffffff'}
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.sixteen}}>
        <InfoCard
          title={'Dialpad'}
          description={'When on dial pad is enable'}
          isEnabled={isEnabled}
          onToggle={toggleSwitch}
        />
        <Spacing height={DimensionConstants.ten} />
        <InfoCard
          title={'GPS'}
          description={'When on GPS is enable'}
          isEnabled={isEnabled}
          onToggle={toggleSwitch}
        />
      </View>
    </MainBackground>
  );
};

export default DisableFunctionScreen;
