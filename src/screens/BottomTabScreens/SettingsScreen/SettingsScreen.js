import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState, useEffect} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import {ImageConstants} from '../../../constants/ImageConstants';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import {useSelector, useDispatch} from 'react-redux';
import Spacing from '../../../components/Spacing';
import CustomButton from '../../../components/CustomButton';
import ProfileIcon from '../../../assets/icons/ProfileIcon';
import LanguageIcon from '../../../assets/icons/LanguageIcon';
import SubscriptionIcon from '../../../assets/icons/SubscriptionIcon';
import GeoLocationIcon from '../../../assets/icons/GeoLocationIcon';
import AboutDeviceIcon from '../../../assets/icons/AboutDeviceIcon';
import RightArrowIcon from '../../../assets/icons/RightArrowIcon';
import CustomCard from '../../../components/CustomCard';
import ProfileNotificationIcon from '../../../assets/icons/ProfileNotificationIcon';
import AppearanceIcon from '../../../assets/icons/AppearanceIcon';
import SecurityIcon from '../../../assets/icons/SecurityIcon';
import AddRemoteIcon from '../../../assets/icons/AddRemoteIcon';
import FAQIcon from '../../../assets/icons/FAQIcon';
import AboutIcon from '../../../assets/icons/AboutIcon';
import RateAppIcon from '../../../assets/icons/RateAppIcon';
import PrivacyIcon from '../../../assets/icons/PrivacyIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from '@tanstack/react-query';
import fetcher from '../../../utils/ApiService';
import Loader from '../../../components/Loader';
import CustomModal from '../../../components/CustomModal';
import RadioButtonCard from '../../../components/RadioButtonCard';
import {setTheme} from '../../../redux/slices/themeSlice';
import {SettingsScreenStyles} from './Styles/SettingsScreenStyles';

const SettingsScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(0);
  const [tempSelected, setTempSelected] = useState(0);

  const dispatch = useDispatch();
  const {appStrings} = useSelector(state => state.language);
  const themeOptions = [
    {label: 'Light theme'},
    {label: 'Dark theme'},
    {label: 'Use device theme', line: 'no'},
  ];
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const styles = SettingsScreenStyles(theme);
  useEffect(() => {
    if (theme === 'light') {
      setSelected(0);
      setTempSelected(0);
    } else if (theme === 'dark') {
      setSelected(1);
      setTempSelected(1);
    } else {
      setSelected(2);
      setTempSelected(2);
    }
  }, [theme]);

  const handleSelect = index => {
    setTempSelected(index);
  };

  const handleSave = () => {
    setSelected(tempSelected);
    if (tempSelected === 0) {
      dispatch(setTheme('light'));
    } else if (tempSelected === 1) {
      dispatch(setTheme('dark'));
    } else {
      const colorScheme = Appearance.getColorScheme();
      dispatch(setTheme(colorScheme === 'dark' ? 'dark' : 'light'));
    }
    setModalVisible(false);
  };
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => fetcher({method: 'GET', url: 'auth/profile'}),
  });
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.reset({
        index: 0,
        routes: [{name: 'OnboardingScreen'}],
      });
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };
  const sections = [
    {
      title: appStrings?.settings?.general?.text,
      data: [
        {
          title: appStrings?.settings?.profileInformation?.text,
          icon: <ProfileIcon />,
          navigation: () => navigation.navigate('ProfileInformationScreen'),
        },
        {
          title: appStrings?.settings?.language?.text,
          icon: <LanguageIcon />,
          navigation: () => navigation.navigate('LanguageScreen'),
        },
        {
          title: appStrings?.settings?.subscription?.text,
          icon: <SubscriptionIcon />,
          navigation: () => navigation.navigate('SubscriptionScreen'),
        },
        {
          title: appStrings?.settings?.geofencing?.text,
          icon: <GeoLocationIcon />,
        },
        {
          title: appStrings?.settings?.aboutDevice?.text,
          icon: <AboutDeviceIcon />,
          navigation: () => navigation.navigate('AboutDeviceScreen'),
          line: false,
        },
      ],
    },
    {
      title: appStrings?.settings?.preference?.text,
      data: [
        {
          title: appStrings?.notification?.title?.text,
          icon: <ProfileNotificationIcon />,
          navigation: () => navigation.navigate('NotificationsScreen'),
        },
        {
          title: appStrings?.settings?.appearance?.text,
          icon: <AppearanceIcon />,
          navigation: () => setModalVisible(true),

          line: false,
        },
      ],
    },
    {
      title: appStrings?.settings?.otherSettings?.text,
      data: [
        {
          title: appStrings?.settings?.security?.text,
          icon: <SecurityIcon />,
        },
        {
          title: appStrings?.settings?.addRemoveDevice?.text,
          icon: <AddRemoteIcon />,
          navigation: () => navigation.navigate('AddRemoveDeviceScreen'),
          line: false,
        },
      ],
    },
    {
      title: appStrings?.settings?.appSettings?.text,
      data: [
        {
          title: appStrings?.settings?.faq?.text,
          icon: <FAQIcon />,
        },
        {
          title: appStrings?.settings?.aboutUs?.text,
          icon: <AboutIcon />,
        },
        {
          title: appStrings?.settings?.rateApp?.text,
          icon: <RateAppIcon />,
        },
        {
          title: appStrings?.settings?.privacyPolicy?.text,
          icon: <PrivacyIcon />,
          line: false,
        },
      ],
    },
  ];

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title="Profile"
        backgroundColor="#ffffff"
        backPress={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <Image source={ImageConstants.avatar} style={styles.profileImage} />
            <Spacing height={DimensionConstants.sixteen} />
            <Text style={styles.profileName}>{data?.user?.fullName}</Text>
            <Text style={styles.profileEmail}>{data?.user?.email}</Text>
          </View>

          <Spacing height={DimensionConstants.twentyFour} />

          <View style={styles.subscriptionContainer}>
            <Image
              source={ImageConstants.texturedPaper}
              style={styles.subscriptionImage}
            />
            <View style={styles.subscriptionOverlay}>
              <Text style={styles.subscriptionTitle}>PREMIUM</Text>
              <Spacing height={DimensionConstants.ten} />
              <Text style={styles.subscriptionText}>
                Subscription ends in 7 days
              </Text>
              <CustomButton
                text={appStrings?.settings?.upgradePlan?.text}
                width="150%"
                onPress={() => navigation.navigate('SubscriptionScreen')}
              />
              <Spacing height={DimensionConstants.twenty} />
              <TouchableOpacity
                onPress={() => navigation.navigate('SubscriptionScreen')}>
                <Text style={[styles.subscriptionLink, {color: theme.primary}]}>
                  {appStrings?.settings?.viewAvailableSubscriptions?.text}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {sections.map((section, index) => (
            <SettingSection
              key={index}
              title={section.title}
              data={section.data}
              theme={theme}
              styles={styles}
            />
          ))}
          <Spacing height={DimensionConstants.ten} />
          <CustomButton
            text={appStrings?.settings?.signOut?.text}
            onPress={signOut}
          />
          <Spacing height={DimensionConstants.sixteen} />
          <Text
            style={{
              textAlign: 'center',
              color: '#889CA3',
              fontSize: DimensionConstants.fourteen,
            }}>
            {appStrings?.settings?.appVersion?.text} 0.1
          </Text>
        </View>
      </ScrollView>
      <CustomModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}>
        <Spacing height={DimensionConstants.ten} />
        <View>
          <Text
            style={{
              fontSize: DimensionConstants.sixteen,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            Confirmation
          </Text>
          <RadioButtonCard
            useView
            data={themeOptions}
            onSelect={handleSelect}
            selected={tempSelected} // Use temporary state for selection
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CustomButton
              width={'48%'}
              color={'#ffffff'}
              borderColor={'#F2F7FC'}
              textColor={'#000000'}
              text={'Cancel'}
              onPress={() => setModalVisible(false)}
            />
            <CustomButton width={'48%'} text={'Save'} onPress={handleSave} />
          </View>
        </View>
      </CustomModal>
      {isLoading && <Loader />}
    </MainBackground>
  );
};

const SettingSection = ({title, data, theme, styles}) => (
  <View>
    <Spacing height={DimensionConstants.thirtyTwo} />

    <Text style={[styles.sectionTitle, {color: theme.darkGrey}]}>{title}</Text>
    <Spacing height={DimensionConstants.ten} />
    <CustomCard style={styles.featuresCard}>
      {data.map((item, index) => (
        <View key={index}>
          <TouchableOpacity style={styles.featureRow} onPress={item.navigation}>
            <View style={styles.featureContent}>
              {item.icon}
              <Text style={styles.featureText}>{item.title}</Text>
            </View>
            <TouchableOpacity onPress={item.navigation}>
              <RightArrowIcon
                color="black"
                marginRight={DimensionConstants.twenty}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {item?.line !== false && <View style={styles.separator} />}
        </View>
      ))}
    </CustomCard>
  </View>
);

export default SettingsScreen;
