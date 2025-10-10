// Server configuration - Production Environment
export const serverConfig = {
  environment: 'production',
  backend: {
    url: process.env['BACKEND_URL'] || 'https://rbro-mortgage-calculator-backend.raiffeisen.ro',
    timeout: 30000
  },
  adminService: {
    url: process.env['ADMIN_SERVICE_URL'] || 'https://rbro-loan-calculation-admin-service.raiffeisen.ro',
    timeout: 30000
  },
  server: {
    port: parseInt(process.env['PORT'] || '4000', 10),
    logLevel: process.env['LOG_LEVEL'] || 'warn'
  }
};

