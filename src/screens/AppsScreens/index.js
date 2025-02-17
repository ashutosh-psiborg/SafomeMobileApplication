import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {DimensionConstants} from '../../constants/DimensionConstants';
import MainBackground from '../../components/MainBackground';
import CustomHeader from '../../components/CustomHeader';
import AlarmIcon from '../../assets/icons/AlarmIcon';
import SyncEventIcon from '../../assets/icons/SyncEventIcon';
import CustomCard from '../../components/CustomCard';
import Spacing from '../../components/Spacing';
import RightArrowIcon from '../../assets/icons/RightArrowIcon';
const AppScreen = ({navigation}) => {
  const icons = [
    {
      component: <AlarmIcon />,
      label: 'Alarm',
    },
    {
      component: <SyncEventIcon />,
      label: 'Sync events',
      line: 'no',
    },
  ];
  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={'Apps'}
        backgroundColor={'#ffffff'}
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.fifteen}}>
        <Spacing height={DimensionConstants.ten} />
        <CustomCard style={styles.featuresCard}>
          {icons.map((item, index) => (
            <View key={index}>
              <View style={styles.featureRow}>
                <View style={styles.featureContent}>
                  {item.component}
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
    </MainBackground>
  );
};

export default AppScreen;

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
