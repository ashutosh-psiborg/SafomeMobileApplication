import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import PlusIcon from '../../../assets/icons/PlusIcon';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import CustomCard from '../../../components/CustomCard';
import {ImageConstants} from '../../../constants/ImageConstants';
import Spacing from '../../../components/Spacing';

const communities = [
  {
    name: 'Family',
    totalMembers: 70,
    extraMembers: '+67',
    avatars: [
      ImageConstants.avatar,
      ImageConstants.avatar2,
      ImageConstants.avatar3,
    ],
  },
  {
    name: 'Friends',
    totalMembers: 70,
    extraMembers: '+67',
    avatars: [
      ImageConstants.avatar,
      ImageConstants.avatar2,
      ImageConstants.avatar3,
    ],
  },
  {
    name: 'Office mates',
    totalMembers: 45,
    extraMembers: '+42',
    avatars: [
      ImageConstants.avatar,
      ImageConstants.avatar2,
      ImageConstants.avatar3,
    ],
  },
];

const CommunityScreen = () => {
  return (
    <MainBackground noPadding style={styles.container}>
      <CustomHeader
        backgroundColor="#fff"
        title="My communities"
        icon={<PlusIcon marginRight={DimensionConstants.ten} />}
      />
      <View style={styles.content}>
        {communities.map((community, index) => (
          <View>
            <CustomCard key={index}>
              <View style={styles.row}>
                <View style={styles.avatarContainer}>
                  {community.avatars.map((source, idx) => (
                    <Image
                      key={idx}
                      source={source}
                      style={[
                        styles.avatar,
                        idx > 0 && {marginLeft: -DimensionConstants.fifteen},
                      ]}
                    />
                  ))}
                  <Text style={styles.extraMembers}>
                    {community.extraMembers}
                  </Text>
                </View>
                <Text style={styles.totalCount}>{community.totalMembers}</Text>
              </View>
              <Spacing height={DimensionConstants.ten} />
              <Text style={styles.communityName}>{community.name}</Text>
            </CustomCard>
            <Spacing height={DimensionConstants.ten} />
          </View>
        ))}
      </View>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F7FC',
  },
  content: {
    padding: DimensionConstants.sixteen,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: DimensionConstants.thirtyTwo,
    width: DimensionConstants.thirtyTwo,
    borderRadius: DimensionConstants.sixteen,
    borderWidth: 1,
    borderColor: '#fff',
  },
  extraMembers: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.5)',
    marginLeft: DimensionConstants.twelve,
  },
  totalCount: {
    fontSize: DimensionConstants.twentyEight,
    fontWeight: '500',
  },
  communityName: {
    fontSize: DimensionConstants.fourteen,
    fontWeight: '500',
  },
});

export default CommunityScreen;
