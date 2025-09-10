export const API_CONFIG = {
  // Base URL for the backend API - using proxy in development
  BASE_URL: '/api', // Route through Angular dev proxy
  
  // Mortgage calculation endpoint - backend expects /calculator/mortgage-calculator
  MORTGAGE_CALCULATOR: '/calculator/mortgage-calculator',
  
  // Districts endpoint - direct URL to admin service (bypasses proxy)
  DISTRICTS_URL: 'https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc/app/loan-admin/v1/districts',

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
