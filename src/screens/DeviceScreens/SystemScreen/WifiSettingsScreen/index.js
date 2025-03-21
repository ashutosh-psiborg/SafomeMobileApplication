import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import WifiIcon from '../../../../assets/icons/WifiIcon';
import CustomCard from '../../../../components/CustomCard';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import Spacing from '../../../../components/Spacing';
import {useMutation, useQuery} from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';

const WifiSettingsScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedWifi, setSelectedWifi] = useState(null);
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const encodeToHex = str =>
    str
      .split('')
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');

  const wifiMutation = useMutation({
    mutationFn: async () => {
      return fetcher({
        method: 'POST',
        url: '/deviceDataResponse/sendEvent/6907390711',
        data: {data: '[WIFISEARCH]'},
      });
    },
    onSuccess: () => {
      console.log('WiFi search triggered');
      refetch();
    },
    onError: error => {
      console.error('Failed to trigger WiFi search', error);
    },
  });

  const currentWifiMutation = useMutation({
    mutationFn: async () => {
      return fetcher({
        method: 'POST',
        url: '/deviceDataResponse/sendEvent/6907390711',
        data: {data: '[WIFICUR]'},
      });
    },
    onSuccess: () => {
      console.log('Current WiFi check triggered');
      currentDataRefetch();
    },
    onError: error => {
      console.error('Current WiFi fetch failed', error);
    },
  });

  const connectToWifi = useMutation({
    mutationFn: async ({ssidHex, passwordHex, mac}) => {
      const payload = `[WIFISET,${ssidHex},${passwordHex},${mac}]`;
      return fetcher({
        method: 'POST',
        url: '/deviceDataResponse/sendEvent/6907390711',
        data: {data: payload},
      });
    },
    onSuccess: response => {
      setModalVisible(false);
      console.log('added wifi', response);
      setPassword('');
      console.log('Wi-Fi connection request sent');
      currentDataRefetch();
    },
    onError: error => {
      console.error('Wi-Fi connect failed', error);
    },
  });

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['wifiList'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: '/deviceDataResponse/getEvent/WIFISEARCH/6907390711',
      }),
    enabled: false,
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      refetch();
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);
  const {
    data: currentData,
    isLoading: currentDataIsLoading,
    refetch: currentDataRefetch,
  } = useQuery({
    queryKey: ['current'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: '/deviceDataResponse/getEvent/WIFICUR/6907390711',
      }),
    enabled: false,
  });

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    if (newValue) {
      wifiMutation.mutate();
      currentWifiMutation.mutate();
    }
  };

  const handleWifiConnect = item => {
    setSelectedWifi(item);
    setModalVisible(true);
  };

  const handleSubmitPassword = () => {
    if (!selectedWifi || !password) return;
    console.log('selectedWifi', selectedWifi);
    const ssidHex = encodeToHex(selectedWifi.wifiName);
    const passwordHex = encodeToHex(password);
    const mac = selectedWifi.SSID;
    connectToWifi.mutate({ssidHex, passwordHex, mac});
  };

  const wifiList = data?.data?.response?.wifiList || [];
  const currentSSID = currentData?.data?.response?.SSID;

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
                  Device can connect to Wi-Fi. Click detect to connect to
                  pre-set Wi-Fi.
                </Text>
              </View>
            </View>
          </CustomCard>

          <Spacing height={DimensionConstants.ten} />

          <View style={styles.switchRow}>
            <Text style={styles.titleText}>Wi-Fi</Text>
            <Switch
              value={isEnabled}
              onValueChange={toggleSwitch}
              trackColor={{false: '#ccc', true: 'rgba(0, 91, 187, 0.1)'}}
              thumbColor={isEnabled ? '#0279E1' : '#f4f3f4'}
            />
          </View>

          <Spacing height={DimensionConstants.ten} />

          {isEnabled && (
            <CustomCard style={styles.cardPadding}>
              {isLoading || currentDataIsLoading ? (
                <ActivityIndicator color="#0279E1" />
              ) : wifiList.length > 0 ? (
                <FlatList
                  data={[...wifiList].sort((a, b) =>
                    a.SSID === currentSSID
                      ? -1
                      : b.SSID === currentSSID
                      ? 1
                      : 0,
                  )}
                  keyExtractor={(item, index) => `${item.SSID}-${index}`}
                  renderItem={({item}) => {
                    const isConnected = item.SSID === currentSSID;
                    return (
                      <TouchableOpacity
                        onPress={() => handleWifiConnect(item)}
                        style={[
                          styles.wifiRow,
                          isConnected && {backgroundColor: '#D0EBFF'},
                        ]}>
                        <View style={styles.rowAlign}>
                          <WifiIcon />
                          <Text
                            style={[
                              styles.wifiText,
                              isConnected && {
                                fontWeight: 'bold',
                                color: '#0279E1',
                              },
                            ]}>
                            {item.wifiName}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.notConnectedText,
                            isConnected && {color: '#0279E1'},
                          ]}>
                          {isConnected ? 'Connected' : 'Tap to Connect'}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : (
                <Text style={styles.descriptionText}>
                  No Wi-Fi networks found.
                </Text>
              )}
            </CustomCard>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Enter Password for {selectedWifi?.wifiName}
            </Text>
            <TextInput
              placeholder="Enter Wi-Fi Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.button, {backgroundColor: '#ccc'}]}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmitPassword}
                style={[styles.button, {backgroundColor: '#0279E1'}]}>
                <Text style={{color: '#fff'}}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flex: 1,
  },
  titleText: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: DimensionConstants.twelve,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.5)',
    flexWrap: 'wrap',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wifiRow: {
    padding: DimensionConstants.ten,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F7FC',
    borderRadius: DimensionConstants.twelve,
    marginBottom: DimensionConstants.ten,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wifiText: {
    fontSize: 16,
    marginLeft: 8,
  },
  notConnectedText: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    width: '85%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});

export default WifiSettingsScreen;
