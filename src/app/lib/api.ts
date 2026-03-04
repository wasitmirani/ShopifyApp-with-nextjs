import axios from 'axios';
import { getSessionToken } from '@shopify/app-bridge/utilities';
import { createApp } from '@shopify/app-bridge';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach session token + shop domain on every request
api.interceptors.request.use(async (config) => {
  const shop = sessionStorage.getItem('shopify-shop');
  if (shop) config.headers['x-shopify-shop-domain'] = shop;
  return config;
});

// Handle 402 Payment Required — redirect to plans page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 402) {
      window.location.href = '/plans';
    }
    return Promise.reject(err);
  },
);

export default api;