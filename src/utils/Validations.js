import * as Yup from 'yup';

// Define validation schema
export const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(3, 'Full name should be at least 3 characters long')
    .max(50, 'Full name should not exceed 50 characters'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(
      /^[0-9]{10}$/,
      'Phone number must be exactly 10 digits'
    ),

  country: Yup.string().required('Country is required'),
});
