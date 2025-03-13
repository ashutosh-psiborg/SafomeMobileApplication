import React, {useEffect, useState} from 'react';
import {View, Text, Switch, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {translateLabels} from '../../../../../redux/slices/languageSlice';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import CustomCard from '../../../../../components/CustomCard';
import Spacing from '../../../../../components/Spacing';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import RightArrowIcon from '../../../../../assets/icons/RightArrowIcon';

const NotificationsScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(prev => !prev);

  const {appStrings} = useSelector(state => state.language);
  console.log('appsstrings', appStrings);
  return (
    <MainBackground style={styles.mainBackground} noPadding>
      <CustomHeader
        title={appStrings.notification.title.text}
        backgroundColor="#ffffff"
        backPress={() => navigation.goBack()}
      />
      <Spacing height={DimensionConstants.eight} />
      <View style={styles.container}>
        <CustomCard style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>
              {appStrings.notification.enableNotifications.text}
            </Text>
            <Switch
              value={isEnabled}
              onValueChange={toggleSwitch}
              trackColor={{false: '#ccc', true: 'rgba(0, 91, 187, 0.1)'}}
              thumbColor={isEnabled ? '#0279E1' : '#f4f3f4'}
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>
              {appStrings.notification.pauseNotifications.text}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('PauseNotificationScreen')}>
              <RightArrowIcon
                color="black"
                marginRight={DimensionConstants.ten}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>
              {appStrings.notification.deleteNotifications.text}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('DeleteNotificationScreen')}>
              <RightArrowIcon
                color="black"
                marginRight={DimensionConstants.ten}
              />
            </TouchableOpacity>
          </View>
        </CustomCard>
      </View>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    padding: DimensionConstants.sixteen,
  },
  card: {
    padding: 0,
    borderRadius: DimensionConstants.twelve,
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: DimensionConstants.fifteen,
    paddingVertical: DimensionConstants.ten,
  },
  settingText: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  separator: {
    backgroundColor: '#F2F2F2',
    width: '100%',
    height: DimensionConstants.one,
  },
});

export default NotificationsScreen;
