import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { serverConfig } from './environments/server.config.js';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Use centralized server configuration
console.log('🚀 Server configuration loaded:', {
  environment: serverConfig.environment,
  backendUrl: serverConfig.backend.url,
  adminServiceUrl: serverConfig.adminService.url,
  port: serverConfig.server.port,
  logLevel: serverConfig.server.logLevel
});

// Allow self-signed certificates in development/test environments
// In production, certificates will be properly managed by the platform
const isDevelopment = serverConfig.environment === 'development' || serverConfig.environment === 'test';
if (isDevelopment) {
  console.log('⚠️  SSL certificate verification disabled for development');
}

// Backend API proxy
app.use('/api', createProxyMiddleware({
  target: serverConfig.backend.url,
  changeOrigin: true,
  secure: !isDevelopment, // Disable SSL verification in dev/test, enable in production
  logLevel: serverConfig.server.logLevel as any,
  pathRewrite: { '^/api': '' },
  timeout: serverConfig.backend.timeout,
  onError: (err, req, res) => {
    console.error('❌ Backend proxy error:', err.message);
    res.status(500).json({ error: 'Backend service unavailable' });
  },
  onProxyReq: (proxyReq, req, res) => {
    if (serverConfig.server.logLevel === 'debug') {
      console.log(`→ Proxying: ${req.method} ${req.url} → ${serverConfig.backend.url}${req.url.replace('/api', '')}`);
    }
  }
}));

// Districts/Admin service proxy
app.use('/districts', createProxyMiddleware({
  target: serverConfig.adminService.url,
  changeOrigin: true,
  secure: !isDevelopment, // Disable SSL verification in dev/test, enable in production
  logLevel: serverConfig.server.logLevel as any,
  pathRewrite: { '^/districts': '/app/loan-admin/v1/districts' },
  timeout: serverConfig.adminService.timeout,
  onError: (err, req, res) => {
    console.error('❌ Admin service proxy error:', err.message);
    res.status(500).json({ error: 'Admin service unavailable' });
  },
  onProxyReq: (proxyReq, req, res) => {
    if (serverConfig.server.logLevel === 'debug') {
      console.log(`→ Proxying: ${req.method} ${req.url} → ${serverConfig.adminService.url}/app/loan-admin/v1/districts`);
    }
  }
}));

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response: Response | null) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined in serverConfig.
 */
if (isMainModule(import.meta.url)) {
  app.listen(serverConfig.server.port, () => {
    console.log(`✅ Node Express server listening on http://localhost:${serverConfig.server.port}`);
    console.log(`📊 Environment: ${serverConfig.environment}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
