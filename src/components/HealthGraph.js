import React, {useState, useMemo} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import CustomCard from './CustomCard';
import moment from 'moment';
import {DimensionConstants} from '../constants/DimensionConstants';
import Spacing from './Spacing';

const screenWidth = Dimensions.get('window').width;

const HealthGraph = ({data}) => {
  const [focusedHeartRate, setFocusedHeartRate] = useState(null);
  const [focusedBP, setFocusedBP] = useState(null);
  const [focusedSPO2, setFocusedSPO2] = useState(null);

  const isSingleDay = (dataList, dateKey) => {
    const uniqueDates = new Set(
      dataList?.map(item =>
        moment(item[dateKey], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY'),
      ),
    );
    return uniqueDates.size === 1;
  };

  const heartRateData = useMemo(() => {
    const list =
      data?.data?.heartRateHistory?.filter(
        item => parseInt(item.heartRate) > 1,
      ) || [];

    const useTimeLabel = isSingleDay(list, 'date');

    return list
      .map(item => ({
        value: parseInt(item.heartRate),
        label: moment(item.date, 'DD-MM-YYYY HH:mm:ss').format(
          useTimeLabel ? 'HH:mm' : 'DD MMM',
        ),
        labelTextStyle: {color: '#999', fontSize: 10},
      }))
      .reverse();
  }, [data]);

  const systolicData = useMemo(() => {
    const list =
      data?.data?.BP?.filter(item => parseInt(item?.systolicBP) > 1) || [];
    const useTimeLabel = isSingleDay(list, 'date');

    return list
      .map(item => ({
        value: parseInt(item?.systolicBP),
        label: moment(item?.date, 'DD-MM-YYYY HH:mm:ss').format(
          useTimeLabel ? 'HH:mm' : 'DD MMM',
        ),
        labelTextStyle: {color: '#999', fontSize: 10},
      }))
      .reverse();
  }, [data]);

  const diastolicData = useMemo(() => {
    const list =
      data?.data?.BP?.filter(item => parseInt(item?.diastolicBP) > 1) || [];
    const useTimeLabel = isSingleDay(list, 'date');

    return list
      .map(item => ({
        value: parseInt(item?.diastolicBP),
        label: moment(item?.date, 'DD-MM-YYYY HH:mm:ss').format(
          useTimeLabel ? 'HH:mm' : 'DD MMM',
        ),
        labelTextStyle: {color: '#999', fontSize: 10},
      }))
      .reverse();
  }, [data]);

  const spo2Data = useMemo(() => {
    const list =
      data?.data?.oxSPO2?.filter(item => parseInt(item?.SPO2Rating) > 0) || [];
    const useTimeLabel = isSingleDay(list, 'date');

    return list
      .map(item => ({
        value: parseInt(item?.SPO2Rating),
        label: moment(item?.date, 'DD-MM-YYYY HH:mm:ss').format(
          useTimeLabel ? 'HH:mm' : 'DD MMM',
        ),
        labelTextStyle: {color: '#999', fontSize: 10},
      }))
      .reverse();
  }, [data]);

  const renderHeartRateGraph = () => {
    return heartRateData.length > 0 ? (
      <>
        <LineChart
          data={heartRateData}
          width={screenWidth / 1.5}
          spacing={60}
          thickness={2}
          color="#FF310C"
          hideDataPoints={false}
          curved
          dataPointsColor="#C70039"
          yAxisColor="#ccc"
          xAxisColor="#ccc"
          noOfSections={6}
          maxValue={200}
          areaChart
          focusEnabled
          showDataPointLabelOnFocus
          showTextOnFocus={false}
          startFillColor="#FF310C"
          endFillColor="rgba(255,107,107,0)"
          isAnimated
          onFocus={item =>
            setFocusedHeartRate(`Heart Rate: ${item?.value} BPM`)
          }
        />
        {focusedHeartRate && (
          <Text style={styles.focusText}>{focusedHeartRate}</Text>
        )}
      </>
    ) : (
      <Text style={styles.noData}>No heart rate data available.</Text>
    );
  };

  const renderBloodPressureGraph = () => {
    return systolicData.length > 0 && diastolicData.length > 0 ? (
      <>
        <LineChart
          data={systolicData}
          data2={diastolicData}
          width={screenWidth / 1.5}
          spacing={60}
          thickness={2}
          color="#FF310C"
          color2="#0279E1"
          hideDataPoints={false}
          curved
          dataPointsColor1="red"
          dataPointsColor2="blue"
          yAxisColor="#ccc"
          xAxisColor="#ccc"
          noOfSections={6}
          maxValue={300}
          isAnimated
          focusEnabled
          showDataPointLabelOnFocus
          showTextOnFocus={false}
          onFocus={(item, index) => {
            const systolic = systolicData[index]?.value;
            const diastolic = diastolicData[index]?.value;
            if (item.value === systolic && diastolic !== undefined) {
              setFocusedBP(
                `Systolic: ${systolic} mmHg\nDiastolic: ${diastolic} mmHg`,
              );
            } else if (item.value === diastolic && systolic !== undefined) {
              setFocusedBP(
                `Systolic: ${systolic} mmHg\nDiastolic: ${diastolic} mmHg`,
              );
            } else {
              setFocusedBP(`Value: ${item.value}`);
            }
          }}
        />
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, {backgroundColor: '#FF310C'}]} />
            <Text style={styles.legendLabel}>Systolic</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, {backgroundColor: '#0279E1'}]} />
            <Text style={styles.legendLabel}>Diastolic</Text>
          </View>
        </View>
        {focusedBP && <Text style={styles.focusText}>{focusedBP}</Text>}
      </>
    ) : (
      <Text style={styles.noData}>No blood pressure data available.</Text>
    );
  };

  const renderSPO2Graph = () => {
    return spo2Data.length > 0 ? (
      <>
        <LineChart
          data={spo2Data}
          width={screenWidth / 1.5}
          spacing={60}
          thickness={2}
          color="#17C964"
          hideDataPoints={false}
          curved
          dataPointsColor="#17C964"
          yAxisColor="#ccc"
          xAxisColor="#ccc"
          noOfSections={4}
          maxValue={200}
          areaChart
          focusEnabled
          showDataPointLabelOnFocus
          showTextOnFocus={false}
          startFillColor="#90EE90"
          endFillColor="rgba(23,201,100,0)"
          isAnimated
          onFocus={item => setFocusedSPO2(`SPO2: ${item?.value}%`)}
        />
        {focusedSPO2 && <Text style={styles.focusText}>{focusedSPO2}</Text>}
      </>
    ) : (
      <Text style={styles.noData}>No SPO2 data available.</Text>
    );
  };

  return (
    <View style={styles.container}>
      <CustomCard>
        <Text style={styles.title}>Heart Rate History</Text>
        {renderHeartRateGraph()}
      </CustomCard>
      <Spacing height={DimensionConstants.fifteen} />
      <CustomCard>
        <Text style={styles.title}>Blood Pressure History</Text>
        {renderBloodPressureGraph()}
      </CustomCard>
      <Spacing height={DimensionConstants.fifteen} />
      <CustomCard>
        <Text style={styles.title}>Blood Oxygen (SPO2) History</Text>
        {renderSPO2Graph()}
      </CustomCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: DimensionConstants.ten,
  },
  title: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '600',
    marginBottom: DimensionConstants.ten,
  },
  noData: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  focusText: {
    marginTop: DimensionConstants.ten,
    fontSize: DimensionConstants.fourteen,
    color: '#000',
    fontWeight: '500',
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: DimensionConstants.ten,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: DimensionConstants.ten,
  },
  legendBox: {
    width: DimensionConstants.twelve,
    height: DimensionConstants.twelve,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: DimensionConstants.fourteen,
    color: '#333',
  },
});

export default HealthGraph;
