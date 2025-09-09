export const API_CONFIG = {
  // Base URL for the backend API - using proxy in development
  BASE_URL: '/api', // Route through Angular dev proxy
  
  // Mortgage calculation endpoint - backend expects /calculator/mortgage-calculator
  MORTGAGE_CALCULATOR: '/calculator/mortgage-calculator',
  
  // Other potential endpoints
  // PRODUCTS: '/api/products',
  // RATES: '/api/rates',
  // VALIDATION: '/api/validation'
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
