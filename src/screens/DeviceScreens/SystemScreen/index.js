import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import DeviceCallIcon from '../../../assets/icons/DeviceCallIcon';
import SleepIcon from '../../../assets/icons/SleepIcon';
import TrackingIcon from '../../../assets/icons/TrackingIcon';
import DisableIcon from '../../../assets/icons/DisableIcon';
import WifiIcon from '../../../assets/icons/WifiIcon';
import DNDIcon from '../../../assets/icons/DNDIcon';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import ScheduleIcon from '../../../assets/icons/ScheduleIcon';
import RemoteIcon from '../../../assets/icons/RemoteIcon';
import TimeZoneIcon from '../../../assets/icons/TimeZoneIcon';
import ResetIcon from '../../../assets/icons/ResetIcon';
import CustomCard from '../../../components/CustomCard';
import RightArrowIcon from '../../../assets/icons/RightArrowIcon';
import SystemLocation from '../../../assets/icons/SystemLocation';
import SystemCallIcon from '../../../assets/icons/SystemCallIcon';
import Spacing from '../../../components/Spacing';
const SystemScreen = ({navigation}) => {
  const icons = [
    {
      component: <SystemCallIcon />,
      label: 'Auto call answer',
      navigation: () => navigation.navigate('AutoCallScreen'),
    },
    {
      component: <SleepIcon />,
      label: 'Sleep mode',
      navigation: () => navigation.navigate('SleepModeScreen'),
    },
    {
      component: <TrackingIcon />,
      label: 'Tracking frequency',
      navigation: () => navigation.navigate('TrackingFrequencyScreen'),
    },
    {
      component: <DisableIcon />,
      label: 'Disable Functions',
      navigation: () => navigation.navigate('DisableFunctionScreen'),
    },
    {
      component: <WifiIcon />,
      label: 'Watch Wi-Fi settings',
      navigation: () => navigation.navigate('WifiSettingsScreen'),

    },
    {
      component: <DNDIcon />,
      label: 'DND',
      navigation: () => navigation.navigate('DNDScreen'),
    },
    {
      component: <ScheduleIcon />,
      label: 'Schedule Restart/Shutdown',
      navigation: () => navigation.navigate('ScheduleRestartScreen'),
    },
    {
      component: <RemoteIcon />,
      label: 'Remote Restart/Shutdown',
      navigation: () => navigation.navigate('RemoteRestartScreen'),
    },
    {
      component: <TimeZoneIcon />,
      label: 'Time zone',
      navigation: () => navigation.navigate('TimeZoneScreen'),
    },
    {
      component: <SystemLocation />,
      label: 'Location based service',
      navigation: () => navigation.navigate('LocationBasedServiceScreen'),
    },
    {
      component: <ResetIcon />,
      label: 'Reset device',
      navigation: () => navigation.navigate('ResetDeviceScreen'),
      line: 'no',
    },
  ];
  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader title={'System'} backgroundColor={'#FFFFFF'} />
      <View style={{padding: DimensionConstants.fifteen}}>
        <Spacing height={DimensionConstants.ten} />
        <CustomCard style={styles.featuresCard}>
          {icons.map((item, index) => (
            <View key={index}>
              <View style={styles.featureRow}>
                <View style={styles.featureContent}>
                  {item.component}
                  <Text style={styles.featureText}>{item.label}</Text>
                </View>
                <TouchableOpacity onPress={item.navigation}>
                  <RightArrowIcon color="black" marginRight={10} />
                </TouchableOpacity>
              </View>

              {item?.line !== 'no' && <View style={styles.separator} />}
            </View>
          ))}
        </CustomCard>
      </View>
    </MainBackground>
  );
};

export default SystemScreen;

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  featuresCard: {
    paddingRight: 0,
    borderRadius: DimensionConstants.twelve,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    height: DimensionConstants.one,
    width: '90%',
    alignSelf: 'flex-end',
    marginVertical: DimensionConstants.ten,
  },
});
