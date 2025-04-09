import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import MainBackground from '../../components/MainBackground';
import CustomHeader from '../../components/CustomHeader';
import {DimensionConstants} from '../../constants/DimensionConstants';
import CustomCard from '../../components/CustomCard';
import Spacing from '../../components/Spacing';

export default function PlanDetail({navigation}) {
  return (
    <>
      <CustomHeader
        backPress={() => navigation.goBack()}
        title="Plan Details"
        backgroundColor="white"
      />
      <MainBackground style={styles.mainBackground}>
        <ScrollView
          contentContainerStyle={
            {
              // padding: DimensionConstants.fifteen,
            }
          }>
          <CustomCard style={styles.card}>
            <View style={styles.gradientContainer}>
              <View style={styles.header}>
                <Text style={styles.planTitle}>Plan</Text>
                <Text style={styles.planPrice}>₹219</Text>
              </View>
              <View style={styles.details}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Expires on</Text>
                  <Text style={styles.detailValue}>30th Apr, 2025</Text>
                </View>
                <Text style={styles.activePlanText}>+1 Active Plan</Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('DetailedPlanInfo')} // Example navigation
              >
                <Text style={styles.buttonText}>Plan Details</Text>
              </TouchableOpacity>
              <Spacing height={DimensionConstants.seven} />
              <View style={styles.divider} />
              <Text
                style={{
                  fontSize: DimensionConstants.fourteen,
                  fontWeight: '500',
                }}>
                Upcoming plan
              </Text>
              <Spacing height={DimensionConstants.five} />
              <Text
                style={{
                  fontSize: DimensionConstants.thirteen,
                }}>
                Your plan will be automatically activated after your current
                plan expries.
              </Text>
            </View>
            <View style={{padding: 15}}>
              <CustomCard style={{backgroundColor: '#F2F7FC'}}>
                <Text style={styles.planPrice}>₹579</Text>
                <Spacing height={DimensionConstants.two} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Validity</Text>
                  <Text style={styles.detailValue}>56 Days</Text>
                </View>
                <TouchableOpacity
                  style={styles.buttonView}
                  onPress={() => navigation.navigate('DetailedPlanInfo')} // Example navigation
                >
                  <Text style={styles.buttonText}>View</Text>
                </TouchableOpacity>
              </CustomCard>
            </View>
          </CustomCard>
        </ScrollView>
      </MainBackground>
    </>
  );
}

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  card: {
    borderRadius: DimensionConstants.sixteen,
    overflow: 'hidden', // Ensures gradient stays within card bounds

    padding: 0,
  },
  gradientContainer: {
    padding: DimensionConstants.fifteen,
    borderRadius: DimensionConstants.sixteen,
  },
  header: {
    // alignItems: 'center',
    marginBottom: DimensionConstants.fifteen,
  },
  planTitle: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '500',

    opacity: 0.9,
  },
  planPrice: {
    fontSize: DimensionConstants.twenty,
    fontWeight: '800',

    marginTop: DimensionConstants.five,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.2)',
    marginVertical: DimensionConstants.ten,
  },
  details: {
    marginBottom: DimensionConstants.fifteen,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: DimensionConstants.ten,
  },
  detailLabel: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '400',

    opacity: 0.8,
  },
  detailValue: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  activePlanText: {
    fontSize: DimensionConstants.fifteen,
    fontWeight: '500',
    opacity: 0.9,
  },
  button: {
    width: 120,
    borderRadius: DimensionConstants.twentyFive,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DimensionConstants.five,
    // paddingHorizontal: DimensionConstants.ten,

    borderWidth: 1,
    borderColor: 'rgba(18,18,18,0.2)',
  },
  buttonText: {
    fontSize: DimensionConstants.fifteen,
    fontWeight: '600',
    textAlign: 'center',
    color: '#0279E1',
  },
  buttonView: {
    borderRadius: DimensionConstants.twentyFive,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DimensionConstants.five,
    // paddingHorizontal: DimensionConstants.ten,

    borderWidth: 1,
    borderColor: 'rgba(18,18,18,0.2)',
  },
  buttonIcon: {
    marginLeft: DimensionConstants.five,
  },
});
