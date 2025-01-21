import {View, Text, Image, TextInput} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../components/MainBackground';
import {ImageConstants} from '../../constants/ImageConstants';
import {DimensionConstants, height} from '../../constants/DimensionConstants';
import WatchIcon from '../../assets/icons/WatchIcon';
import CustomHeader from '../../components/CustomHeader';
import Spacing from '../../components/Spacing';
import CustomButton from '../../components/CustomButton';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import CustomModal from '../../components/CustomModal';
import {AddDeviceStyles} from './Styles/AddDeviceStyles';
import GlobeIcon from '../../assets/icons/GlobeIcon';

const AddDeviceScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [macAddress, setMacAddress] = useState('');

  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const {t} = useTranslation();
  const styles = AddDeviceStyles(theme);

  return (
    <MainBackground noPadding>
      <Image
        source={ImageConstants.backgroundImage}
        style={styles.backgroundImage}
      />

      <View style={styles.container}>
        <View>
          <CustomHeader skip />
          <Spacing height={DimensionConstants.twentyEight} />
          <Text style={styles.title}>Add device</Text>
          <Text style={styles.title}>details</Text>
        </View>

        <View style={styles.iconContainer}>
          <WatchIcon />
        </View>

        <CustomButton text={t('Next')} onPress={() => setModalVisible(true)} />

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
                {t('Add device details')}
              </Text>
            </View>
            <View>
              <CustomButton text={t('Scan QR code')} />
              <CustomButton
                text={t('Enter details manually')}
                onPress={() => (
                  setModalVisible(false),
                  setTimeout(() => {
                    setInputModalVisible(true);
                  }, 300)
                )}
                color={theme.background}
                borderColor={theme.midBorderColor}
                textColor={theme.text}
              />
            </View>
          </View>
        </CustomModal>
        <CustomModal
          isVisible={inputModalVisible}
          modalHeight={height / 2.5}
          onClose={() => setInputModalVisible(false)}>
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
                {t('Add device details')}
              </Text>
            </View>
            <View>
              <View style={styles.textInput}>
                <GlobeIcon />
                <TextInput
                  style={styles.inputField}
                  placeholder={t('Enter device name')}
                  value={deviceName}
                  onChangeText={setDeviceName}
                  placeholderTextColor={theme.placeHolderText}
                />
              </View>
              <View style={styles.textInput}>
                <GlobeIcon />
                <TextInput
                  style={styles.inputField}
                  placeholder={t('Enter device MAC ID')}
                  value={macAddress}
                  onChangeText={setMacAddress}
                  placeholderTextColor={theme.placeHolderText}
                />
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <CustomButton
                width={'48%'}
                text={t('Cancel')}
                color={theme.background}
                borderColor={theme.otpBox}
                textColor={theme.text}
              />
              <CustomButton
                text={t('Add')}
                width={'48%'}
                onPress={() => navigation.navigate('PairNewDeviceScreen')}
              />
            </View>
          </View>
        </CustomModal>
      </View>
    </MainBackground>
  );
};

export default AddDeviceScreen;
