import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import MainBackground from '../../../components/MainBackground';
import Spacing from '../../../components/Spacing';
import AddressIcon from '../../../assets/icons/AddressIcon';
import {useSelector} from 'react-redux';
import CardStack from '../../../components/CardStack';
import LogoHeader from '../../../components/LogoHeader';
import HomeMidHeader from '../../../components/HomeMidHeader';
import RefreshIcon from '../../../assets/icons/RefreshIcon';
import {HomeScreenStyles} from './Styles/HomeScreenStyles';
import StatisticsCards from '../../../components/StatisticsCards';
import ContactCards from '../../../components/ContactCards';
import FilterContainer from '../../../components/FilterContainer';
import {useQuery} from '@tanstack/react-query';
import fetcher from '../../../utils/ApiService';
import Loader from '../../../components/Loader'; // Import your Loader component

const HomeScreen = ({navigation}) => {
  const [expanded, setExpanded] = useState(false);
  const [location, setLocation] = useState(null);
  const [selected, setSelected] = useState('Week');
  const options = ['Today', 'Week', 'Month', 'All Time'];
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = HomeScreenStyles(theme);
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['fitness', selected],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/fitness-health/6907390711?range=${selected.toLowerCase()}`,
      }),
  });


  if (isLoading) {
    return (
      <MainBackground style={{backgroundColor: theme.otpBox}}>
        <Loader />
      </MainBackground>
    );
  }

  return (
    <MainBackground style={{backgroundColor: theme.otpBox}}>
      <LogoHeader onPress={() => navigation.navigate('NotificationScreen')} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacing height={ DimensionConstants.twentyFour } />
        
        <View style={styles.addressContainer}>
          <View style={styles.rowContainer}>
            <AddressIcon />
            <Text style={styles.placeText}>Sector 137 , lets connect</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text
              style={{
                fontSize: DimensionConstants.twelve,
                fontWeight: '500',
                color: 'rgba(0, 0, 0, 0.5)',
                marginRight: DimensionConstants.ten,
              }}>
              Refresh
            </Text>
            <TouchableOpacity>
              <RefreshIcon />
            </TouchableOpacity>
          </View>
        </View>
        <Spacing height={DimensionConstants.fifteen} />
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location ? location.latitude : 28.50704765,
              longitude: location ? location.longitude : 77.40246858,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker
              coordinate={
                location
                  ? location
                  : {latitude: 28.50703231, longitude: 77.40216977}
              }
              title="Your Location"
            />
          </MapView>
        </View>

        <Spacing height={DimensionConstants.twentyFour} />
        <HomeMidHeader title={'Statistics'} showViewAll={false} />
        <Spacing height={DimensionConstants.twenty} />
        <FilterContainer
          options={options}
          selected={selected}
          onSelect={setSelected}
          theme={theme}
        />
        <StatisticsCards data={data} />
        <Spacing height={DimensionConstants.twentyFour} />
        <HomeMidHeader
          title={'Recent Notifications'}
          onPress={() => setExpanded(!expanded)}
        />

        <CardStack expanded={expanded} />
        <Spacing height={DimensionConstants.twentyFour} />

        <HomeMidHeader title={'My contacts'} />
        <Spacing height={DimensionConstants.ten} />

        <ContactCards />
      </ScrollView>
    </MainBackground>
  );
};

export default HomeScreen;
