import {View, Text, Image, TouchableOpacity, Switch} from 'react-native';
import React, {useState} from 'react';
import MainBackground from '../../../components/MainBackground';
import CustomHeader from '../../../components/CustomHeader';
import MenuIcon from '../../../assets/icons/MenuIcon';
import {DimensionConstants} from '../../../constants/DimensionConstants';
import {ImageConstants} from '../../../constants/ImageConstants';
import Spacing from '../../../components/Spacing';
import EditImageIcon from '../../../assets/icons/EditImageIcon';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import {validationSchema} from '../../../utils/Validations';
import CommonForm from '../../../utils/CommonForm';
import GlobeIcon from '../../../assets/icons/GlobeIcon';
const MembersInformationScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(
      validationSchema.pick(['fullName', 'email', 'phoneNumber']),
    ),
    defaultValues: {
      fullName: 'Ajay Singh',
      phoneNumber: '9876543210',
      email: 'ajaysingh123@gmail.com',
    },
  });

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
  ];
  return (
    <MainBackground noPadding>
      <CustomHeader
        title={'Profile Information'}
        backPress={() => navigation.goBack()}
        icon={<MenuIcon marginRight={DimensionConstants.sixteen} />}
      />
      <Spacing height={DimensionConstants.sixteen} />
      <View style={{padding: DimensionConstants.sixteen}}>
        <View style={{alignItems: 'center'}}>
          <View style={{position: 'relative'}}>
            <Image
              source={ImageConstants?.girlImage}
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F2F7FC',
            padding: DimensionConstants.ten,
            borderRadius: DimensionConstants.twenty,
          }}>
          <Text
            style={{fontSize: DimensionConstants.fourteen, fontWeight: '500'}}>
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
    </MainBackground>
  );
};

export default MembersInformationScreen;
