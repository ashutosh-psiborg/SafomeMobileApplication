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
import BumpFriendsIcon from '../../../assets/icons/BumpFriendsIcon';
import WatchIcon from '../../../assets/icons/WatchIcon';
import BlackWatchIcon from '../../../assets/icons/BlackWatchIcon';
import AddRemoteIcon from '../../../assets/icons/AddRemoteIcon';
import CameraIcon from '../../../assets/icons/CameraIcon';
import AppsIcon from '../../../assets/icons/AppsIcon';
import SmsIcon from '../../../assets/icons/SmsIcon';
import NotificationIcon from '../../../assets/icons/NotificationIcon';
import SimIcon from '../../../assets/icons/SimIcon';
import RejectUnknownIcon from '../../../assets/icons/RejectUnknownIcon';
import FindDeviceIcon from '../../../assets/icons/FindDeviceIcon';
import ProfileNotificationIcon from '../../../assets/icons/ProfileNotificationIcon';
import FallIcon from '../../../assets/icons/FallIcon';
import CallIcon from '../../../assets/icons/CallIcon';
import DeviceCallIcon from '../../../assets/icons/DeviceCallIcon';
const FeaturesScreens = ({navigation}) => {
  const icons = [
    {
      component: <AddRemoteIcon />,
      label: 'Add SOS Contacts',
      navigation: () => navigation.navigate('AddSosContact'),
    },
    {
      component: <BumpFriendsIcon />,
      label: 'Add Contacts',
      navigation: () => navigation.navigate('AddContact'),
    },
    {
      component: <FallIcon />,
      label: 'Fall Alert',
      navigation: () => navigation.navigate('FallBackAlert'),
    },
    // {
    //   component: <AddRemoteIcon />,
    //   label: 'Watch faces',
    //   // navigation: () => navigation.navigate('SleepModeScreen'),
    // },
    // {
    //   component: <CameraIcon />,
    //   label: 'Remote photos',
    //   // navigation: () => navigation.navigate('TrackingFrequencyScreen'),
    // },
    // {
    //   component: <AppsIcon />,
    //   label: 'App store',
    //   // navigation: () => navigation.navigate('DisableFunctionScreen'),
    // },
    {
      component: <FindDeviceIcon />,
      label: 'Find device',
      navigation: () => navigation.navigate('FindDevice'),
    },
    {
      component: <SmsIcon />,
      label: 'SMS alerts',
      navigation: () => navigation.navigate('SmsAlertScreen'),
    },
    {
      component: <ProfileNotificationIcon />,
      label: 'Reminders',
      navigation: () => navigation.navigate('RemindersScreen'),
    },
    {
      component: <DeviceCallIcon />,
      label: 'Call & Monitoring',
      navigation: () => navigation.navigate('SoundGuardian'),
    },
    {
      component: <RejectUnknownIcon />,
      label: 'Reject unknown calls',
      navigation: () => navigation.navigate('RejectCallScreen'),
      line: 'no',
    },
  ];
  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title={'More'}
        backgroundColor={'#FFFFFF'}
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.fifteen}}>
        <Spacing height={DimensionConstants.ten} />
        <CustomCard style={styles.featuresCard}>
          {icons.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={item.navigation}
                style={styles.featureRow}>
                <View style={styles.featureContent}>
                  {item.component}
                  <Text style={styles.featureText}>{item.label}</Text>
                </View>
                <RightArrowIcon
                  color="black"
                  marginRight={DimensionConstants.twenty}
                />
              </TouchableOpacity>
              {item?.line !== 'no' && <View style={styles.separator} />}
            </View>
          ))}
        </CustomCard>
      </View>
    </MainBackground>
  );
};

export default FeaturesScreens;

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
