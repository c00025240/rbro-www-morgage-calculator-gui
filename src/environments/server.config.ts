// Server configuration - Development
export const serverConfig = {
  environment: 'development',
  backend: {
    url: process.env['BACKEND_URL'] || 'http://localhost:8080',
    timeout: 30000
  },
  adminService: {
    url: process.env['ADMIN_SERVICE_URL'] || 'https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc',
    timeout: 30000
  },
  server: {
    port: parseInt(process.env['PORT'] || '4000', 10),
    logLevel: 'debug'
  }
};

