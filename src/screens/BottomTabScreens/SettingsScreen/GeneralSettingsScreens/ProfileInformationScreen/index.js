import React, {useEffect, useState} from 'react';
import {View, Image, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {validationSchema} from '../../../../../utils/Validations';
import MainBackground from '../../../../../components/MainBackground';
import CustomHeader from '../../../../../components/CustomHeader';
import MenuIcon from '../../../../../assets/icons/MenuIcon';
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

const ProfileInformationScreen = ({navigation}) => {
  const [isEditing, setIsEditing] = useState(false);
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
        fullName: data?.user?.fullName || '',
        phoneNumber: data?.user?.phoneNumber || '',
        email: data?.user?.email || '',
        country: data?.user?.country || '',
        dateOfBirth: data?.user?.dateOfBirth || '',
        address: data?.user?.address || '',
        gender: data?.user?.gender || '',
      });
    }
  }, [data, reset]);

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
      disabled: !isEditing,
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
    mutationFn: async formData => {
      return fetcher({
        method: 'PUT',
        url: 'auth/updateUser',
        data: formData,
      });
    },
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

  const onSubmit = data => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) => {
        const field = fields.find(f => f.name === key);
        return !field?.disabled;
      }),
    );
    mutate(filteredData);
    
  };

  return (
    <MainBackground noPadding>
      <CustomHeader
        title={'Profile information'}
        icon={<MenuIcon marginRight={DimensionConstants.ten} />}
        backPress={() => navigation.goBack()}
      />
      <View style={{padding: DimensionConstants.sixteen}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Spacing height={DimensionConstants.thirtyTwo} />
          <View style={{alignItems: 'center'}}>
            <View style={{position: 'relative'}}>
              <Image
                source={ImageConstants?.avatar}
                style={{
                  height: DimensionConstants.oneHundred,
                  width: DimensionConstants.oneHundred,
                  borderRadius: DimensionConstants.fifty,
                }}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  padding: 4,
                }}>
                <EditImageIcon />
              </TouchableOpacity>
            </View>
          </View>
          <Spacing height={DimensionConstants.thirtyTwo} />
          <CommonForm control={control} fields={fields} errors={errors} />
        </ScrollView>
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
            />
          </View>
        ) : (
          <CustomButton
            text={'Edit Details'}
            onPress={() => setIsEditing(true)}
          />
        )}
      </View>
      {isLoading && <Loader />}
    </MainBackground>
  );
};

export default ProfileInformationScreen;
