import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import CustomCard from '../../../../../components/CustomCard';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import Spacing from '../../../../../components/Spacing';

const features = [
  {
    title: '1. Single-Press SOS Activation',
    details: [
      '• One-button operation to send an emergency signal immediately.',
    ],
  },
  {
    title: '2. Predefined Emergency Contacts',
    details: [
      '• Links to mobile app to configure and manage up to 5 emergency contacts.',
    ],
  },
  {
    title: '3. Vibration and Light Feedback',
    details: [
      '• Haptic feedback or LED indicator to confirm SOS alert has been sent.',
    ],
  },
  {
    title: '4. Wireless Connectivity',
    details: [
      '• Bluetooth Low Energy (BLE) for app pairing.',
      '• GSM module (if standalone, non-app-dependent functionality is needed).',
    ],
  },
  {
    title: '5. Battery Efficient',
    details: [
      '• Rechargeable battery with a life of up to 3–6 months per charge (depending on usage).',
      '• Low-battery alerts via app or LED indication on the device.',
    ],
  },
];

const AboutDeviceScreen = () => {
  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader title="About Device" backgroundColor="#FFFFFF" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <CustomCard style={styles.card}>
            <Text style={styles.description}>
              The SOS device is a compact, purpose-built safety gadget designed
              for emergency situations. It enables users to send an instant
              distress alert to predefined contacts or authorities with minimal
              effort. Here's a comprehensive breakdown of the device's features,
              components, and functionalities:
            </Text>
            <Spacing height={DimensionConstants.twentyFour} />
            <Text style={styles.sectionTitle}>Device Features</Text>
            <Spacing height={DimensionConstants.sixteen} />

            {features.map((feature, index) => (
              <View key={index}>
                <Text style={styles.feature}>{feature.title}</Text>
                {feature.details.map((detail, subIndex) => (
                  <Text key={subIndex} style={styles.subFeature}>
                    {detail}
                  </Text>
                ))}
              </View>
            ))}
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
  card: {
    borderRadius: DimensionConstants.twelve,
  },
  description: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    lineHeight: DimensionConstants.twentyTwo,
  },
  sectionTitle: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '700',
    lineHeight: DimensionConstants.twentyTwo,
  },
  feature: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    lineHeight: DimensionConstants.twentyTwo,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  subFeature: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    lineHeight: DimensionConstants.twentyTwo,
    color: 'rgba(0, 0, 0, 0.6)',
    marginLeft: DimensionConstants.twenty,
  },
});

export default AboutDeviceScreen;
