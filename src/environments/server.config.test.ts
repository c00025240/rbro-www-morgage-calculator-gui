// Server configuration - Test Environment
export const serverConfig = {
  environment: 'test',
  backend: {
    url: process.env['BACKEND_URL'] || 'https://rbro-mortgage-calculator-backend-test.apps.ocp4-test.rbro.rbg.cc',
    timeout: 30000
  },
  adminService: {
    url: process.env['ADMIN_SERVICE_URL'] || 'https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc',
    timeout: 30000
  },
  server: {
    port: parseInt(process.env['PORT'] || '4000', 10),
    logLevel: process.env['LOG_LEVEL'] || 'debug'
  }
};

