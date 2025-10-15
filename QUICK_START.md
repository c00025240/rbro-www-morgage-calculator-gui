# Quick Start - Runtime Configuration

## TL;DR

Your application now loads configuration from `/assets/config/env.json` at runtime instead of using build-time environment files. This allows the same build to work across all environments.

## What Changed

### ✅ Completed Changes

1. **APP_INITIALIZER** added to `app.config.ts` - loads config before app starts
2. **ConfigService** updated - supports both `backendUrl` and `BACKEND_URL` properties
3. **MortgageCalculationService** updated - uses `ConfigService` for dynamic URLs
4. **Default env.json** created in `src/assets/config/env.json` for local development
5. **Documentation** added in `RUNTIME_CONFIG.md`
6. **Corrected deployment template** created in `deployment-template-corrected.yaml`

### 📋 What You Need to Do

#### For Local Development

Nothing! The app will work out of the box with the default `env.json` file:

```bash
npm install
npm run dev
```

The app will load configuration from `src/assets/config/env.json`.

#### For Deployment to Test/PreLive/Production

Use the corrected deployment template: `deployment-template-corrected.yaml`

**Key changes from your original template:**

1. ✅ **Volume mount path corrected**: 
   ```yaml
   mountPath: /opt/app-root/src/browser/assets/config/
   ```
   (Note: added `/browser/` in the path)

2. ✅ **Environment variables added** for server-side proxy:
   ```yaml
   env:
     - name: BACKEND_URL
       value: "https://mtg-calculator-orchestrator-www.apps.ocp4-test.rbro.rbg.cc"
     - name: ADMIN_SERVICE_URL
       value: "https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc"
   ```

3. ✅ **Health probes enabled** (uncommented)

4. ✅ **Service definition added**

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Angular App                                         │   │
│  │  - Loads env.json at startup (APP_INITIALIZER)      │   │
│  │  - ConfigService provides runtime config            │   │
│  │  - Makes requests to /api and /districts            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP Requests
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              Express Server (SSR) - Port 8080                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Proxy Configuration (from env vars)                 │   │
│  │  /api → BACKEND_URL                                  │   │
│  │  /districts → ADMIN_SERVICE_URL/...                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ Proxies to
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
│  - mtg-calculator-orchestrator-www                          │
│  - rbro-loan-calculation-admin-service-www                  │
└─────────────────────────────────────────────────────────────┘
```

### Two Configuration Sources

| Purpose | Source | Format | Used By |
|---------|--------|--------|---------|
| Client-side runtime config | ConfigMap → `env.json` | JSON file | Angular app in browser |
| Server-side proxy config | Environment variables | Key-value pairs | Express server (SSR) |

**Why both?**
- Angular app runs in the browser and loads `env.json` via HTTP
- Express server runs in Node.js and reads environment variables
- Both need the same URLs, so keep them synchronized

## Testing the Setup

### 1. Local Development

```bash
npm run dev
```

Check the console for:
```
✅ Runtime configuration loaded from env.json: {environmentName: "development", ...}
```

### 2. After Deployment

Check the pod logs for:
```
🚀 Server configuration loaded: {environment: "test", backendUrl: "https://...", ...}
✅ Node Express server listening on http://localhost:8080
```

Then check browser console:
```
✅ Runtime configuration loaded from env.json: {environmentName: "test", ...}
```

### 3. Make a Test API Call

The service will log (if `enableLogging: true`):
```
🚀 Mortgage calculation request to: /api/calculator/mortgage-calculator
📋 Using base URL from config: /api
```

## Configuration for Different Environments

### Development (Local)
- Edit: `src/assets/config/env.json`
- Server reads: `src/environments/server.config.ts`

### Test
- ConfigMap: Set URLs to test environment
- Environment variables: Set `BACKEND_URL` and `ADMIN_SERVICE_URL` to test URLs

### PreLive
- ConfigMap: Set URLs to prelive environment
- Environment variables: Set `BACKEND_URL` and `ADMIN_SERVICE_URL` to prelive URLs
- Set `environmentName: "prelive"` and `jentisWorkspace: "prelive"`

### Production
- ConfigMap: Set URLs to production environment
- Environment variables: Set `BACKEND_URL` and `ADMIN_SERVICE_URL` to production URLs
- Set `production: true` and `enableLogging: false` (optional)
- Set `jentisWorkspace: "production"`

## Customizing Configuration

### Adding New Properties

1. Update the `RuntimeConfig` interface in `config.service.ts`:
   ```typescript
   export interface RuntimeConfig {
     // ... existing properties
     myNewProperty: string;
   }
   ```

2. Add to `defaultConfig` in `config.service.ts`:
   ```typescript
   private defaultConfig: RuntimeConfig = {
     // ... existing properties
     myNewProperty: 'default-value'
   };
   ```

3. Add to `env.json` files and ConfigMap

4. Use in your services:
   ```typescript
   const config = this.configService.getConfig();
   const myValue = config?.myNewProperty;
   ```

## Troubleshooting

### Config Not Loading

**Problem**: Console shows "Failed to load runtime config"

**Solutions**:
- Check that `src/assets/config/env.json` exists
- Check that the file is valid JSON (no trailing commas, proper quotes)
- Check browser DevTools → Network tab for 404 errors

### Wrong URLs in Deployed App

**Problem**: App makes requests to wrong backend

**Solutions**:
- Check ConfigMap has correct URLs in `env.json`
- Check environment variables are set: `BACKEND_URL`, `ADMIN_SERVICE_URL`
- Check volume mount path: `/opt/app-root/src/browser/assets/config/`
- Restart the pod after updating ConfigMap

### SSR Proxy Not Working

**Problem**: Server returns 500 on API calls

**Solutions**:
- Check pod logs for proxy errors
- Verify environment variables are set correctly
- Check server can reach backend URLs (firewall, network policies)
- Test backend URLs directly with curl from pod

## Files Reference

| File | Purpose |
|------|---------|
| `src/assets/config/env.json` | Local development config (committed to git) |
| `src/assets/config/env.test.json.example` | Example test environment config |
| `src/app/services/config.service.ts` | Service that loads and provides runtime config |
| `src/app/app.config.ts` | App initialization with APP_INITIALIZER |
| `src/app/config/api.config.ts` | API endpoint definitions |
| `src/environments/server.config.ts` | Server-side configuration (reads env vars) |
| `deployment-template-corrected.yaml` | OpenShift deployment template |
| `RUNTIME_CONFIG.md` | Detailed documentation |

## Need Help?

See `RUNTIME_CONFIG.md` for detailed documentation.

