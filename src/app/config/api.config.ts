import { environment } from '../../environments/environment';

export const API_CONFIG = {
  // Base URL for the backend API - routed through proxy
  BASE_URL: environment.apiUrl, // '/api' - routed through proxy
  
  // Mortgage calculation endpoint - backend expects /calculator/mortgage-calculator
  MORTGAGE_CALCULATOR: '/calculator/mortgage-calculator',
  
  // Districts endpoint - routed through proxy
  DISTRICTS_URL: environment.districtsUrl, // '/districts' - routed through proxy

  // Other potential endpoints
  // PRODUCTS: '/api/products',
  // RATES: '/api/rates',
  // VALIDATION: '/api/validation'
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getDirectUrl = (url: string): string => {
  return url;
};
