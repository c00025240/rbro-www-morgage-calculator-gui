# Clarificare: Environment Variables vs env.json

## Întrebare Importantă
**Dacă `BACKEND_URL` și `ADMIN_SERVICE_URL` sunt variabile de mediu în deployment template, mai trebuie să stea și în `env.json`?**

## Răspuns: **NU** ❌

Acestea sunt **două configurații separate** pentru **două scopuri diferite**.

## Arhitectura Simplificată

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenShift Pod                             │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Environment Variables (pentru server-side)          │   │
│  │  ───────────────────────────────────────────────────│   │
│  │  BACKEND_URL=https://backend.test.com               │   │
│  │  ADMIN_SERVICE_URL=https://admin.test.com           │   │
│  │  PORT=8080                                           │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │ citite de                              │
│                     ↓                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express Server (server.ts)                          │   │
│  │  - Configurează proxy-ul                             │   │
│  │  - /api → BACKEND_URL                                │   │
│  │  - /districts → ADMIN_SERVICE_URL/...                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ConfigMap → env.json (pentru client-side)          │   │
│  │  ───────────────────────────────────────────────────│   │
│  │  {                                                   │   │
│  │    "apiUrl": "/api",          ← URL relativ!        │   │
│  │    "districtsUrl": "/districts", ← URL relativ!     │   │
│  │    "enableLogging": true                            │   │
│  │  }                                                   │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │ încărcat de                            │
│                     ↓                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Angular App (browser)                               │   │
│  │  - Folosește URL-uri relative                        │   │
│  │  - POST /api/calculator/...                          │   │
│  │  - GET /districts                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## De Ce Nu Trebuie URL-uri Complete în env.json?

### ✅ Corect - URL-uri Relative
```json
{
  "apiUrl": "/api",
  "districtsUrl": "/districts"
}
```

**Motivele:**
1. ✅ Client face request la server-ul propriu (același origin)
2. ✅ Express proxy-ul se ocupă de rutarea către backend
3. ✅ Nu există probleme CORS
4. ✅ Securitate mai bună (backend URL-uri nu sunt expuse în browser)

### ❌ Greșit - URL-uri Complete
```json
{
  "apiUrl": "/api",
  "backendUrl": "https://backend.test.com",  ← NU este necesar!
  "BACKEND_URL": "https://backend.test.com"   ← NU este necesar!
}
```

**Probleme:**
1. ❌ Redundant - client nu folosește aceste URL-uri
2. ❌ Confuz - pare că ar trebui să facă request direct
3. ❌ Expune URL-uri interne în browser
4. ❌ Risc de CORS dacă cineva le folosește greșit

## Configurația Corectă

### 1. Deployment Template

```yaml
# Environment variables pentru Express server
env:
  - name: BACKEND_URL
    value: "https://mtg-calculator-orchestrator-www.apps.ocp4-test.rbro.rbg.cc"
  - name: ADMIN_SERVICE_URL
    value: "https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc"
  - name: PORT
    value: "8080"

# ConfigMap pentru browser
data:
  env.json: |
    {
      "production": false,
      "environmentName": "test",
      "apiUrl": "/api",
      "districtsUrl": "/districts",
      "enableLogging": true,
      "jentisWorkspace": "preview"
    }
```

### 2. Cum Funcționează

```
Browser Request:
  POST /api/calculator/mortgage-calculator
  ↓
Express Server:
  - Vede request la /api/*
  - Citește BACKEND_URL din env var
  - Proxy către: https://backend.test.com/calculator/mortgage-calculator
  ↓
Backend Service:
  - Procesează request
  - Returnează răspuns
  ↓
Express Server:
  - Trimite răspuns înapoi la browser
```

## Comparație: Înainte vs Acum

### ❌ Înainte (Redundant)

**env.json:**
```json
{
  "apiUrl": "/api",
  "backendUrl": "https://backend.test.com",
  "BACKEND_URL": "https://backend.test.com",
  "adminServiceUrl": "https://admin.test.com",
  "ADMIN_SERVICE_URL": "https://admin.test.com"
}
```

**Probleme:**
- Prea multe proprietăți
- Confuzie între ce folosește client vs server
- Duplicare de informație

### ✅ Acum (Simplu și Clar)

**env.json:**
```json
{
  "apiUrl": "/api",
  "districtsUrl": "/districts",
  "enableLogging": true,
  "jentisWorkspace": "preview"
}
```

**Deployment env vars:**
```yaml
BACKEND_URL=https://backend.test.com
ADMIN_SERVICE_URL=https://admin.test.com
```

**Beneficii:**
- ✅ Clar: client folosește doar căi relative
- ✅ Securitate: URL-uri backend nu sunt expuse
- ✅ Flexibilitate: poți schimba backend fără rebuild
- ✅ Standard: pattern-ul corect pentru proxy

## Rezumat

| Proprietate | Unde | Folosită De | Scop |
|-------------|------|-------------|------|
| `BACKEND_URL` | Environment Variable | Express Server | Proxy target pentru `/api` |
| `ADMIN_SERVICE_URL` | Environment Variable | Express Server | Proxy target pentru `/districts` |
| `apiUrl` | env.json | Angular Client | Cale relativă către API |
| `districtsUrl` | env.json | Angular Client | Cale relativă către districts |

## Concluzie

✅ **Environment Variables**: Pentru server-side (Express proxy)
✅ **env.json**: Pentru client-side (Angular app în browser)

❌ **NU pune URL-uri complete în env.json** - nu sunt necesare și pot crea confuzie!

---

**Update**: Configurația a fost simplificată în:
- `src/assets/config/env.json`
- `src/assets/config/env.test.json.example`
- `deployment-template-corrected.yaml`
- `src/app/services/config.service.ts`

