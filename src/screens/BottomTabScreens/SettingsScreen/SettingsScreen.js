import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
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
import SearchContainer from '../../../components/SearchContainer';
import {Linking} from 'react-native';

const SettingsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(0);
  const [tempSelected, setTempSelected] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

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
  // ***************handleSearch********************
  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchQuery('');
        setFilteredSections(sections);
      };
    }, []),
  );
  const handleSearch = query => {
    console.log('========', query);

    if (query) {
      const filtered = sections
        .map(section => ({
          ...section,
          data: section.data.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()),
          ),
        }))
        .filter(section => section.data.length > 0);
      setFilteredSections(filtered);
    } else {
      setFilteredSections(sections);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredSections(sections);
  };
  // ******************************************

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
        // {
        //   title: appStrings?.settings?.language?.text,
        //   icon: <LanguageIcon />,
        //   navigation: () => navigation.navigate('LanguageScreen'),
        // },
        {
          title: appStrings?.settings?.subscription?.text,
          icon: <SubscriptionIcon />,
          navigation: () => navigation.navigate('SubscriptionScreen'),
        },

        // {
        //   title: appStrings?.settings?.aboutDevice?.text,
        //   icon: <AboutDeviceIcon />,
        //   navigation: () => navigation.navigate('AboutDeviceScreen'),
        //   line: false,
        // },
      ],
    },
    // {
    //   title: appStrings?.settings?.preference?.text,
    //   data: [
    //     {
    //       title: appStrings?.notification?.title?.text,
    //       icon: <ProfileNotificationIcon />,
    //       navigation: () => navigation.navigate('NotificationsScreen'),
    //     },
    //     {
    //       title: appStrings?.settings?.appearance?.text,
    //       icon: <AppearanceIcon />,
    //       navigation: () => setModalVisible(true),

    //       line: false,
    //     },
    //   ],
    // },
    {
      title: appStrings?.settings?.otherSettings?.text,
      data: [
        {
          title: appStrings?.settings?.security?.text,
          icon: <SecurityIcon />,
          navigation: () => navigation.navigate('SecurityScreen'),
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
          navigation: () => navigation.navigate('FAQScreen'),
        },
        {
          title: appStrings?.settings?.aboutUs?.text,
          // add link redirect here
          navigation: () => Linking.openURL('https://safome.co/about-us/'),
          icon: <AboutIcon />,
        },
        {
          title: appStrings?.settings?.privacyPolicy?.text,
          icon: <PrivacyIcon />,
          navigation: () =>
            Linking.openURL('https://safome.co/privacy-policy/'),
          line: false,
        },
      ],
    },
  ];
  const [filteredSections, setFilteredSections] = useState(sections);

  return (
    <MainBackground noPadding style={styles.mainBackground}>
      <CustomHeader
        title="Settings"
        backgroundColor="#ffffff"
        backPress={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <SearchContainer
            placeholder={
              appStrings?.settings?.search?.text || 'Search settings...'
            }
            onSearch={handleSearch}
            searchText={searchQuery}
            setSearchText={setSearchQuery}
          />
          <Spacing height={DimensionConstants.ten} />
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
          {filteredSections?.map((section, index) => (
            <SettingSection
              key={index}
              title={section.title}
              data={section.data}
              theme={theme}
              styles={styles}
              isLine={searchQuery && filteredSections.length <= 1}
            />
          ))}
          <Spacing height={DimensionConstants.ten} />
          {!searchQuery && (
            <CustomButton
              text={appStrings?.settings?.signOut?.text}
              onPress={signOut}
            />
          )}
          {/* <Spacing height={DimensionConstants.sixteen} /> */}
          {/* <Text
            style={{
              textAlign: 'center',
              color: '#889CA3',
              fontSize: DimensionConstants.fourteen,
            }}>
            {appStrings?.settings?.appVersion?.text} 0.1
          </Text> */}
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

const SettingSection = ({title, data, theme, styles, isLine}) => (
  <View>
    <Spacing height={DimensionConstants.ten} />

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
          {!isLine && item?.line !== false && <View style={styles.separator} />}
        </View>
      ))}
    </CustomCard>
  </View>
);

export default SettingsScreen;
