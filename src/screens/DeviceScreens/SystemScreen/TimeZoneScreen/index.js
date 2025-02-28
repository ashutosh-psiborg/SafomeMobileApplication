import {View, Text, Switch, ScrollView} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import RadioButtonCard from '../../../../components/RadioButtonCard';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import Spacing from '../../../../components/Spacing';
const TimeZoneScreen = ({navigation}) => {
  const [selected, setSelected] = useState(0);
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = () => setIsEnabled(prevState => !prevState);

  const trackingOptions = [
    {label: 'East: GMT+12:00'},
    {label: 'East: GMT+12:00'},
    {label: 'East: GMT+12:00'},
    {label: 'East: GMT+12:00'},
    {label: 'East: GMT+12:00'},
    {label: 'East: GMT+12:00'},
    {label: 'East: GMT+12:00'},
    {label: 'East: GMT+12:00'},
    {label: 'East: GMT+12:00', line: 'no'},
  ];
  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Time zone'}
        backgroundColor={'#ffffff'}
        backPress={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{padding: DimensionConstants.sixteen}}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#fff',
              padding: DimensionConstants.ten,
              borderRadius: DimensionConstants.ten,
            }}>
            <Text
              style={{
                fontSize: DimensionConstants.fourteen,
                fontWeight: '500',
              }}>
              Set time automatically
            </Text>
            <Switch
              value={isEnabled}
              onValueChange={toggleSwitch}
              trackColor={{false: '#ccc', true: 'rgba(0, 91, 187, 0.1)'}}
              thumbColor={isEnabled ? '#0279E1' : '#f4f3f4'}
            />
          </View>
          <Spacing height={DimensionConstants.ten} />
          <RadioButtonCard
            data={trackingOptions}
            onSelect={setSelected}
            selected={selected}
          />
        </View>
      </ScrollView>
    </MainBackground>
  );
};

export default TimeZoneScreen;
