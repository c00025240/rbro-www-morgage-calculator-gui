# Runtime Configuration Implementation - Summary

## Overview

Successfully implemented runtime configuration loading from `env.json` (mounted via ConfigMap in OpenShift) instead of build-time environment variables.

## Changes Made

### 1. Application Configuration (`src/app/app.config.ts`)
- ✅ Added `APP_INITIALIZER` to load config before app starts
- ✅ Ensures configuration is available before any service initializes
- ✅ Prevents race conditions

```typescript
{
  provide: APP_INITIALIZER,
  useFactory: initializeApp,
  deps: [ConfigService],
  multi: true
}
```

### 2. Config Service (`src/app/services/config.service.ts`)
- ✅ Updated `RuntimeConfig` interface to support both naming conventions:
  - `backendUrl` and `BACKEND_URL`
  - `adminServiceUrl` and `ADMIN_SERVICE_URL`
- ✅ Added `getAdminServiceUrl()` method
- ✅ Already had `loadConfig()` method that loads from `/assets/config/env.json`
- ✅ Provides fallback to default config if loading fails

### 3. API Configuration (`src/app/config/api.config.ts`)
- ✅ Removed static environment import dependency
- ✅ Updated to use ConfigService dynamically
- ✅ Added documentation about usage

### 4. Mortgage Calculation Service (`src/app/services/mortgage-calculation.service.ts`)
- ✅ Updated `calculateMortgage()` to use `ConfigService.getApiUrl()`
- ✅ Updated `getDistricts()` to use `ConfigService.getDistrictsUrl()`
- ✅ Added debug logging for API URLs

### 5. Runtime Configuration Files

Created:
- ✅ `src/assets/config/env.json` - Default config for local development
- ✅ `src/assets/config/env.test.json.example` - Example test environment config

### 6. Documentation

Created:
- ✅ `RUNTIME_CONFIG.md` - Comprehensive documentation
- ✅ `QUICK_START.md` - Quick reference guide
- ✅ `IMPLEMENTATION_SUMMARY.md` - This file
- ✅ `deployment-template-corrected.yaml` - Corrected OpenShift template

## Key Fixes to Deployment Template

### Original Issues
1. ❌ Volume mount path was missing `/browser/` subdirectory
2. ❌ No environment variables for server-side proxy configuration
3. ❌ JSON in ConfigMap had unquoted URLs (syntax error)
4. ❌ Health probes were commented out
5. ❌ No Service definition
6. ❌ replicas set to 0

### Fixed Template (`deployment-template-corrected.yaml`)
1. ✅ Volume mount: `/opt/app-root/src/browser/assets/config/`
2. ✅ Environment variables added: `BACKEND_URL`, `ADMIN_SERVICE_URL`, `PORT`, `LOG_LEVEL`
3. ✅ Valid JSON in ConfigMap
4. ✅ Health probes enabled and configured
5. ✅ Service definition included
6. ✅ replicas set to 1

## Configuration Flow

### Client-Side (Browser)
```
1. App starts → APP_INITIALIZER triggered
2. ConfigService.loadConfig() called
3. HTTP GET /assets/config/env.json
4. Config loaded into BehaviorSubject
5. Services use ConfigService.getApiUrl(), etc.
6. API calls made to /api/... and /districts/...
```

### Server-Side (Express)
```
1. Express server starts
2. Reads environment variables (BACKEND_URL, ADMIN_SERVICE_URL)
3. Configures proxy middleware
4. Requests to /api → proxied to BACKEND_URL
5. Requests to /districts → proxied to ADMIN_SERVICE_URL
```

## Testing Checklist

### Local Development
- [x] Created default `env.json` file
- [ ] Run `npm run dev`
- [ ] Verify console shows: "✅ Runtime configuration loaded from env.json"
- [ ] Test mortgage calculation
- [ ] Test districts loading

### Deployment to OpenShift
- [ ] Update ConfigMap with test environment URLs
- [ ] Set environment variables in Deployment
- [ ] Deploy application
- [ ] Check pod logs for config loading
- [ ] Test application in browser
- [ ] Verify API calls work correctly

## Configuration Properties Reference

| Property | Required | Type | Example | Purpose |
|----------|----------|------|---------|---------|
| `production` | Yes | boolean | `false` | Production mode flag |
| `environmentName` | Yes | string | `"test"` | Environment identifier |
| `apiUrl` | Yes | string | `"/api"` | API base path (proxy) |
| `districtsUrl` | Yes | string | `"/districts"` | Districts endpoint path |
| `backendUrl` | Yes | string | `"https://backend.example.com"` | Full backend URL |
| `adminServiceUrl` | Yes | string | `"https://admin.example.com"` | Full admin service URL |
| `enableLogging` | Yes | boolean | `true` | Enable console logging |
| `jentisWorkspace` | Yes | string | `"preview"` | Jentis workspace ID |
| `BACKEND_URL` | Optional | string | Same as `backendUrl` | Alternative naming |
| `ADMIN_SERVICE_URL` | Optional | string | Same as `adminServiceUrl` | Alternative naming |

## Environment-Specific URLs

### Test Environment
```
Backend: https://mtg-calculator-orchestrator-www.apps.ocp4-test.rbro.rbg.cc
Admin:   https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc
```

### PreLive Environment
```
Backend: [Update with prelive URLs]
Admin:   [Update with prelive URLs]
```

### Production Environment
```
Backend: [Update with production URLs]
Admin:   [Update with production URLs]
```

## Migration from Build-Time to Runtime Config

### Before (Build-Time)
- Configuration in `src/environments/environment.*.ts`
- Different builds for different environments
- Configuration baked into JavaScript bundles
- Changes require rebuild and redeploy

### After (Runtime)
- Configuration in `env.json` (mounted from ConfigMap)
- Single build for all environments
- Configuration loaded at app startup
- Changes only require ConfigMap update and pod restart

## Benefits

1. **Single Build Artifact**: Same JavaScript bundle for all environments
2. **Faster Deployments**: No rebuild needed for config changes
3. **Easier Testing**: Test same build in different environments
4. **Better Security**: No hardcoded URLs in source code
5. **Flexibility**: Change config without code changes
6. **DevOps Friendly**: Standard Kubernetes ConfigMap pattern

## Backward Compatibility

The implementation maintains backward compatibility:
- ✅ Supports both `backendUrl` and `BACKEND_URL` property names
- ✅ Falls back to default config if `env.json` not found
- ✅ Existing environment files still work for local development
- ✅ Server config still uses environment variables (no change)

## Next Steps

1. **Test locally** with default `env.json`
2. **Update deployment pipeline** to use `deployment-template-corrected.yaml`
3. **Create ConfigMaps** for each environment (test, prelive, prod)
4. **Deploy to test** environment first
5. **Validate** all functionality works
6. **Roll out** to other environments

## Support Files

| File | Purpose |
|------|---------|
| `QUICK_START.md` | Quick reference for developers |
| `RUNTIME_CONFIG.md` | Detailed technical documentation |
| `deployment-template-corrected.yaml` | OpenShift deployment template |
| `src/assets/config/env.json` | Default local development config |
| `src/assets/config/env.test.json.example` | Example test config |

## Contact & Support

For questions about this implementation, refer to:
- Technical details: `RUNTIME_CONFIG.md`
- Quick start: `QUICK_START.md`
- Deployment: `deployment-template-corrected.yaml`

---

**Implementation Date**: October 15, 2025  
**Status**: ✅ Complete and ready for testing

