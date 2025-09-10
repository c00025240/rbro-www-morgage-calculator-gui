export interface CustomHeaders {
  [key: string]: string;
}

export const DEFAULT_HEADERS: CustomHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'X-Client-Version': '1.0.0',
  'X-Client-Platform': 'web',
  'X-RBRO-ApplicationName': 'MortgageCalculator',
  'RICE-NWU-ID': 'RBRO' // Required by backend
};

export const AUTH_HEADERS: CustomHeaders = {
  'Authorization': 'Bearer {token}', // Placeholder for auth token
  'X-User-ID': '{userId}', // Placeholder for user ID
  'X-Session-ID': '{sessionId}' // Placeholder for session ID
};

export const TRACKING_HEADERS: CustomHeaders = {
  'X-Request-ID': '{uuid}', // Format: 99391c7e-ad88-49ec-a2ad-99ddcb1f7721
  'X-RBRO-Request-Id': '{uuid}', // Format: 99391c7e-ad88-49ec-a2ad-99ddcb1f7721
  'X-B3-TraceId': '{uuid}', // Format: 99391c7e-ad88-49ec-a2ad-99ddcb1f7721
  'X-B3-SpanId': '{uuid}', // Format: 99391c7e-ad88-49ec-a2ad-99ddcb1f7721
  'X-Timestamp': '{timestamp}',
  'X-Correlation-ID': '{uuid}' // Format: 99391c7e-ad88-49ec-a2ad-99ddcb1f7721
};

export const BUSINESS_HEADERS: CustomHeaders = {
  'X-Business-Unit': 'mortgage',
  'X-Product-Code': '{productCode}',
  'X-Channel': 'web',
  'X-Language': 'ro-RO'
};
