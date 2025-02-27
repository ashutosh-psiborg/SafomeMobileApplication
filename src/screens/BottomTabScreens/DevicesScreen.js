import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import MainBackground from '../../components/MainBackground';
import LogoHeader from '../../components/LogoHeader';
import BlackWatchIcon from '../../assets/icons/BlackWatchIcon';
import CustomCard from '../../components/CustomCard';
import CustomButton from '../../components/CustomButton';
import Spacing from '../../components/Spacing';
import {DimensionConstants} from '../../constants/DimensionConstants';
import DownArrowIcon from '../../assets/icons/DownArrowIcon';
import {useSelector} from 'react-redux';
import DeviceCallIcon from '../../assets/icons/DeviceCallIcon';
import FitnessIcon from '../../assets/icons/FitnessIcon';
import AppsIcon from '../../assets/icons/AppsIcon';
import SystemIcon from '../../assets/icons/SystemIcon';
import FeaturesIcon from '../../assets/icons/FeaturesIcon';
import RightArrowIcon from '../../assets/icons/RightArrowIcon';

const DevicesScreen = ({navigation}) => {
  const icons = [
    {
      component: <DeviceCallIcon />,
      label: 'Calls',
    },
    {
      component: <FitnessIcon />,
      label: 'Fitness & Health',
      navigation: () => navigation.navigate('FitnessScreen'),
    },
    {
      component: <AppsIcon />,
      label: 'Apps',
      navigation: () => navigation.navigate('AppScreen'),
    },
    {
      component: <SystemIcon />,
      label: 'System',
      navigation: () => navigation.navigate('SystemScreen'),
    },
    {
      component: <FeaturesIcon />,
      navigation: () => navigation.navigate('FeaturesScreens'),
      label: 'Features',
      line: 'no',
    },
  ];

  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  return (
    <MainBackground style={styles.mainBackground}>
      <LogoHeader onPress={ () => navigation.navigate('NotificationScreen')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Spacing height={DimensionConstants.twentyFour} />

          <CustomCard style={styles.deviceCard}>
            <View style={styles.deviceHeader}>
              <BlackWatchIcon />
              <Spacing width={DimensionConstants.thirty} />
              <View>
                <View style={styles.deviceRow}>
                  <Text style={styles.deviceName}>Device name</Text>
                  <DownArrowIcon marginLeft={DimensionConstants.twelve} />
                </View>

                <View style={styles.deviceRow}>
                  <Text style={styles.label}>Signal :</Text>
                  <Text style={[styles.value, {color: theme.primary}]}>
                    Medium
                  </Text>
                </View>

                <View style={styles.deviceRow}>
                  <Text style={styles.label}>Battery :</Text>
                  <Text style={[styles.value, {color: theme.primary}]}>
                    98%
                  </Text>
                </View>

                <CustomButton
                  text={'Sync'}
                  color={'#F4D9DC'}
                  height={DimensionConstants.thirtyFive}
                  width={DimensionConstants.eighty}
                  textColor={'#FE605D'}
                />
              </View>
            </View>
            <CustomButton text={'Edit'} />
          </CustomCard>

          <Spacing height={DimensionConstants.eighteen} />

          <CustomCard style={styles.featuresCard}>
            {icons.map((item, index) => (
              <View key={index}>
                <View style={styles.featureRow}>
                  <View style={styles.featureContent}>
                    {item.component}
                    <Text style={styles.featureText}>{item.label}</Text>
                  </View>
                  <TouchableOpacity onPress={item.navigation}>
                    <RightArrowIcon color="black" />
                  </TouchableOpacity>
                </View>

                {item?.line !== 'no' && <View style={styles.separator} />}
              </View>
            ))}
          </CustomCard>
        </View>
      </ScrollView>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    justifyContent: 'space-between',
  },
  deviceCard: {
    padding: DimensionConstants.twentyFour,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceName: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '500',
    lineHeight: DimensionConstants.thirty,
  },
  label: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.6)',
    lineHeight: DimensionConstants.twentyTwo,
  },
  value: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    marginLeft: DimensionConstants.ten,
  },
  featuresCard: {
    paddingRight: 0,
    borderRadius: DimensionConstants.twelve,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: DimensionConstants.ten,
    justifyContent: 'space-between',
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: DimensionConstants.twenty,
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    height: DimensionConstants.two,
    width: '90%',
    alignSelf: 'flex-end',
    marginVertical: DimensionConstants.ten,
  },
});

export default DevicesScreen;
