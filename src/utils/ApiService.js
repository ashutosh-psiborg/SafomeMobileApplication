import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ip = '10.5.50.241';
const port = '8000';
const baseUrl = `http://${ip}:${port}/api/v1/`;

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
      response.config.url.includes('/register') ||
      response.config.url.includes('/login') ||
      response.config.url.includes('/loginVerifyOTP') 
    ) {
      const token = response.data?.token;
      if (token) {
        try {
          await AsyncStorage.setItem('authToken', token); 
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


const fetcher = async ({ method, url, data, params, noAuth = false }) => {
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
