import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import Spacing from '../../../../components/Spacing';
import CustomButton from '../../../../components/CustomButton';
import RadioButtonCard from '../../../../components/RadioButtonCard';
import {DimensionConstants} from '../../../../constants/DimensionConstants';

const TrackingFrequencyScreen = ({navigation}) => {
  const [selected, setSelected] = useState(0);

  const trackingOptions = [
    {label: 'Update every 10 minutes'},
    {label: 'Update every hour'},
    {label: 'Update location manually', line: 'no'},
  ];

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title="Tracking Frequency"
        backgroundColor="#ffffff"
        backPress={() => navigation.goBack()}
      />
      <Spacing height={DimensionConstants.ten} />
      <View style={styles.container}>
        <RadioButtonCard
          data={trackingOptions}
          onSelect={setSelected}
          selected={selected}
        />
        <CustomButton text="Save" onPress={() => navigation.goBack()} />
      </View>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    padding: DimensionConstants.fifteen,
    justifyContent: 'space-between',
    flex: 1,
  },
});

export default TrackingFrequencyScreen;
