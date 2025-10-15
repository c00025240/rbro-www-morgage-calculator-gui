# Application Architecture - Runtime Configuration

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          OpenShift Pod                               │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              ConfigMap (volume-config)                      │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  env.json                                            │  │    │
│  │  │  {                                                   │  │    │
│  │  │    "environmentName": "test",                       │  │    │
│  │  │    "apiUrl": "/api",                                │  │    │
│  │  │    "backendUrl": "https://backend.test.com",        │  │    │
│  │  │    ...                                               │  │    │
│  │  │  }                                                   │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                          ↓ mounted to                       │    │
│  │            /opt/app-root/src/browser/assets/config/         │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │           Environment Variables                             │    │
│  │  BACKEND_URL=https://backend.test.com                      │    │
│  │  ADMIN_SERVICE_URL=https://admin.test.com                  │    │
│  │  PORT=8080                                                  │    │
│  │  LOG_LEVEL=info                                             │    │
│  └────────────────────────────────────────────────────────────┘    │
│                          ↓ used by                                   │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │           Express Server (Node.js)                          │    │
│  │                                                              │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  Proxy Middleware                                    │  │    │
│  │  │                                                       │  │    │
│  │  │  /api/* ──────────────► BACKEND_URL                 │  │    │
│  │  │  /districts/* ────────► ADMIN_SERVICE_URL/...       │  │    │
│  │  │                                                       │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                                                              │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  Static Files                                        │  │    │
│  │  │  - index.html                                        │  │    │
│  │  │  - main.js                                           │  │    │
│  │  │  - assets/config/env.json ← Served to browser       │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                                                              │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  Angular SSR                                         │  │    │
│  │  │  - Pre-renders routes                               │  │    │
│  │  │  - Serves initial HTML                              │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                                                              │    │
│  │  Listening on: 0.0.0.0:8080                                │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
                     Exposed via Service
                                ↓
                         Route (if configured)
                                ↓
                          User's Browser
```

## Request Flow Diagram

### 1. Application Initialization

```
┌────────────────────────────────────────────────────────────────────┐
│ 1. Browser loads page                                               │
│    GET https://your-app.openshift.com/                             │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│ 2. Express server responds                                          │
│    - Serves index.html (SSR pre-rendered)                          │
│    - Browser downloads JavaScript bundles                          │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│ 3. Angular bootstraps                                               │
│    APP_INITIALIZER triggered                                       │
│    └─► ConfigService.loadConfig() called                           │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│ 4. Configuration loading                                            │
│    GET /assets/config/env.json                                     │
│    └─► Express serves static file                                  │
│        └─► Returns mounted ConfigMap data                          │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│ 5. Config stored in ConfigService                                  │
│    BehaviorSubject emits config to all subscribers                 │
│    ✅ Application ready to use                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 2. API Request Flow

```
┌────────────────────────────────────────────────────────────────────┐
│ User Action: Calculate Mortgage                                    │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│ MsSimulatorPage Component                                          │
│ └─► Calls MortgageCalculationService.calculateMortgage()          │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│ MortgageCalculationService                                         │
│ 1. Gets base URL from ConfigService                                │
│    baseUrl = configService.getApiUrl()  // Returns "/api"         │
│ 2. Builds full URL                                                 │
│    url = "/api/calculator/mortgage-calculator"                     │
│ 3. Makes HTTP POST request                                         │
│    httpClient.post(url, requestData, headers)                     │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│ Browser HTTP Request                                                │
│ POST /api/calculator/mortgage-calculator                           │
│ Host: your-app.openshift.com                                       │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│ Express Proxy Middleware                                            │
│ 1. Matches route: /api/*                                           │
│ 2. Reads env var: BACKEND_URL                                      │
│ 3. Rewrites path: /api/calculator/... → /calculator/...           │
│ 4. Forwards to: BACKEND_URL + /calculator/mortgage-calculator      │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│ Backend Service                                                     │
│ POST https://mtg-calculator-orchestrator.test.com/calculator/...  │
│ Processes request and returns response                             │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│ Response flows back                                                 │
│ Backend → Express Proxy → Browser → Angular Service → Component    │
└────────────────────────────────────────────────────────────────────┘
```

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    Angular Application                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  APP_INITIALIZER                                     │   │
│  │  - Runs before app starts                           │   │
│  │  - Calls ConfigService.loadConfig()                 │   │
│  │  - Returns Promise (waits for completion)           │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│                 ↓                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ConfigService                                       │   │
│  │                                                       │   │
│  │  - loadConfig(): Observable<RuntimeConfig>          │   │
│  │    └─► GET /assets/config/env.json                  │   │
│  │                                                       │   │
│  │  - configSubject: BehaviorSubject<RuntimeConfig>    │   │
│  │    └─► Stores loaded configuration                  │   │
│  │                                                       │   │
│  │  - getConfig(): RuntimeConfig | null                │   │
│  │  - getApiUrl(): string                              │   │
│  │  - getDistrictsUrl(): string                        │   │
│  │  - getBackendUrl(): string                          │   │
│  │  - getAdminServiceUrl(): string                     │   │
│  │  - isLoggingEnabled(): boolean                      │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │ injected into                              │
│                 ↓                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MortgageCalculationService                         │   │
│  │                                                       │   │
│  │  constructor(                                        │   │
│  │    private http: HttpClient,                        │   │
│  │    private configService: ConfigService ←───────────┤   │
│  │  )                                                   │   │
│  │                                                       │   │
│  │  calculateMortgage(request) {                       │   │
│  │    const baseUrl = configService.getApiUrl();       │   │
│  │    const url = `${baseUrl}/calculator/...`;         │   │
│  │    return http.post(url, request);                  │   │
│  │  }                                                   │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │ used by                                    │
│                 ↓                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MsSimulatorPage Component                          │   │
│  │                                                       │   │
│  │  - User interactions                                 │   │
│  │  - Form data collection                             │   │
│  │  - Calls service methods                            │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Configuration Precedence

```
┌─────────────────────────────────────────────────────────────┐
│ ConfigService.getBackendUrl()                               │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 1. Check config.BACKEND_URL                                 │
│    (uppercase property from deployment ConfigMap)           │
└─────────────────────────────────────────────────────────────┘
                         ↓ if not found
┌─────────────────────────────────────────────────────────────┐
│ 2. Check config.backendUrl                                  │
│    (camelCase property, for compatibility)                  │
└─────────────────────────────────────────────────────────────┘
                         ↓ if not found
┌─────────────────────────────────────────────────────────────┐
│ 3. Use defaultConfig.backendUrl                             │
│    (fallback: "http://localhost:8080")                      │
└─────────────────────────────────────────────────────────────┘
```

## File Structure in Container

```
/opt/app-root/src/
│
├── server/                           (Server-side code)
│   ├── server.mjs                    (Express server)
│   └── main.server.mjs               (Angular Universal)
│
├── browser/                          (Client-side code)
│   ├── index.html                    (Main HTML)
│   ├── main.js                       (Angular app bundle)
│   ├── styles.css                    (Styles)
│   │
│   └── assets/
│       ├── fonts/
│       ├── icons/
│       ├── logos/
│       └── config/
│           └── env.json ← ConfigMap mounted here
│                          (Read by Angular at runtime)
│
└── [other files...]
```

## Environment Variables vs ConfigMap

```
┌──────────────────────────────────────────────────────────────┐
│                    Configuration Sources                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Environment Variables (process.env)                   │ │
│  │  ─────────────────────────────────────────────────────│ │
│  │  Purpose: Server-side configuration                    │ │
│  │  Used by: Express server (Node.js)                     │ │
│  │  Access: process.env.BACKEND_URL                       │ │
│  │                                                         │ │
│  │  Set in Deployment:                                    │ │
│  │    env:                                                │ │
│  │      - name: BACKEND_URL                               │ │
│  │        value: "https://backend.test.com"               │ │
│  │      - name: ADMIN_SERVICE_URL                         │ │
│  │        value: "https://admin.test.com"                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ConfigMap → env.json File                            │ │
│  │  ─────────────────────────────────────────────────────│ │
│  │  Purpose: Client-side configuration                    │ │
│  │  Used by: Angular app (Browser)                        │ │
│  │  Access: HTTP GET /assets/config/env.json              │ │
│  │                                                         │ │
│  │  Mounted from ConfigMap:                               │ │
│  │    volumes:                                            │ │
│  │      - configMap:                                      │ │
│  │          name: app-config                              │ │
│  │        name: volume-config                             │ │
│  │    volumeMounts:                                       │ │
│  │      - mountPath: /opt/.../browser/assets/config/     │ │
│  │        name: volume-config                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Both should have the same URLs for consistency!             │
└──────────────────────────────────────────────────────────────┘
```

## Deployment Environments

```
┌─────────────────────────────────────────────────────────────┐
│ Environment: Development (Local)                             │
├─────────────────────────────────────────────────────────────┤
│ Config: src/assets/config/env.json                          │
│ Backend: http://localhost:8080                              │
│ Admin: https://...test.rbro.rbg.cc (test fallback)         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Environment: Test                                            │
├─────────────────────────────────────────────────────────────┤
│ Config: ConfigMap → env.json                                │
│ Backend: https://mtg-calculator-orchestrator-www.apps       │
│          .ocp4-test.rbro.rbg.cc                             │
│ Admin: https://rbro-loan-calculation-admin-service-www.apps │
│        .ocp4-test.rbro.rbg.cc                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Environment: PreLive                                         │
├─────────────────────────────────────────────────────────────┤
│ Config: ConfigMap → env.json                                │
│ Backend: [Update with prelive URLs]                         │
│ Admin: [Update with prelive URLs]                           │
│ jentisWorkspace: "prelive"                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Environment: Production                                      │
├─────────────────────────────────────────────────────────────┤
│ Config: ConfigMap → env.json                                │
│ Backend: [Update with production URLs]                      │
│ Admin: [Update with production URLs]                        │
│ production: true                                            │
│ enableLogging: false                                        │
│ jentisWorkspace: "production"                               │
└─────────────────────────────────────────────────────────────┘
```

## Benefits of This Architecture

1. **Separation of Concerns**
   - Server config via environment variables
   - Client config via mounted files
   - Each uses appropriate method for its runtime

2. **Single Build Artifact**
   - Build once, deploy to all environments
   - Configuration injected at deployment time
   - No environment-specific builds needed

3. **Easy Updates**
   - Update ConfigMap → restart pod
   - No rebuild required
   - Can update config without touching code

4. **Security**
   - No URLs hardcoded in source
   - No secrets in JavaScript bundles
   - Configuration managed by platform

5. **Flexibility**
   - Add new config properties easily
   - Support multiple environments
   - Easy to test and debug

---

**Key Takeaway**: This architecture uses Kubernetes-native patterns (ConfigMaps and environment variables) to provide runtime configuration, enabling the same application artifact to run in multiple environments with different configurations.

