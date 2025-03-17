import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import RadioButtonCard from '../../../../../components/RadioButtonCard';
import CustomButton from '../../../../../components/CustomButton';

import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import {changeLanguage} from '../../../../../redux/slices/languageSlice';

const LanguageScreen = ({navigation}) => {
  const [selected, setSelected] = useState(0);
  const dispatch = useDispatch();
  const {appStrings} = useSelector(state => state.language);

  const languageOptions = [
    {label: 'English', code: 'en'},
    {label: 'Hindi', code: 'hi'},
    {label: 'Tamil', code: 'ta'},
    {label: 'Punjabi', code: 'pa'},
    {label: 'Bangla', code: 'bn'},
    {label: 'Gujarati', code: 'gu'},
    {label: 'Odia', code: 'or'},
    {label: 'Telugu', code: 'te'},
    {label: 'Bhojpuri', code: 'bho'}, 
  ];

  useEffect(() => {
    const loadLang = async () => {
      const langCode = await AsyncStorage.getItem('languageKey');
      if (langCode) {
        const index = languageOptions.findIndex(l => l.code === langCode);
        if (index !== -1) setSelected(index);
      }
    };
    loadLang();
  }, []);

  const handleSave = async () => {
    const selectedLang = languageOptions[selected];
    await dispatch(changeLanguage(selectedLang.code));
    navigation.goBack();
  };

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={appStrings['Language'] || 'Language'}
        backgroundColor="#ffffff"
        backPress={() => navigation.goBack()}
      />
      <View
        style={{
          padding: DimensionConstants.sixteen,
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <RadioButtonCard
          data={languageOptions.map(l => ({label: l.label}))}
          onSelect={setSelected}
          selected={selected}
        />
        <CustomButton
          text={appStrings['Save'] || 'Save'}
          onPress={handleSave}
        />
      </View>
    </MainBackground>
  );
};

export default LanguageScreen;
