import {View, Text} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import RadioButtonCard from '../../../../../components/RadioButtonCard';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
const PauseNotificationScreen = ({navigation}) => {
  const [selected, setSelected] = useState(null);
  const pauseOptions = [
    {label: 'Pause for Today'},
    {label: 'Next 24 hours'},
    {label: 'Next week'},
    {label: 'Custom', line: 'no'},
  ];
  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title="Pause notifications"
        backgroundColor="#ffffff"
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.sixteen}}>
        <RadioButtonCard
          data={pauseOptions}
          onSelect={setSelected}
          selected={selected}
        />
      </View>
    </MainBackground>
  );
};

export default PauseNotificationScreen;
