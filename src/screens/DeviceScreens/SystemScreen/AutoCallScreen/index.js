import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MainBackground from '../../../../components/MainBackground';
import CustomHeader from '../../../../components/CustomHeader';
import InfoCard from '../../../../components/InfoCard';
import { DimensionConstants } from '../../../../constants/DimensionConstants';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetcher from '../../../../utils/ApiService';

const AutoCallScreen = ({ navigation }) => {
  const { appStrings } = useSelector(state => state.language);
  const [isEnabled, setIsEnabled] = useState(false);

  // Fetch Auto Call Status
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['autoCall'],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: `deviceDataResponse/getEvent/ACALL/6907390711`,
      }),
  });

  useEffect(() => {
    if (data?.data?.response?.acOff === 0) {
      setIsEnabled(false); 
    } else {
      setIsEnabled(true); 
    }
  }, [data]);

  const autoCallMutation = useMutation({
    mutationFn: async requestData => {
      return fetcher({
        method: 'POST',
        url: 'deviceDataResponse/sendEvent/6907390711',
        data: { data: requestData },
      });
    },
    onSuccess: () => {
      console.log('Auto call request successful');
      refetch();
    },
    onError: error => {
      console.error('Auto call request failed', error);
    },
  });

  const toggleSwitch = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);

    const requestData = newState
      ? '[ACALL,7903341259,7982299797,9720121408]' 
      : '[ACALL,0]';

    autoCallMutation.mutate(requestData);
  };

  return (
    <MainBackground noPadding style={{ backgroundColor: '#F2F7FC' }}>
      <CustomHeader
        title={appStrings?.system?.autoCallAnswer?.text}
        backgroundColor={'#fff'}
        backPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <InfoCard
          title={appStrings?.system?.autoCallAnswer?.text}
          description={appStrings?.system?.autoCallDescription?.text}
          isEnabled={isEnabled}
          onToggle={toggleSwitch}
        />
      </View>
    </MainBackground>
  );
};

export default AutoCallScreen;

const styles = StyleSheet.create({
  container: {
    padding: DimensionConstants.sixteen,
  },
});
