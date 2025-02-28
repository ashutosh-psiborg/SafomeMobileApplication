import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  PermissionsAndroid,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import CallLogs from 'react-native-call-log';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import Loader from '../../../components/Loader';
import {ImageConstants} from '../../../constants/ImageConstants';
import CallIcon from '../../../assets/icons/CallIcon';
import PhoneIcon from '../../../assets/icons/PhoneIcon';
import CustomCard from '../../../components/CustomCard';
import HomeMidHeader from '../../../components/HomeMidHeader';
import Spacing from '../../../components/Spacing';

const CallsScreen = () => {
  const [callHistory, setCallHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Request permission
  const requestCallLogPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
          title: 'Call Log Permission',
          message: 'This app requires access to your call logs.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCallLogs = async () => {
    const hasPermission = await requestCallLogPermission();
    if (hasPermission) {
      try {
        const logs = await CallLogs.load(20);
        setCallHistory(logs);
      } catch (error) {
        console.error('Error fetching call logs:', error);
      }
    } else {
      console.log('Permission denied');
    }
    setLoading(false);
  };

  useEffect(() => {
    getCallLogs();
  }, []);

  const renderCallLog = ({item, index}) => (
    <View>
      <View key={item.id} style={styles.callContainer}>
        <View style={styles.rowContainer}>
          <Image
            source={ImageConstants.girlImage}
            style={styles.profileImage}
          />
          <View style={{marginLeft: DimensionConstants.ten}}>
            <Text style={{fontWeight: '500'}}>
              {item.name || item.phoneNumber}
            </Text>
            <View style={styles.rowContainer}>
              <CallIcon />
              <View style={styles.dot}></View>
              <Text style={styles.timestampText}>
                {' '}
                {new Date(parseInt(item.timestamp)).toLocaleString()}
              </Text>
            </View>
            <Text style={{color: item.type === 'MISSED' ? 'red' : 'green'}}>
              {item.type}
            </Text>
          </View>
        </View>
        <PhoneIcon marginRight={DimensionConstants.fifteen} />
      </View>
      {index !== callHistory.length - 1 && <View style={styles.separator} />}
    </View>
  );

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Calls'}
        backgroundColor={'#fff'}
        backPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <HomeMidHeader title={'Recent calls'} />
            <Spacing height={DimensionConstants.sixteen} />
            <CustomCard style={styles.card}>
              <FlatList
                data={callHistory}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCallLog}
                showsVerticalScrollIndicator={false}
              />
            </CustomCard>
          </>
        )}
      </View>
    </MainBackground>
  );
};

export default CallsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: DimensionConstants.sixteen,
  },
  callContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    height: DimensionConstants.fortyTwo,
    width: DimensionConstants.fortyTwo,
    borderRadius: DimensionConstants.twentyOne,
  },
  dot: {
    backgroundColor: '#8B8B8B',
    height: DimensionConstants.five,
    width: DimensionConstants.five,
    borderRadius: DimensionConstants.oneHundred,
    marginLeft: DimensionConstants.five,
  },
  timestampText: {
    color: '#8B8B8B',
    fontSize: DimensionConstants.twelve,
    fontWeight: '500',
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    height: DimensionConstants.two,
    width: DimensionConstants.twoHundredSixty,
    alignSelf: 'flex-end',
    marginVertical: DimensionConstants.five,
  },
  card: {
    flex: 1, // Makes sure it stays within the screen height
  },
});
