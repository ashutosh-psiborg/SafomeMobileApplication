import {View, Text} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../../../components/MainBackground';
import RadioButtonCard from '../../../../../components/RadioButtonCard';
import CustomHeader from '../../../../../components/CustomHeader';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
const LanguageScreen = () => {
  const [selected, setSelected] = useState(0);

  const languageOptions = [{label: 'English'}, {label: 'Australian English'}];
  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader title={'Language'} backgroundColor="#ffffff" />
      <View style={{padding: DimensionConstants.sixteen}}>
        <RadioButtonCard
          data={languageOptions}
          onSelect={setSelected}
          selected={selected}
        />
      </View>
    </MainBackground>
  );
};

export default LanguageScreen;
