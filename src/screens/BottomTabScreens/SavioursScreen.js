import {
  View,
  Switch,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
import MainBackground from '../../components/MainBackground';
import CustomHeader from '../../components/CustomHeader';
import CustomCard from '../../components/CustomCard';
import {DimensionConstants, height} from '../../constants/DimensionConstants';
import HomeMidHeader from '../../components/HomeMidHeader';
import Spacing from '../../components/Spacing';
import ContactCards from '../../components/ContactCards';
import {ImageConstants} from '../../constants/ImageConstants';
import RightArrowIcon from '../../assets/icons/RightArrowIcon';
import SearchContainer from '../../components/SearchContainer';
import PlusIcon from '../../assets/icons/PlusIcon';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import GlobeIcon from '../../assets/icons/GlobeIcon';
import {useForm} from 'react-hook-form';
import CommonForm from '../../utils/CommonForm';
import {validationSchema} from '../../utils/Validations';
const SavioursScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(
      validationSchema.pick(['fullName', 'email', 'phoneNumber', 'country']),
    ),
  });
  const data = [
    {heading: 'Ajay Singh', subHeading: 'ajaysingh123@gmail.com'},
    {heading: 'Ajay Singh', subHeading: 'ajaysingh123@gmail.com'},
    {heading: 'Ajay Singh', subHeading: 'ajaysingh123@gmail.com'},
    {heading: 'Ajay Singh', subHeading: 'ajaysingh123@gmail.com'},
  ];
  const fields = [
    {
      name: 'fullName',
      icon: <GlobeIcon />,
      placeholder: 'Full name',
      maxLength: 20,
      keyboardType: 'default',
    },
    {
      name: 'email',
      placeholder: 'Email address',
      icon: <GlobeIcon />,
      maxLength: 50,
      keyboardType: 'email-address',
    },
    {
      name: 'phoneNumber',
      placeholder: 'Phone Number',
      icon: <GlobeIcon />,
      maxLength: 10,
      keyboardType: 'phone-pad',
    },
    {
      name: 'relation',
      options: [
        {label: 'Father', value: 'India'},
        {label: 'Mother', value: 'Australia'},
        {label: 'Brother', value: 'Brother'},
        {label: 'Sister', value: 'Sister'},
      ],
      placeholder: 'Relation',
      icon: <GlobeIcon />,
    },
  ];
  return (
    <MainBackground noPadding style={styles.background}>
      <CustomHeader
        title="Saviours"
        backgroundColor="#fff"
        backPress={() => navigation.goBack()}
        icon={<PlusIcon marginRight={DimensionConstants.fifteen} />}
        onIconPress={() => setModalVisible(true)}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <SearchContainer />
          <Spacing height={DimensionConstants.twentyFour} />
          <HomeMidHeader
            title="My communities"
            onPress={() => navigation.navigate('CommunityScreen')}
          />
          <Spacing height={DimensionConstants.twentyFour} />
          <ContactCards
            familyCardPress={() => navigation.navigate('FamilyScreen')}
          />
          <Spacing height={DimensionConstants.fourteen} />
          {data.map((item, index) => (
            <CustomCard key={index} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <Image
                  source={ImageConstants.girlImage}
                  style={styles.contactImage}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.heading}>{item.heading}</Text>
                  <Text style={styles.subHeading}>{item.subHeading}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('MembersInformationScreen')}>
                <RightArrowIcon color="black" />
              </TouchableOpacity>
            </CustomCard>
          ))}
        </View>
      </ScrollView>
      <CustomModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        modalHeight={height / 1.8}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View>
            <View>
              <Spacing height={DimensionConstants.ten} />
              <Text
                style={{
                  fontSize: DimensionConstants.sixteen,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                Add member details
              </Text>
              <Spacing height={DimensionConstants.twentyFour} />

              <CommonForm control={control} fields={fields} errors={errors} />
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: DimensionConstants.fourteen,
                    fontWeight: '500',
                    textAlign: 'center',
                  }}>
                  Enable Alert
                </Text>
                <Switch
                  value={isEnabled}
                  onValueChange={toggleSwitch}
                  trackColor={{false: '#ccc', true: 'rgba(0, 91, 187, 0.1)'}}
                  thumbColor={isEnabled ? '#0279E1' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CustomButton
              width={'48%'}
              color={'#ffffff'}
              borderColor={'#F2F7FC'}
              textColor={'#000000'}
              text={'Cancel'}
              onPress={() => setModalVisible(false)}
            />
            <CustomButton width={'48%'} text={'Add'} />
          </View>
        </View>
      </CustomModal>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#F2F7FC',
  },
  container: {
    padding: DimensionConstants.sixteen,
  },
  searchCard: {
    padding: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DimensionConstants.five,
    paddingHorizontal: DimensionConstants.fifteen,
  },
  searchInput: {
    flex: 1,
    marginLeft: DimensionConstants.eight,
    fontSize: DimensionConstants.fourteen,
  },
  contactCard: {
    borderRadius: DimensionConstants.ten,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DimensionConstants.ten,
    marginTop: DimensionConstants.ten,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactImage: {
    height: DimensionConstants.fifty,
    width: DimensionConstants.fifty,
    borderRadius: DimensionConstants.twentyFive,
  },
  textContainer: {
    marginLeft: DimensionConstants.ten,
  },
  heading: {
    fontWeight: '600',
    fontSize: DimensionConstants.fourteen,
  },
  subHeading: {
    color: '#8B8B8B',
    fontWeight: '500',
    fontSize: DimensionConstants.twelve,
  },
});

export default SavioursScreen;
