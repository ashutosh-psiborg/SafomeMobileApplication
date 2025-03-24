import React, {useState, useMemo} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import CustomCard from './CustomCard';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import {DimensionConstants} from '../constants/DimensionConstants';

const screenWidth = Dimensions.get('window').width;

const HealthGraph = ({data}) => {
  const [selectedGraph, setSelectedGraph] = useState('heartRate');
  const [focusedValue, setFocusedValue] = useState(null);

  const dropdownData = [
    {label: 'Heart Rate', value: 'heartRate'},
    {label: 'Blood Pressure', value: 'bloodPressure'},
    {label: 'Blood Oxygen', value: 'spo2'},
  ];

  const heartRateData = useMemo(() => {
    return (
      data?.data?.heartRateHistory
        ?.filter(item => parseInt(item.heartRate) > 1)
        ?.map(item => ({
          value: parseInt(item.heartRate),
          label: moment(item.date, 'DD-MM-YYYY HH:mm:ss').format('DD MMM'),
          labelTextStyle: {color: '#999', fontSize: 10},
        }))
        ?.reverse() || []
    );
  }, [data]);

  const systolicData = useMemo(() => {
    return (
      data?.data?.BP?.filter(item => parseInt(item?.systolicBP) > 1)
        ?.map(item => ({
          value: parseInt(item?.systolicBP),
          label: moment(item?.date, 'DD-MM-YYYY HH:mm:ss').format('DD MMM'),
          labelTextStyle: {color: '#999', fontSize: 10},
        }))
        ?.reverse() || []
    );
  }, [data]);

  const diastolicData = useMemo(() => {
    return (
      data?.data?.BP?.filter(item => parseInt(item?.diastolicBP) > 1)
        ?.map(item => ({
          value: parseInt(item?.diastolicBP),
          label: moment(item?.date, 'DD-MM-YYYY HH:mm:ss').format('DD MMM'),
          labelTextStyle: {color: '#999', fontSize: 10},
        }))
        ?.reverse() || []
    );
  }, [data]);

  const spo2Data = useMemo(() => {
    return (
      data?.data?.oxSPO2
        ?.filter(item => parseInt(item?.SPO2Rating) > 0)
        ?.map(item => ({
          value: parseInt(item?.SPO2Rating),
          label: moment(item?.date, 'DD-MM-YYYY HH:mm:ss').format('DD MMM'),
          labelTextStyle: {color: '#999', fontSize: 10},
        }))
        ?.reverse() || []
    );
  }, [data]);

  const renderGraph = () => {
    switch (selectedGraph) {
      case 'heartRate':
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
                setFocusedValue(`Heart Rate: ${item?.value} BPM`)
              }
            />
            {focusedValue && (
              <Text style={styles.focusText}>{focusedValue}</Text>
            )}
          </>
        ) : (
          <Text style={styles.noData}>No heart rate data available.</Text>
        );

      case 'bloodPressure':
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
                  setFocusedValue(
                    `Systolic: ${systolic} mmHg\nDiastolic: ${diastolic} mmHg`,
                  );
                } else if (item.value === diastolic && systolic !== undefined) {
                  setFocusedValue(
                    `Systolic: ${systolic} mmHg\nDiastolic: ${diastolic} mmHg`,
                  );
                } else {
                  setFocusedValue(`Value: ${item.value}`);
                }
              }}
            />
            {focusedValue && (
              <Text style={styles.focusText}>{focusedValue}</Text>
            )}
          </>
        ) : (
          <Text style={styles.noData}>No blood pressure data available.</Text>
        );

      case 'spo2':
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
              onFocus={item => setFocusedValue(`SPO2: ${item?.value}%`)}
            />
            {focusedValue && (
              <Text style={styles.focusText}>{focusedValue}</Text>
            )}
          </>
        ) : (
          <Text style={styles.noData}>No SPO2 data available.</Text>
        );

      default:
        return null;
    }
  };

  const renderLegend = () => {
    if (selectedGraph === 'bloodPressure') {
      return (
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
      );
    }
    return null;
  };

  return (
    <CustomCard>
      <View>
        <Text style={styles.title}>
          {selectedGraph === 'heartRate'
            ? 'Heart Rate History'
            : selectedGraph === 'bloodPressure'
            ? 'Blood Pressure History'
            : 'Blood Oxygen (SPO2) History'}
        </Text>

        <Dropdown
          data={dropdownData}
          labelField="label"
          valueField="value"
          value={selectedGraph}
          onChange={item => {
            setSelectedGraph(item.value);
            setFocusedValue(null); // Clear on graph switch
          }}
          placeholder="Select Graph"
          style={styles.dropdown}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          itemTextStyle={styles.itemText}
        />

        {renderLegend()}
        {renderGraph()}
      </View>
    </CustomCard>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: DimensionConstants.sixteen,
    fontWeight: '600',
    marginBottom: DimensionConstants.ten,
  },
  dropdown: {
    height: DimensionConstants.fifty,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: DimensionConstants.eight,
    paddingHorizontal: DimensionConstants.twelve,
    marginBottom: DimensionConstants.twenty,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#999',
  },
  selectedText: {
    color: '#000',
    fontSize: DimensionConstants.fourteen,
  },
  itemText: {
    fontSize: DimensionConstants.fourteen,
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
    marginBottom: DimensionConstants.ten,
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
