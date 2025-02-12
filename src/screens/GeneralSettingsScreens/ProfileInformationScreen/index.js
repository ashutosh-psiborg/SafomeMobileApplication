import React, {useEffect} from 'react';
import {View, Image, TouchableOpacity, ScrollView} from 'react-native';
import {validationSchema} from '../../../utils/Validations';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import MenuIcon from '../../../assets/icons/MenuIcon';
import Spacing from '../../../components/Spacing';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import {ImageConstants} from '../../../constants/ImageConstants';
import EditImageIcon from '../../../assets/icons/EditImageIcon';
import MailIcon from '../../../assets/icons/MailIcon';
import DeviceCallIcon from '../../../assets/icons/DeviceCallIcon';
import CountryIcon from '../../../assets/icons/CountryIcon';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import CommonForm from '../../../utils/CommonForm';
import ProfileEditIcon from '../../../assets/icons/ProfileEditIcon';
import CalenderIcon from '../../../assets/icons/CalenderIcon';
import GenderIcon from '../../../assets/icons/GenderIcon';
import ProfileLocationIcon from '../../../assets/icons/ProfileLocationIcon';
import {useQuery} from '@tanstack/react-query';
import fetcher from '../../../utils/ApiService';
import Loader from '../../../components/Loader';

const ProfileInformationScreen = () => {
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
      text: 'Edit',
    },
    {
      name: 'email',
      placeholder: 'Email address',
      icon: <MailIcon />,
      maxLength: 50,
      keyboardType: 'email-address',
      text: 'Edit',
    },
    {
      name: 'phoneNumber',
      placeholder: 'Phone Number',
      icon: <DeviceCallIcon />,
      maxLength: 10,
      keyboardType: 'phone-pad',
      text: 'Edit',
    },
    {
      name: 'dateOfBirth',
      icon: <CalenderIcon />,
      placeholder: 'Date of Birth',
      keyboardType: 'default',
      text: 'Edit',
    },
    {
      name: 'country',
      placeholder: 'Country',
      options: [
        {label: 'India', value: 'India'},
        {label: 'Australia', value: 'Australia'},
      ],
      icon: <CountryIcon />,
    },
    {
      name: 'address',
      icon: <ProfileLocationIcon />,
      placeholder: 'Address',
      keyboardType: 'default',
      text: 'Edit',
    },
    {
      name: 'gender',
      icon: <GenderIcon />,
      placeholder: 'Gender',
      keyboardType: 'default',
      text: 'Edit',
    },
  ];

  return (
    <MainBackground>
      <CustomHeader title={'Profile information'} icon={<MenuIcon />} />
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

      {isLoading && <Loader />}
    </MainBackground>
  );
};

export default ProfileInformationScreen;
