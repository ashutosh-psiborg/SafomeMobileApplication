import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import InfoCard from '../../../../components/InfoCard';
import {DimensionConstants} from '../../../../constants/DimensionConstants';

const SleepModeScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Sleep mode'}
        backgroundColor={'#fff'}
        backPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <InfoCard
          title="Sleep mode"
          description="The watch will save power & disconnect from all network between 22:00 - 06:00"
          isEnabled={isEnabled}
          onToggle={toggleSwitch}
        />
      </View>
    </MainBackground>
  );
};

export default SleepModeScreen;

const styles = StyleSheet.create({
  container: {
    padding: DimensionConstants.sixteen,
  },
});
