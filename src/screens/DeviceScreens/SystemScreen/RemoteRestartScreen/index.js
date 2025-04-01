import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import {
  DimensionConstants,
  height,
} from '../../../../constants/DimensionConstants';
import CustomCard from '../../../../components/CustomCard';
import RightArrowIcon from '../../../../assets/icons/RightArrowIcon';
import CustomModal from '../../../../components/CustomModal';
import Spacing from '../../../../components/Spacing';
import CustomButton from '../../../../components/CustomButton';
import {useMutation} from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const RemoteRestartScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [deviceId, setDeviceId] = useState('');

  // Fetch Device ID from AsyncStorage
  const getStoredDeviceId = async () => {
    try {
      const storedDeviceId = await AsyncStorage.getItem('selectedDeviceId');
      if (storedDeviceId) {
        setDeviceId(storedDeviceId);
      }
    } catch (error) {
      console.error('Failed to retrieve stored device data:', error);
    }
  };

  useEffect(() => {
    getStoredDeviceId();
  }, []);
  console.log('Device===}}}}', deviceId);

  const handlePress = action => {
    setSelectedAction(action);
    setModalVisible(true);
  };
  const resetMutation = useMutation({
    mutationFn: async () => {
      return fetcher({
        method: 'POST',
        url: `deviceDataResponse/sendEvent/${deviceId}`,
        data:
          selectedAction === 'Restart'
            ? {data: '[RESET]'}
            : {data: '[POWEROFF]'},
      });
    },
    onSuccess: data => {
      console.log('reset successfully:', data);
      navigation.goBack();
    },
    onError: error => {
      console.error('reset failed', error);
    },
  });
  const icons = [
    {
      label: 'Remote Restart',
      action: 'Restart',
    },
    {
      label: 'Remote Shutdown',
      action: 'Shutdown',
      line: 'no',
    },
  ];

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Remote Restart/Shutdown'}
        backgroundColor={'#fff'}
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.sixteen}}>
        <CustomCard style={styles.featuresCard}>
          {icons.map((item, index) => (
            <View key={index}>
              <TouchableOpacity style={styles.featureRow}>
                <TouchableOpacity
                  style={styles.featureContent}
                  onPress={() => handlePress(item?.action)}>
                  <Text style={styles.featureText}>{item.label}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => handlePress(item?.action)}> */}
                <RightArrowIcon color="black" marginRight={10} />
                {/* </TouchableOpacity> */}
              </TouchableOpacity>

              {item?.line !== 'no' && <View style={styles.separator} />}
            </View>
          ))}
        </CustomCard>
      </View>
      <CustomModal
        isVisible={modalVisible}
        modalHeight={height / 3.5}
        onClose={() => setModalVisible(false)}>
        <View
          style={{
            justifyContent: 'space-between',
            flex: 1,
            paddingBottom: DimensionConstants.fifteen,
          }}>
          <View style={{alignItems: 'center'}}>
            <Spacing height={DimensionConstants.twenty} />
            <Text
              style={{
                fontWeight: '600',
                fontSize: DimensionConstants.sixteen,
              }}>
              Confirmation
            </Text>
            <Spacing height={DimensionConstants.twenty} />

            <Text
              style={{
                fontSize: DimensionConstants.fourteen,
                textAlign: 'center',
              }}>
              Are you sure you want to {selectedAction.toLowerCase()} your
              device?
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CustomButton
              text={'Cancel'}
              width={'48%'}
              color={'#fff'}
              textColor={'rgba(0, 0, 0, 0.6)'}
              borderColor={'rgba(0, 0, 0, 0.3)'}
              onPress={() => setModalVisible(false)}
            />
            <CustomButton
              text={selectedAction}
              width={'48%'}
              onPress={() => resetMutation.mutate()}
            />
          </View>
        </View>
      </CustomModal>
    </MainBackground>
  );
};

export default RemoteRestartScreen;

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
