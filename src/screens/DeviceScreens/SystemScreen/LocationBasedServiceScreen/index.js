import {View, Text} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import InfoCard from '../../../../components/InfoCard';
const LocationBasedServiceScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Location based services'}
        backgroundColor={'#fff'}
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.sixteen}}>
        <InfoCard
          title={'Location based services'}
          description={'Get the estimated accuracy of the location'}
          isEnabled={isEnabled}
          onToggle={toggleSwitch}
        />
      </View>
    </MainBackground>
  );
};

export default LocationBasedServiceScreen;
