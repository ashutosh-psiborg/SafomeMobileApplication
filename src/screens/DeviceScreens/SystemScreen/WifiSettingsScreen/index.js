import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import WifiIcon from '../../../../assets/icons/WifiIcon';
import CustomCard from '../../../../components/CustomCard';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import Spacing from '../../../../components/Spacing';

const WifiSettingsScreen = ({navigation}) => {
  const [wifiList, setWifiList] = useState([]);
  const [connectedSSID, setConnectedSSID] = useState(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs location access to scan Wi-Fi networks.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await scanWifi();
        await getCurrentWifi();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const scanWifi = async () => {
    try {
      const networks = await WifiManager.loadWifiList();
      const uniqueNetworks = Object.values(
        networks.reduce((acc, item) => {
          if (!acc[item.SSID] || acc[item.SSID].level < item.level) {
            acc[item.SSID] = item;
          }
          return acc;
        }, {}),
      );
      setWifiList(uniqueNetworks);
    } catch (error) {
      console.error('Error scanning Wi-Fi networks:', error);
    }
  };

  const getCurrentWifi = async () => {
    try {
      const ssid = await WifiManager.getCurrentWifiSSID();
      setConnectedSSID(ssid);
    } catch (error) {
      console.error('Error getting connected Wi-Fi:', error);
    }
  };

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title="Wi-Fi Settings"
        backgroundColor="#FFF"
        backPress={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <CustomCard style={styles.cardPadding}>
            <View style={styles.headerRow}>
              <WifiIcon />
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>Watch Wi-Fi settings</Text>
                <Text style={styles.descriptionText}>
                  Device can connect to Wi-Fi. Click detect to detect to connect
                  to pre-set Wi-Fi.
                </Text>
              </View>
            </View>
          </CustomCard>
          <Spacing height={DimensionConstants.ten} />
          <CustomCard>
            <FlatList
              data={wifiList}
              keyExtractor={item => item.BSSID || item.SSID}
              renderItem={({item}) => (
                <View>
                  <View style={styles.wifiRow}>
                    <View style={styles.rowAlign}>
                      <WifiIcon />
                      <Text style={styles.wifiText}>{item.SSID}</Text>
                    </View>
                    {connectedSSID === item.SSID ? (
                      <Text style={styles.connectedText}>Connected</Text>
                    ) : (
                      <Text style={styles.notConnectedText}>Not connected</Text>
                    )}
                  </View>
                  <Spacing height={DimensionConstants.ten} />
                </View>
              )}
            />
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
    padding: DimensionConstants.sixteen,
  },
  cardPadding: {
    padding: DimensionConstants.ten,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    marginHorizontal: DimensionConstants.ten,
  },
  titleText: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: DimensionConstants.twelve,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.5)',
    flexWrap: 'wrap',
  },
  wifiRow: {
    padding: DimensionConstants.ten,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F7FC',
    borderRadius: DimensionConstants.twelve,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wifiText: {
    fontSize: 16,
    marginLeft: 8,
  },
  connectedText: {
    color: '#0279E1',
    fontWeight: '500',
  },
  notConnectedText: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '500',
  },
});

export default WifiSettingsScreen;
