import {View, Text, Image, StyleSheet} from 'react-native';
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

const AddDeviceScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
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
          isVisible={ modalVisible }
          modalHeight={height/3.5}
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
                color={theme.background}
                borderColor={theme.midBorderColor}
                textColor={theme.text}
              />
            </View>
          </View>
        </CustomModal>
      </View>
    </MainBackground>
  );
};

export default AddDeviceScreen;
