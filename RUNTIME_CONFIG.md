# Runtime Configuration

This application uses runtime configuration loaded from `/assets/config/env.json` instead of build-time environment variables. This allows the same built artifact to be deployed across different environments (test, prelive, production) with different configurations.

## How It Works

### 1. Configuration Loading

The application loads configuration at startup using Angular's `APP_INITIALIZER`:

```typescript
// src/app/app.config.ts
export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig().toPromise();
}
```

This ensures the configuration is loaded **before** the application starts, preventing any race conditions.

### 2. ConfigMap Mounting (OpenShift/Kubernetes)

In OpenShift, the configuration is provided via:

#### A. ConfigMap for Client-Side Configuration
The ConfigMap gets mounted to `/opt/app-root/src/browser/assets/config/` (note: `/browser/` in the path for built app):

```yaml
volumes:
  - configMap:
      name: ${APPLICATION_NAME}${DC_SUFFIX}
    name: volume-config
volumeMounts:
  - mountPath: /opt/app-root/src/browser/assets/config/
    name: volume-config
```

The ConfigMap contains `env.json`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ${APPLICATION_NAME}${DC_SUFFIX}
data:
  env.json: |
    {
      "production": false,
      "environmentName": "test",
      "apiUrl": "/api",
      "districtsUrl": "/districts",
      "backendUrl": "https://mtg-calculator-orchestrator-www.apps.ocp4-test.rbro.rbg.cc",
      "adminServiceUrl": "https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc",
      "enableLogging": true,
      "jentisWorkspace": "preview",
      "BACKEND_URL": "https://mtg-calculator-orchestrator-www.apps.ocp4-test.rbro.rbg.cc",
      "ADMIN_SERVICE_URL": "https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc"
    }
```

#### B. Environment Variables for Server-Side Proxy

The Node.js Express server (SSR) needs environment variables to configure the proxy:

```yaml
env:
  - name: BACKEND_URL
    value: "https://mtg-calculator-orchestrator-www.apps.ocp4-test.rbro.rbg.cc"
  - name: ADMIN_SERVICE_URL
    value: "https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc"
  - name: PORT
    value: "8080"
  - name: LOG_LEVEL
    value: "info"
```

**Why both?**
- **Client-side** (`env.json`): Used by Angular app running in the browser
- **Server-side** (environment variables): Used by Express server for SSR and API proxying

### 3. Using Configuration in Services

Services can inject `ConfigService` to access runtime configuration:

```typescript
import { ConfigService } from '../services/config.service';

@Injectable({ providedIn: 'root' })
export class MortgageCalculationService {
  constructor(private configService: ConfigService) {}

  calculateMortgage(request: MortgageCalculationRequest) {
    const baseUrl = this.configService.getApiUrl();
    const apiUrl = `${baseUrl}${API_CONFIG.MORTGAGE_CALCULATOR}`;
    return this.http.post<MortgageCalculationResponse>(apiUrl, request);
  }
}
```

## Configuration Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `production` | boolean | Whether this is a production environment | `false` |
| `environmentName` | string | Name of the environment | `"test"`, `"prelive"`, `"production"` |
| `apiUrl` | string | Base URL for API calls (usually a proxy path) | `"/api"` |
| `districtsUrl` | string | URL for districts endpoint | `"/districts"` |
| `backendUrl` | string | Full backend URL | `"https://backend.example.com"` |
| `adminServiceUrl` | string | Admin service URL | `"https://admin.example.com"` |
| `enableLogging` | boolean | Enable console logging | `true` |
| `jentisWorkspace` | string | Jentis workspace identifier | `"preview"`, `"production"` |
| `BACKEND_URL` | string | Alternative backend URL (uppercase) | Same as `backendUrl` |
| `ADMIN_SERVICE_URL` | string | Alternative admin URL (uppercase) | Same as `adminServiceUrl` |

**Note**: Both lowercase (`backendUrl`) and uppercase (`BACKEND_URL`) properties are supported for backward compatibility.

## Local Development

For local development, create or modify `/src/assets/config/env.json`:

```json
{
  "production": false,
  "environmentName": "development",
  "apiUrl": "/api",
  "districtsUrl": "/districts",
  "backendUrl": "http://localhost:8080",
  "adminServiceUrl": "https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc",
  "enableLogging": true,
  "jentisWorkspace": "preview",
  "BACKEND_URL": "http://localhost:8080",
  "ADMIN_SERVICE_URL": "https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc"
}
```

## Fallback Behavior

If `env.json` cannot be loaded (e.g., file not found), the application falls back to default configuration defined in `ConfigService`:

```typescript
private defaultConfig: RuntimeConfig = {
  production: false,
  environmentName: 'development',
  apiUrl: '/api',
  districtsUrl: '/districts',
  backendUrl: 'http://localhost:8080',
  adminServiceUrl: 'https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc',
  enableLogging: true,
  jentisWorkspace: 'preview',
  location: 'development'
};
```

## Environment-Specific Configurations

### Test Environment
- `backendUrl`: `https://mtg-calculator-orchestrator-www.apps.ocp4-test.rbro.rbg.cc`
- `adminServiceUrl`: `https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc`
- `enableLogging`: `true`
- `jentisWorkspace`: `preview`

