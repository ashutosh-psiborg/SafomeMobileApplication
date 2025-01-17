import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ip = '10.5.50.241';
const port = '3000';
const baseUrl = `http://${ip}:${port}/`;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add request interceptor to include token dynamically
api.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('authToken'); // Retrieve token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Set Authorization header
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    console.log(`Outgoing request to ${config.url}`, {
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

// ✅ Add response interceptor to store token when registering or logging in
api.interceptors.response.use(
  async response => {
    if (
      response.config.url.includes('/register') ||
      response.config.url.includes('/login')
    ) {
      const token = response.data?.token;
      if (token) {
        try {
          await AsyncStorage.setItem('authToken', token); // Store token
          console.log('Token stored successfully:', token);
        } catch (error) {
          console.error('Error storing token:', error);
        }
      }
    }
    console.log(`Response from ${response.config.url}`, {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  error => {
    console.error('Response error:', {
      message: error.message,
      response: error.response,
    });
    return Promise.reject(error);
  },
);

const fetcher = async ({method, url, data, params}) => {
  const response = await api({
    method,
    url,
    data,
    params,
  });
  return response.data;
};

export default fetcher;
