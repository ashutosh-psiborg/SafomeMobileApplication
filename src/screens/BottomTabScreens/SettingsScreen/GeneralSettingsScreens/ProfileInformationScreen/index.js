import React, {useEffect, useState} from 'react';
import {View, Image, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {validationSchema} from '../../../../../utils/Validations';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import Spacing from '../../../../../components/Spacing';
import {DimensionConstants} from '../../../../../constants/DimensionConstants';
import {ImageConstants} from '../../../../../constants/ImageConstants';
import EditImageIcon from '../../../../../assets/icons/EditImageIcon';
import MailIcon from '../../../../../assets/icons/MailIcon';
import DeviceCallIcon from '../../../../../assets/icons/DeviceCallIcon';
import CountryIcon from '../../../../../assets/icons/CountryIcon';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import CommonForm from '../../../../../utils/CommonForm';
import ProfileEditIcon from '../../../../../assets/icons/ProfileEditIcon';
import CalenderIcon from '../../../../../assets/icons/CalenderIcon';
import GenderIcon from '../../../../../assets/icons/GenderIcon';
import ProfileLocationIcon from '../../../../../assets/icons/ProfileLocationIcon';
import fetcher from '../../../../../utils/ApiService';
import Loader from '../../../../../components/Loader';
import CustomButton from '../../../../../components/CustomButton';
import {useMutation, useQuery} from '@tanstack/react-query';
import {launchImageLibrary} from 'react-native-image-picker';

const ProfileInformationScreen = ({navigation}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const {data, isLoading, error} = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => fetcher({method: 'GET', url: 'auth/profile'}),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(
      validationSchema.pick(['fullName', 'email', 'phoneNumber', 'country']),
    ),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      country: '',
      dateOfBirth: '',
      address: '',
      gender: '',
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        fullName: data?.data?.user?.fullName || '',
        phoneNumber: data?.data?.user?.phoneNumber || '',
        email: data?.data?.user?.email || '',
        country: data?.data?.user?.countryCode?.split(' (')[0] || '',
        dateOfBirth: data?.data?.user?.dateOfBirth || '',
        address: data?.data?.user?.address || '',
        gender: data?.data?.user?.gender || '',
      });
      if (data?.data?.user?.avatarUrl) {
        setProfileImage(data?.data?.user?.avatarUrl);
      }
    }
  }, [data, reset]);

  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.7}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setProfileImage(uri);
        }
      }
    });
  };

  const fields = [
    {
      name: 'fullName',
      icon: <ProfileEditIcon />,
      placeholder: 'Full name',
      keyboardType: 'default',
      disabled: !isEditing,
    },
    {
      name: 'email',
      placeholder: 'Email address',
      icon: <MailIcon />,
      maxLength: 50,
      keyboardType: 'email-address',
      disabled: true,
    },
    {
      name: 'phoneNumber',
      placeholder: 'Phone Number',
      icon: <DeviceCallIcon size={24} />,
      maxLength: 10,
      keyboardType: 'phone-pad',
      disabled: true,
    },
    {
      name: 'dateOfBirth',
      icon: <CalenderIcon />,
      placeholder: 'Date of Birth',
      isDate: true,
      disabled: !isEditing,
    },
    {
      name: 'country',
      placeholder: 'Country',
      options: [
        {label: 'India', value: 'India'},
        {label: 'Australia', value: 'Australia'},
      ],
      icon: <CountryIcon />,
      disabled: true,
    },
    {
      name: 'address',
      icon: <ProfileLocationIcon />,
      placeholder: 'Address',
      keyboardType: 'default',
      disabled: !isEditing,
    },
    {
      name: 'gender',
      icon: <GenderIcon />,
      placeholder: 'Gender',
      options: [
        {label: 'Male', value: 'MALE'},
        {label: 'Female', value: 'FEMALE'},
      ],
      disabled: !isEditing,
    },
  ];

  const {mutate, isLoading: isUpdating} = useMutation({
    mutationFn: formData =>
      fetcher({method: 'PUT', url: 'auth/updateUser', data: formData}),
    onSuccess: response => {
      Alert.alert(
        'Profile Updated',
        'Your profile details have been updated successfully!',
        [{text: 'OK'}],
      );
      setIsEditing(false);
    },
    onError: error => {
      Alert.alert(
        'Update Failed',
        error?.response?.data?.message || 'Something went wrong!',
        [{text: 'OK'}],
      );
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => fetcher({method: 'DELETE', url: 'auth/deleteAccount'}),
    onSuccess: () => {
      Alert.alert(
        'Account Deleted',
        'Your account has been successfully deleted.',
        [{text: 'OK', onPress: () => navigation.navigate('Login')}],
      );
    },
    onError: error => {
      Alert.alert(
        'Deletion Failed',
        error?.response?.data?.message || 'Something went wrong!',
        [{text: 'OK'}],
      );
    },
  });

  const onSubmit = data => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) => {
        const field = fields.find(f => f.name === key);
        return !field?.disabled;
      }),
    );
    mutate(filteredData);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAccountMutation.mutate(),
        },
      ],
    );
  };

  return (
    <MainBackground noPadding>
      <CustomHeader
        title={'Profile information'}
        backPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{padding: DimensionConstants.sixteen}}
        showsVerticalScrollIndicator={false}>
        <View showsVerticalScrollIndicator={false}>
          <Spacing height={DimensionConstants.thirtyTwo} />
          <View style={{alignItems: 'center'}}>
            <View style={{position: 'relative'}}>
              <Image
                source={
                  profileImage ? {uri: profileImage} : ImageConstants?.avatar
                }
                style={{
                  height: DimensionConstants.oneHundred,
                  width: DimensionConstants.oneHundred,
                  borderRadius: DimensionConstants.fifty,
                }}
              />
              {isEditing && (
                <TouchableOpacity
                  onPress={handleSelectImage}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    padding: 4,
                  }}>
                  <EditImageIcon />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Spacing height={DimensionConstants.thirtyTwo} />
          <CommonForm control={control} fields={fields} errors={errors} />
        </View>
        {isEditing ? (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CustomButton
              text={'Cancel'}
              onPress={() => setIsEditing(false)}
              width={'48%'}
              color="white"
              textColor={'black'}
              borderColor={'#C4C4C4'}
            />
            <CustomButton
              text={'Save'}
              onPress={handleSubmit(onSubmit)}
              width={'48%'}
              isLoading={isUpdating}
            />
          </View>
        ) : (
          <>
            <CustomButton
              text={'Edit Details'}
              onPress={() => setIsEditing(true)}
            />
            <CustomButton
              text={'Delete Account'}
              onPress={handleDeleteAccount}
              color={'transparent'}
              textColor={'#FF3B30'}
              borderColor={'#FF3B30'}
              style={{
                borderWidth: 2,
                borderRadius: DimensionConstants.eight,
                paddingVertical: DimensionConstants.twelve,
                backgroundColor: '#FFF5F5',
              }}
            />
          </>
        )}
      </ScrollView>
      {isLoading && <Loader />}
    </MainBackground>
  );
};

export default ProfileInformationScreen;
