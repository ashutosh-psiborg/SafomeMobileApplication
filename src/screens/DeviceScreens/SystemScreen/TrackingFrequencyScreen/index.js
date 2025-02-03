import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {RadioButton} from 'react-native-paper';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import CustomCard from '../../../../components/CustomCard';
import {DimensionConstants} from '../../../../constants/DimensionConstants';
import Spacing from '../../../../components/Spacing';
import CustomButton from '../../../../components/CustomButton';

const TrackingFrequencyScreen = () => {
  const [selected, setSelected] = useState(0);

  const data = [
    {label: 'Update every 10 minutes'},
    {label: 'Update every hour'},
    {label: 'Update location manually', line: 'no'},
  ];

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader title="Tracking Frequency" backgroundColor="#ffffff" />
      <Spacing height={DimensionConstants.ten} />
      <View style={styles.container}>
        <CustomCard style={styles.card}>
          {data.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => setSelected(index)}
                style={styles.option}>
                <Text style={styles.optionText}>{item?.label}</Text>
                <RadioButton
                  value={index}
                  status={selected === index ? 'checked' : 'unchecked'}
                  onPress={() => setSelected(index)}
                  color="#0279E1"
                  uncheckedColor="#0279E1"
                />
              </TouchableOpacity>
              {item.line !== 'no' && <View style={styles.separator} />}
            </View>
          ))}
        </CustomCard>
        <CustomButton text={'Save'} />
      </View>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    padding: DimensionConstants.fifteen,
    justifyContent: 'space-between',
    flex: 1,
  },
  card: {
    padding: 0,
    borderRadius: DimensionConstants.twelve,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DimensionConstants.fifteen,
    paddingVertical: DimensionConstants.ten,
  },
  optionText: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    height: DimensionConstants.one,
  },
});

export default TrackingFrequencyScreen;
