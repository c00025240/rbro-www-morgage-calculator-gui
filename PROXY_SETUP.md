# Proxy Configuration Guide

## Overview
The application uses Angular dev server proxy to route API calls to backend services during development. This avoids CORS issues and mimics production routing.

## Configuration Files

### 1. `proxy.conf.json`
Defines proxy rules for different endpoints:

```json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/api": ""
    }
  },
  "/districts": {
    "target": "https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/districts": "/app/loan-admin/v1/districts"
    }
  }
}
```

### 2. `src/app/config/api.config.ts`
Defines API endpoints used in the application:

```typescript
export const API_CONFIG = {
  BASE_URL: '/api',
  MORTGAGE_CALCULATOR: '/calculator/mortgage-calculator',
  DISTRICTS_URL: '/districts'
};
```

## How It Works

### Mortgage Calculator API
1. **Frontend call**: `GET /api/calculator/mortgage-calculator`
2. **Proxy rewrites to**: `GET http://localhost:8080/calculator/mortgage-calculator`
3. **Backend receives**: `GET /calculator/mortgage-calculator`

### Districts API
1. **Frontend call**: `GET /districts`
2. **Proxy rewrites to**: `GET https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc/app/loan-admin/v1/districts`
3. **Backend receives**: `GET /app/loan-admin/v1/districts`

## Running the Application

### With Proxy (Default)
```bash
npm start
# or
ng serve --proxy-config proxy.conf.json
```

### Without Proxy
```bash
npm run start:no-proxy
# or
ng serve
```

## Updating Backend URLs

### For Development (Local Backend)
Edit `proxy.conf.json` and update the target URL:
```json
{
  "/api/*": {
    "target": "http://localhost:8080"
  }
}
```

### For Testing Against Remote Backend
```json
{
  "/api/*": {
    "target": "https://your-test-backend.com",
    "secure": true
  }
}
```

## Troubleshooting

### Issue: CORS Errors
- **Solution**: Make sure proxy is enabled (`npm start`)
- Check that `changeOrigin: true` is set in proxy config

### Issue: 404 Not Found
- **Solution**: Verify `pathRewrite` rules match backend expectations
- Check backend logs to see what path it receives

### Issue: Connection Refused
- **Solution**: Ensure backend is running on the target URL
- Check firewall/network settings

### Debugging
Set `logLevel: "debug"` in `proxy.conf.json` to see detailed proxy logs:
```json
{
  "/api/*": {
    "logLevel": "debug"
  }
}
```

## Production Configuration

### Option 1: Using Node.js Express Server (SSR - Recommended)

The application includes a production server (`src/server.ts`) with built-in proxy middleware.

**Build and run:**
```bash
npm run build
npm run serve:ssr
```

**Environment variables:**
```bash
# Set backend URLs
export BACKEND_URL=http://backend-service:8080
export ADMIN_SERVICE_URL=https://admin-service.domain.com
export PORT=4000
export NODE_ENV=production

# Start server
node dist/rbro-www-mortgage-calculator-gui/server/server.mjs
```

**Docker example:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY dist/rbro-www-mortgage-calculator-gui ./
ENV BACKEND_URL=http://backend:8080
ENV ADMIN_SERVICE_URL=https://admin.domain.com
ENV PORT=4000
CMD ["node", "server/server.mjs"]
```

### Option 2: Using nginx (Static + Reverse Proxy)

Configure nginx to route requests:
```nginx
location /api/ {
    proxy_pass http://backend-service:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location /districts {
    proxy_pass https://admin-service/app/loan-admin/v1/districts;
    proxy_set_header Host $host;
}

location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
}
```

## Proxy Middleware vs Angular CLI Proxy

### Development: `proxy.conf.json`
- Used by Angular CLI during `ng serve`
- Fast hot-reload
- Simple configuration
- Only for development

### Production: `server.ts` proxyMiddleware
- Used by Node.js Express server
- Server-Side Rendering (SSR)
- Environment-based configuration
- Error handling
- Production-ready

**Key differences:**
| Feature | proxy.conf.json | proxyMiddleware |
|---------|----------------|-----------------|
| When | Development | Production |
| Server | Angular CLI | Node.js Express |
| SSR | No | Yes |
| Config | JSON file | TypeScript code |
| Env vars | No | Yes |
| Error handling | Basic | Advanced |

