import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import InfoCard from '../../../../components/InfoCard';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import {useSelector} from 'react-redux';
const AutoCallScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);
  const {appStrings} = useSelector(state => state.language);

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={appStrings?.system?.autoCallAnswer?.text}
        backgroundColor={'#fff'}
        backPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <InfoCard
          title={appStrings?.system?.autoCallAnswer?.text}
          description={appStrings?.system?.autoCallDescription?.text}
          isEnabled={isEnabled}
          onToggle={toggleSwitch}
        />
      </View>
    </MainBackground>
  );
};

export default AutoCallScreen;

const styles = StyleSheet.create({
  container: {
    padding: DimensionConstants.sixteen,
  },
});
