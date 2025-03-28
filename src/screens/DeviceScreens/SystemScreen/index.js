import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
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
import {useSelector} from 'react-redux';
import AlarmIcon from '../../../assets/icons/AlarmIcon';
const SystemScreen = ({navigation}) => {
  const {appStrings} = useSelector(state => state.language);

  const icons = [
    {
      component: <SystemCallIcon />,
      label: appStrings?.system?.autoCallAnswer?.text,
      navigation: () => navigation.navigate('AutoCallScreen'),
    },
    // {
    //   component: <SleepIcon />,
    //   label: appStrings?.system?.sleepMode?.text,
    //   navigation: () => navigation.navigate('SleepModeScreen'),
    // },
    {
      component: <AlarmIcon />,
      label: 'Alarm',
      navigation: () => navigation.navigate('AlarmScreen'),
    },
    {
      component: <TrackingIcon />,
      label: 'Tracking frequency',
      navigation: () => navigation.navigate('TrackingFrequencyScreen'),
    },
    {
      component: <DisableIcon />,
      label: 'Device Alert Mode',
      navigation: () => navigation.navigate('DisableFunctionScreen'),
    },
    {
      component: <WifiIcon />,
      label: appStrings?.system?.watchWifi?.text,
      navigation: () => navigation.navigate('WifiSettingsScreen'),
    },
    {
      component: <DNDIcon />,
      label: appStrings?.system?.dnd?.text,
      navigation: () => navigation.navigate('DNDScreen'),
    },
    // {
    //   component: <ScheduleIcon />,
    //   label: 'Schedule Restart/Shutdown',
    //   navigation: () => navigation.navigate('ScheduleRestartScreen'),
    // },
    {
      component: <RemoteIcon />,
      label: appStrings?.system?.remoteRestart?.text,
      navigation: () => navigation.navigate('RemoteRestartScreen'),
      // line: 'no',
    },
    // {
    //   component: <TimeZoneIcon />,
    //   label: 'Time zone',
    //   navigation: () => navigation.navigate('TimeZoneScreen'),
    // },
    // {
    //   component: <SystemLocation />,
    //   label: 'Location based service',
    //   navigation: () => navigation.navigate('LocationBasedServiceScreen'),
    // },
    {
      component: <ResetIcon />,
      label: appStrings?.system?.resetDevice?.text,
      navigation: () => navigation.navigate('ResetDeviceScreen'),
      line: 'no',
    },
  ];
  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title={appStrings?.system?.title.text}
        backgroundColor={'#FFFFFF'}
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.fifteen}}>
        <Spacing height={DimensionConstants.ten} />
        <CustomCard style={styles.featuresCard}>
          {icons.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.featureRow}
                onPress={item.navigation}>
                <TouchableOpacity
                  style={styles.featureContent}
                  onPress={item.navigation}>
                  {item.component}
                  <Text style={styles.featureText}>{item.label}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={item.navigation}>
                  <RightArrowIcon color="black" marginRight={10} />
                </TouchableOpacity>
              </TouchableOpacity>

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
