import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import PlusIcon from '../../../assets/icons/PlusIcon';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import SearchContainer from '../../../components/SearchContainer';
import CustomCard from '../../../components/CustomCard';
import RightArrowIcon from '../../../assets/icons/RightArrowIcon';
import {ImageConstants} from '../../../constants/ImageConstants';
import {useRoute} from '@react-navigation/native';

const FamilyScreen = ({navigation}) => {
  const allContacts = [
    {heading: 'Rahul Sharma', subHeading: 'rahul.sharma@email.com'},
    {heading: 'Neha Verma', subHeading: 'neha.verma@email.com'},
    {heading: 'Vikram Patel', subHeading: 'vikram.patel@email.com'},
    {heading: 'Priya Kapoor', subHeading: 'priya.kapoor@email.com'},
    {heading: 'Suresh Nair', subHeading: 'suresh.nair@email.com'},
    {heading: 'Anjali Gupta', subHeading: 'anjali.gupta@email.com'},
    {heading: 'Rohan Mehta', subHeading: 'rohan.mehta@email.com'},
    {heading: 'Kavita Das', subHeading: 'kavita.das@email.com'},
    {heading: 'Arjun Malhotra', subHeading: 'arjun.malhotra@email.com'},
    {heading: 'Simran Kaur', subHeading: 'simran.kaur@email.com'},
  ];

  const [filteredContacts, setFilteredContacts] = useState(allContacts);
  const route = useRoute();
  const {type} = route.params;
  // console.log(type)
  const handleSearch = query => {
    if (!query.trim()) {
      setFilteredContacts(allContacts);
    } else {
      const filteredData = allContacts.filter(
        item =>
          item.heading.toLowerCase().includes(query.toLowerCase()) ||
          item.subHeading.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredContacts(filteredData);
    }
  };

  return (
    <MainBackground noPadding style={{backgroundColor: '#F2F7FC'}}>
      <CustomHeader
        title={type === 'friends' ? 'Friends' : 'Family'}
        // icon={<PlusIcon marginRight={DimensionConstants.ten} />}
        backgroundColor={'#fff'}
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.sixteen}}>
        <SearchContainer onSearch={handleSearch} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredContacts.map((item, index) => (
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
        </ScrollView>
      </View>
    </MainBackground>
  );
};

export default FamilyScreen;

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
