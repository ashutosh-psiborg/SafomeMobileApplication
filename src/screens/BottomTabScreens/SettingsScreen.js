import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import MainBackground from '../../components/MainBackground';
import CustomHeader from '../../components/CustomHeader';
import {ImageConstants} from '../../constants/ImageConstants';
import {DimensionConstants} from '../../constants/DimensionConstants';
import {useSelector} from 'react-redux';
import Spacing from '../../components/Spacing';
import CustomButton from '../../components/CustomButton';
import ProfileIcon from '../../assets/icons/ProfileIcon';
import LanguageIcon from '../../assets/icons/LanguageIcon';
import SubscriptionIcon from '../../assets/icons/SubscriptionIcon';
import GeoLocationIcon from '../../assets/icons/GeoLocationIcon';
import AboutDeviceIcon from '../../assets/icons/AboutDeviceIcon';
import RightArrowIcon from '../../assets/icons/RightArrowIcon';
import CustomCard from '../../components/CustomCard';
import ProfileNotificationIcon from '../../assets/icons/ProfileNotificationIcon';
import AppearanceIcon from '../../assets/icons/AppearanceIcon';
import SecurityIcon from '../../assets/icons/SecurityIcon';
import AddRemoteIcon from '../../assets/icons/AddRemoteIcon';
import FAQIcon from '../../assets/icons/FAQIcon';
import AboutIcon from '../../assets/icons/AboutIcon';
import RateAppIcon from '../../assets/icons/RateAppIcon';
import PrivacyIcon from '../../assets/icons/PrivacyIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from '@tanstack/react-query';
import fetcher from '../../utils/ApiService';
import Loader from '../../components/Loader';
const SettingsScreen = ({navigation}) => {
  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );
  const {data, isLoading, error} = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => fetcher({method: 'GET', url: 'auth/profile'}),
  });
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('authToken');

      navigation.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      });
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };
  const sections = [
    {
      title: 'General',
      data: [
        {
          title: 'Profile information',
          icon: <ProfileIcon />,
          navigation: () => navigation.navigate('ProfileInformationScreen'),
        },
        {
          title: 'Language',
          icon: <LanguageIcon />,
          navigation: () => navigation.navigate('LanguageScreen'),
        },
        {
          title: 'Subscription',
          icon: <SubscriptionIcon />,
          navigation: () => navigation.navigate('SubscriptionScreen'),
        },
        {title: 'Geofencing', icon: <GeoLocationIcon />},
        {title: 'About device', icon: <AboutDeviceIcon />, line: false},
      ],
    },
    {
      title: 'Preference',
      data: [
        {
          title: 'Notifications',
          icon: <ProfileNotificationIcon />,
          navigation: () => navigation.navigate('NotificationsScreen'),
        },
        {title: 'Appearance', icon: <AppearanceIcon />, line: false},
      ],
    },
    {
      title: 'Other settings',
      data: [
        {title: 'Security', icon: <SecurityIcon />},
        {title: 'Add / remove device', icon: <AddRemoteIcon />, line: false},
      ],
    },
    {
      title: 'App settings',
      data: [
        {title: 'FAQ', icon: <FAQIcon />},
        {title: 'About us', icon: <AboutIcon />},
        {title: 'Rate App', icon: <RateAppIcon />},
        {title: 'Privacy policy', icon: <PrivacyIcon />, line: false},
      ],
    },
  ];

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader title="Profile" backgroundColor="#ffffff" />
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
              <CustomButton text="Upgrade plan" width="150%" />
              <Spacing height={DimensionConstants.twenty} />
              <Text style={[styles.subscriptionLink, {color: theme.primary}]}>
                View available subscriptions
              </Text>
            </View>
          </View>

          {sections.map((section, index) => (
            <SettingSection
              key={index}
              title={section.title}
              data={section.data}
              theme={theme}
            />
          ))}
          <Spacing height={DimensionConstants.ten} />

          <CustomButton text={'Sign out'} onPress={signOut} />
          <Spacing height={DimensionConstants.sixteen} />
          <Text
            style={{
              textAlign: 'center',
              color: '#889CA3',
              fontSize: DimensionConstants.fourteen,
            }}>
            App version 0.1
          </Text>
        </View>
      </ScrollView>
      {isLoading && <Loader />}
    </MainBackground>
  );
};

const SettingSection = ({title, data, theme}) => (
  <View>
    <Spacing height={DimensionConstants.thirtyTwo} />

    <Text style={[styles.sectionTitle, {color: theme.darkGrey}]}>{title}</Text>
    <Spacing height={DimensionConstants.ten} />
    <CustomCard style={styles.featuresCard}>
      {data.map((item, index) => (
        <View key={index}>
          <View style={styles.featureRow}>
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
          </View>
          {item?.line !== false && <View style={styles.separator} />}
        </View>
      ))}
    </CustomCard>
  </View>
);

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    padding: DimensionConstants.sixteen,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    height: DimensionConstants.oneHundred,
    width: DimensionConstants.oneHundred,
  },
  profileName: {
    lineHeight: DimensionConstants.twentyTwo,
    fontSize: DimensionConstants.twenty,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.6)',
    lineHeight: DimensionConstants.twentyTwo,
  },
  subscriptionContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionImage: {
    height: DimensionConstants.twoHundred,
    width: '100%',
    borderRadius: DimensionConstants.twelve,
  },
  subscriptionOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  subscriptionTitle: {
    fontWeight: '600',
    fontSize: DimensionConstants.fourteen,
  },
  subscriptionText: {
    fontSize: DimensionConstants.fourteen,
    color: 'rgba(0, 0, 0, 0.4)',
    fontWeight: '500',
  },
  subscriptionLink: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: DimensionConstants.twelve,
    fontWeight: '500',
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
    marginLeft: DimensionConstants.fifteen,
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    height: DimensionConstants.one,
    width: '90%',
    alignSelf: 'flex-end',
    marginVertical: DimensionConstants.eight,
  },
});

export default SettingsScreen;
