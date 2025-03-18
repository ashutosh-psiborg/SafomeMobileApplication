import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import InfoCard from '../../../../components/InfoCard';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import {useSelector} from 'react-redux';

const SleepModeScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);
  const {appStrings} = useSelector(state => state.language);

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={appStrings?.system?.sleepMode?.text}
        backgroundColor={'#fff'}
        backPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <InfoCard
          title={appStrings?.system?.sleepMode?.text}
          description={`${appStrings?.system?.sleepModeDescription?.text} 22:00 - 06:00`}
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
