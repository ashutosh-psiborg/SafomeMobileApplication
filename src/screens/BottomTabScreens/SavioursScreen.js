import {
  View,
  TextInput,
  Image,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React from 'react';
import MainBackground from '../../components/MainBackground';
import CustomHeader from '../../components/CustomHeader';
import SearchIcon from '../../assets/icons/SearchIcon';
import CustomCard from '../../components/CustomCard';
import {DimensionConstants} from '../../constants/DimensionConstants';
import HomeMidHeader from '../../components/HomeMidHeader';
import Spacing from '../../components/Spacing';
import ContactCards from '../../components/ContactCards';
import {ImageConstants} from '../../constants/ImageConstants';
import RightArrowIcon from '../../assets/icons/RightArrowIcon';

const SavioursScreen = () => {
  const data = [
    {heading: 'Ajay Singh', subHeading: 'ajaysingh123@gmail.com'},
    {heading: 'Ajay Singh', subHeading: 'ajaysingh123@gmail.com'},
    {heading: 'Ajay Singh', subHeading: 'ajaysingh123@gmail.com'},
    {heading: 'Ajay Singh', subHeading: 'ajaysingh123@gmail.com'},
  ];

  return (
    <MainBackground noPadding style={styles.background}>
      <CustomHeader title="Saviours" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Search Box */}
          <CustomCard style={styles.searchCard}>
            <View style={styles.searchContainer}>
              <SearchIcon />
              <TextInput
                style={styles.searchInput}
                placeholder="Search here..."
                placeholderTextColor="#888"
              />
            </View>
          </CustomCard>

          <Spacing height={DimensionConstants.twentyFour} />
          <HomeMidHeader title="My communities" />
          <Spacing height={DimensionConstants.twentyFour} />
          <ContactCards />
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

              <View>
                <RightArrowIcon color="black" />
              </View>
            </CustomCard>
          ))}
        </View>
      </ScrollView>
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
