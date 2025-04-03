import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../components/MainBackground';
import CustomHeader from '../../components/CustomHeader';
import BlackSettingsIcon from '../../assets/icons/BlackSettingsIcon';
import {DimensionConstants} from '../../constants/DimensionConstants';
import Spacing from '../../components/Spacing';
import CustomCard from '../../components/CustomCard';
import BlueBellIcon from '../../assets/icons/BlueBellIcon';
const NotificationScreen = ({navigation}) => {
  const [selectedButton, setSelectedButton] = useState(0);

  const buttons = ['All', 'SOS', 'Safe zone', 'Battery'];

  return (
    <MainBackground noPadding style={styles.background}>
      <CustomHeader
        title={'Notification'}
        backPress={() => navigation.goBack()}
        backgroundColor={'#fff'}
        onIconPress={() => navigation.navigate('MainApp', {screen: 'Settings'})}
        icon={<BlackSettingsIcon marginRight={DimensionConstants.ten} />}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{padding: DimensionConstants.sixteen}}>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  selectedButton === index && styles.selectedButton,
                ]}
                onPress={() => setSelectedButton(index)}>
                <Text
                  style={[
                    styles.buttonText,
                    selectedButton === index && styles.selectedButtonText,
                  ]}>
                  {button}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Spacing height={DimensionConstants.twentyFour} />
          <Text
            style={{
              fontSize: DimensionConstants.fourteen,
              fontWeight: '600',
              color: '#0279E1',
            }}>
            Today
          </Text>
          <Spacing height={DimensionConstants.fourteen} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map(() => (
            <CustomCard
              style={{
                borderRadius: DimensionConstants.twelve,
                marginTop: DimensionConstants.ten,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <BlueBellIcon />
                  <Spacing width={DimensionConstants.sixteen} />
                  <View>
                    <Text
                      style={{
                        fontSize: DimensionConstants.fourteen,
                        fontWeight: '500',
                      }}>
                      Out from geofence
                    </Text>
                    <Text
                      style={{
                        fontSize: DimensionConstants.fourteen,
                        fontWeight: '500',
                        color: '#889CA3',
                      }}>
                      Pet Bella out from geofence
                    </Text>
                    <Spacing height={DimensionConstants.eight} />

                    <Text
                      style={{
                        fontSize: DimensionConstants.fourteen,
                        color: 'rgba(0, 0, 0, 0.6)',
                      }}>
                      09:45 am
                    </Text>
                  </View>
                </View>
              </View>
            </CustomCard>
          ))}
        </View>
      </ScrollView>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#F2F7FC',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: DimensionConstants.six,
  },
  button: {
    height: DimensionConstants.thirty,
    width: DimensionConstants.eighty,
    borderRadius: DimensionConstants.twenty,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(254, 96, 93, 0.2)',
    borderWidth: DimensionConstants.one,
  },
  selectedButton: {
    backgroundColor: '#FF310C',
  },
  buttonText: {
    color: '#000',
    fontSize: DimensionConstants.twelve,
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#fff',
  },
});

export default NotificationScreen;