### PreLive Environment
- Update the ConfigMap in your deployment template with prelive URLs
- `jentisWorkspace`: `"prelive"` or `"preview"`

### Production Environment
- Update the ConfigMap in your deployment template with production URLs
- `production`: `true`
- `enableLogging`: `false` (optional, for performance)
- `jentisWorkspace`: `"production"`

## Debugging

The application logs configuration loading:

```
✅ Runtime configuration loaded from env.json: {production: false, environmentName: "test", ...}
```

Or if loading fails:

```
⚠️ Failed to load runtime config, using default: [error details]
📋 Using default configuration: {production: false, environmentName: "development", ...}
```

When making API calls, the service logs (if `enableLogging` is true):

```
🚀 Mortgage calculation request to: /api/calculator/mortgage-calculator
📋 Using base URL from config: /api
```

## Build Process

The application is built **once** and the same artifact is deployed to all environments. Configuration differences are handled at runtime through:
1. Mounted ConfigMap (`env.json`) for client-side configuration
2. Environment variables for server-side proxy configuration

This approach provides:
- **Single build artifact** for all environments
- **Environment-specific configuration** without rebuilding
- **Easy configuration updates** without redeployment (just update ConfigMap/env vars and restart pods)
- **No secrets in source code** or build artifacts

## Server-Side Rendering (SSR) Architecture

The application uses Angular Universal with an Express server:

```
Browser → Express Server (port 8080) → Backend Services
          ↓ proxies ↓
          /api → BACKEND_URL
          /districts → ADMIN_SERVICE_URL/app/loan-admin/v1/districts
```

### How Requests Flow:

1. **Client makes request**: `POST /api/calculator/mortgage-calculator`
2. **Express proxy intercepts**: Configured via environment variable `BACKEND_URL`
3. **Proxy forwards to**: `https://mtg-calculator-orchestrator-www.apps.ocp4-test.rbro.rbg.cc/calculator/mortgage-calculator`
4. **Response flows back** through proxy to client

### Configuration Points:

| Configuration | Where | Used By | Purpose |
|---------------|-------|---------|---------|
| `BACKEND_URL` env var | Deployment | Express server | Server-side proxy target |
| `ADMIN_SERVICE_URL` env var | Deployment | Express server | Districts API proxy target |
| `env.json` file | ConfigMap mount | Angular app | Client-side runtime config |

## Deployment Template

See `deployment-template-corrected.yaml` for the complete deployment template with:
- ✅ ConfigMap with `env.json` for client-side
- ✅ Environment variables for server-side proxy
- ✅ Proper volume mount path (`/browser/assets/config/`)
- ✅ Health checks (liveness and readiness probes)
- ✅ Service definition

## Important Notes

### Volume Mount Path

When deploying the built application, the static assets are in the `browser/` subdirectory. Therefore:
- **Local development**: `/src/assets/config/env.json`
- **Built application**: `/dist/rbro-www-mortgage-calculator-gui/browser/assets/config/env.json`
- **Container mount**: `/opt/app-root/src/browser/assets/config/env.json`

### Environment Variables vs ConfigMap

- Use **environment variables** for server-side configuration (proxy URLs, ports, etc.)
- Use **ConfigMap** for client-side configuration (downloaded by browser as JSON)
- Keep them in sync for consistency

