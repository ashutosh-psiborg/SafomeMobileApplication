import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
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

const RemoteRestartScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const icons = [
    {
      label: 'Remote Restart',
      navigation: () => setModalVisible(true),
    },
    {
      label: 'Remote Shutdown',
      navigation: () => setModalVisible(true),
      line: 'no',
    },
  ];
  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Remote Restart/Shutdown'}
        backgroundColor={'#fff'}
      />
      <View style={{padding: DimensionConstants.sixteen}}>
        <CustomCard style={styles.featuresCard}>
          {icons.map((item, index) => (
            <View key={index}>
              <View style={styles.featureRow}>
                <View style={styles.featureContent}>
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
              }}>
              Are you sure you want to restart
            </Text>
            <Text
              style={{
                fontSize: DimensionConstants.fourteen,
              }}>
              your device
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
            <CustomButton text={'Restart'} width={'48%'} />
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
    // marginLeft: DimensionConstants.twenty,
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
