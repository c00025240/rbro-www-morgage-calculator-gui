import { inject } from '@angular/core';
import { ConfigService } from '../services/config.service';

/**
 * API Configuration
 * Uses runtime configuration loaded from env.json (mounted from ConfigMap in OpenShift)
 * Falls back to build-time environment if runtime config is not available
 */
export const API_CONFIG = {
  // Mortgage calculation endpoint - backend expects /calculator/mortgage-calculator
  MORTGAGE_CALCULATOR: '/calculator/mortgage-calculator',

  // Other potential endpoints
  // PRODUCTS: '/api/products',
  // RATES: '/api/rates',
  // VALIDATION: '/api/validation'
};

/**
 * Get API URL with endpoint
 * Uses runtime configuration from ConfigService
 */
export const getApiUrl = (endpoint: string): string => {
  // Note: This won't work with standalone inject outside injection context
  // Services should use ConfigService directly instead
  return endpoint; // Return relative path - services should prepend base URL
};

/**
 * Get districts URL
 * Uses runtime configuration from ConfigService
 */
export const getDistrictsUrl = (): string => {
  // Services should use ConfigService.getDistrictsUrl() directly
  return '/districts'; // Default fallback
};

/**
 * Get direct URL (passthrough)
 */
export const getDirectUrl = (url: string): string => {
  return url;
};
