import {View, Text} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import RadioButtonCard from '../../../components/RadioButtonCard';
import {DimensionConstants} from '../../../constants/DimensionConstants';
const DeleteNotificationScreen = () => {
  const [selected, setSelected] = useState(null);
  const deleteOptions = [
    {label: 'Today'},
    {label: 'Last 24 hours'},
    {label: 'Last week'},
    {label: 'All', line: 'no'},
  ];
  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader title="Delete" backgroundColor="#ffffff" />
      <View style={{padding: DimensionConstants.sixteen}}>
        <RadioButtonCard
          data={deleteOptions}
          onSelect={setSelected}
          selected={selected}
        />
      </View>
    </MainBackground>
  );
};

export default DeleteNotificationScreen;
