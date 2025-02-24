import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ip = '52.65.120.67';
const port = '8080';
const baseUrl = `http://${ip}:${port}/api/v1/`;
// const baseUrl = `https://vl4gt0fs-8080.inc1.devtunnels.ms/api/v1/`;Test

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    try {
      if (!config.noAuth) {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
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

api.interceptors.response.use(
  async response => {
    if (
      response.config.url.includes('/auth/login') ||
      response.config.url.includes('/auth/loginVerifyOTP') ||
      response.config.url.includes('/auth/googleLogin')
    ) {
      const token = response.data?.token;
      if (token) {
        try {
          // Store the token and then immediately fetch it to verify
          await AsyncStorage.setItem('authToken', token);
          const checkToken = await AsyncStorage.getItem('authToken');
          console.log('✅ Token stored successfully:', checkToken);
        } catch (error) {
          console.error('Error storing token:', error);
        }
      }
    }

    return response;
  }
);


const fetcher = async ({method, url, data, params, noAuth = false}) => {
  const response = await api({
    method,
    url,
    data,
    params,
    noAuth,
  });
  return response.data;
};

export default fetcher;
