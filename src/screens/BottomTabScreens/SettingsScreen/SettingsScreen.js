import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState, useEffect} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import {ImageConstants} from '../../../constants/ImageConstants';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import {useSelector} from 'react-redux';
import Spacing from '../../../components/Spacing';
import CustomButton from '../../../components/CustomButton';
import ProfileIcon from '../../../assets/icons/ProfileIcon';
import RightArrowIcon from '../../../assets/icons/RightArrowIcon';
import CustomCard from '../../../components/CustomCard';
import SecurityIcon from '../../../assets/icons/SecurityIcon';
import FAQIcon from '../../../assets/icons/FAQIcon';
import AboutIcon from '../../../assets/icons/AboutIcon';
import PrivacyIcon from '../../../assets/icons/PrivacyIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from '@tanstack/react-query';
import fetcher from '../../../utils/ApiService';
import Loader from '../../../components/Loader';
import {SettingsScreenStyles} from './Styles/SettingsScreenStyles';
import {Linking} from 'react-native';

const SettingsScreen = () => {
  const [tempSelected, setTempSelected] = useState(0);
  const navigation = useNavigation();

  const {appStrings} = useSelector(state => state.language);

  const theme = useSelector(
    state => state.theme.themes[state.theme.currentTheme],
  );

  const styles = SettingsScreenStyles(theme);
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
    Alert.alert(
      appStrings?.settings?.signOut?.text || 'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.clear();
              navigation.reset({
                index: 0,
                routes: [{name: 'OnboardingScreen'}],
              });
            } catch (error) {
              console.log('Error signing out:', error);
            }
          },
        },
      ],
      {cancelable: true}, // Allows dismissing the alert by tapping outside
    );
  };

  const sections = [
    {
      title: appStrings?.settings?.profileInformation?.text,
      icon: <ProfileIcon />,
      navigation: () => navigation.navigate('ProfileInformationScreen'),
    },
    {
      title: appStrings?.settings?.security?.text,
      icon: <SecurityIcon />,
      navigation: () =>
        navigation.navigate('SecurityScreen', {email: data?.data?.user?.email}),
    },
    {
      title: appStrings?.settings?.faq?.text,
      icon: <FAQIcon />,
      navigation: () => navigation.navigate('FAQScreen'),
    },
    {
      title: appStrings?.settings?.aboutUs?.text,
      navigation: () => Linking.openURL('https://safome.co/about-us/'),
      icon: <AboutIcon />,
    },
    {
      title: appStrings?.settings?.privacyPolicy?.text,
      icon: <PrivacyIcon />,
      navigation: () => Linking.openURL('https://safome.co/privacy-policy/'),
      line: true,
    },
  ];

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title="Settings"
        backgroundColor="#ffffff"
        backPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{flex: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <CustomCard style={styles.profileContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileInformationScreen')}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={ImageConstants.avatar}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.profileInfo}>
                <Text
                  style={styles.profileName}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {data?.data?.user?.fullName || 'User Name'}
                </Text>
                <Text
                  style={styles.profileEmail}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {data?.data?.user?.email || 'email@example.com'}
                </Text>
              </View>
            </TouchableOpacity>
          </CustomCard>
          <Spacing height={DimensionConstants.five} />

          <>
            <Spacing height={DimensionConstants.ten} />
            <CustomCard style={styles.featuresCard}>
              <View>
                {sections.map((item, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      style={styles.featureRow}
                      onPress={item.navigation}>
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
              </View>
              <CustomButton
                text={appStrings?.settings?.signOut?.text}
                onPress={signOut}
              />
            </CustomCard>
          </>
        </View>
      </ScrollView>
      {isLoading && <Loader />}
    </MainBackground>
  );
};

export default SettingsScreen;
