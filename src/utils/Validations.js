import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),

  country: Yup.string().required('Country is required'),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character (@, $, !, %, *, ?, &)'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),

  deviceName: Yup.string()
    .required('Device name is required')
    .matches(/^[a-zA-Z0-9\s-]+$/, 'Device name can only contain letters, numbers, spaces, and hyphens'),

  deviceId: Yup.string()
    .required('Device ID is required')
    .matches(/^[0-9]{10}$/, 'Device ID must be exactly 10 digits'),

  imei: Yup.string()
    .required('IMEI number is required')
    .matches(/^[0-9]{15}$/, 'IMEI number must be exactly 15 digits'),
});
