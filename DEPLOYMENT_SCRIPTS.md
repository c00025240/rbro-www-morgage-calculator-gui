# Scripts de Deployment și Development

## Problema: `npm start` în Container

### ❌ Ce Era Greșit

```json
"start": "ng serve --proxy-config proxy.conf.json"
```

**Problema:**
- `ng serve` este pentru **development local**
- În container/pod **NU există** Angular CLI (`ng`)
- Container-ul trebuie să ruleze aplicația **built**, nu să o compileze

### ✅ Soluția

```json
"start": "node dist/rbro-www-mortgage-calculator-gui/server/server.mjs"
```

**De ce funcționează:**
- Rulează direct server-ul SSR built
- Nu necesită Angular CLI
- Foldul `dist/` este copiat în container la build-time

## NPM Scripts - Ghid Complet

### Development Local

#### `npm run dev` ⭐ (Recomandat pentru development)
```bash
ng serve --proxy-config proxy.conf.json
```
- Development server cu hot-reload
- Proxy configurat pentru backend APIs
- Rulează pe `http://localhost:4200`
- **Folosește DOAR local**

#### `npm run start:dev`
```bash
ng serve --proxy-config proxy.conf.json
```
- Același lucru ca `npm run dev`
- Alias pentru claritate

#### `npm run dev:no-proxy`
```bash
ng serve
```
- Development fără proxy
- Folosește când backend-ul nu este necesar

### Production/Container

#### `npm start` ⭐ (Folosit în container)
```bash
node dist/rbro-www-mortgage-calculator-gui/server/server.mjs
```
- Rulează server-ul SSR built
- Pentru production/container/pod
- Necesită build anterior (`npm run build`)
- **Acesta este scriptul care rulează în OpenShift**

#### `npm run serve:ssr`
```bash
node dist/rbro-www-mortgage-calculator-gui/server/server.mjs
```
- Același lucru ca `npm start`
- Alias pentru claritate

### Build Scripts

#### `npm run build`
```bash
ng build
```
- Build pentru development/default
- Output: `dist/rbro-www-mortgage-calculator-gui/`

#### `npm run build:test`
```bash
ng build --configuration=test
```
- Build pentru test environment
- Folosește `environment.test.ts`
- Pentru deployment pe OpenShift test

#### `npm run build:prelive`
```bash
ng build --configuration=prelive
```
- Build pentru prelive environment
- Folosește `environment.prelive.ts`

#### `npm run build:prod`
```bash
ng build --configuration=production
```
- Build pentru production
- Optimizat (minificat, tree-shaking, etc.)
- Folosește `environment.prod.ts`

### Linting

#### `npm run lint`
```bash
ng lint
```
- Verifică code quality cu ESLint
- Rulează înainte de commit

## Workflow-uri Tipice

### 🔧 Development Local

```bash
# 1. Instalează dependencies
npm install

# 2. Pornește development server
npm run dev

# 3. Deschide browser
# http://localhost:4200
```

### 🏗️ Build și Test Local

```bash
# 1. Build aplicația
npm run build

# 2. Testează build-ul local
npm start

# 3. Deschide browser
# http://localhost:4000  (sau portul configurat)
```

### 🚀 Deployment în OpenShift

```bash
# În pipeline sau local pentru test build

# 1. Build pentru environment specific
npm run build:test        # sau build:prelive, build:prod

# 2. Containerul va rula
npm start                 # în Dockerfile/pod
```

## Diferențe Cheie

### Development vs Production

| Aspect | Development (`npm run dev`) | Production (`npm start`) |
|--------|----------------------------|--------------------------|
| Compilare | On-the-fly (JIT) | Pre-built (AOT) |
| Hot reload | ✅ Yes | ❌ No |
| Source maps | ✅ Yes | ❌ No (production) |
| Minificat | ❌ No | ✅ Yes |
| Port | 4200 (default) | 4000 (configurat) sau 8080 (container) |
| Proxy | proxy.conf.json | Built-in în server.ts |
| Necesită ng CLI | ✅ Yes | ❌ No |

## Configurare Container/Dockerfile

### Exemplu Dockerfile

```dockerfile
# Build stage
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm ci --only=production

# Expune portul
EXPOSE 8080

# Rulează aplicația
CMD ["npm", "start"]
```

### Ce se întâmplă în container:

1. `npm ci --only=production` - instalează DOAR dependencies production
   - ❌ NU instalează `@angular/cli`
   - ✅ Instalează `express`, `@angular/ssr`, etc.

2. `npm start` - rulează `node dist/.../server.mjs`
   - ❌ NU încearcă `ng serve`
   - ✅ Pornește Express server-ul

## Environment Variables în Container

Server-ul (în production) folosește:

```bash
PORT=8080                    # Port pentru Express
BACKEND_URL=https://...      # URL backend API
ADMIN_SERVICE_URL=https://.. # URL admin service
NODE_ENV=production          # Node environment
```

Acestea sunt setate în deployment template:

```yaml
env:
  - name: PORT
    value: "8080"
  - name: BACKEND_URL
    value: "https://backend.test.com"
  # ...
```

## Troubleshooting

### Eroare: `sh: ng: not found`

**Cauza:** Container-ul încearcă să ruleze `ng serve`

**Soluție:** 
```json
// În package.json, asigură-te că:
"start": "node dist/rbro-www-mortgage-calculator-gui/server/server.mjs"
```

### Eroare: Cannot find module 'dist/...'

**Cauza:** Build-ul nu există în container

**Soluție:**
1. Verifică că Dockerfile face `npm run build`
2. Verifică că folderul `dist/` este copiat în imagine

### Server nu pornește în container

**Debug:**
```bash
# În container/pod, verifică:
ls -la dist/rbro-www-mortgage-calculator-gui/server/

# Ar trebui să vezi:
# server.mjs
# main.server.mjs
# polyfills.server.mjs
# etc.
```

### Port-ul nu este corect

**Verifică:**
```typescript
// src/environments/server.config.ts
server: {
  port: parseInt(process.env['PORT'] || '4000', 10)
}
```

Container-ul setează `PORT=8080` prin env vars.

## Best Practices

### ✅ DO

- Folosește `npm run dev` pentru development local
- Folosește `npm start` în container/production
- Build-uiește pentru environment specific (`build:test`, `build:prod`)
- Testează build-ul local cu `npm run build && npm start`

### ❌ DON'T

- Nu folosi `ng serve` în production
- Nu instala `@angular/cli` în production container
- Nu uita să faci build înainte de `npm start`
- Nu commit-a folderul `dist/`

## Scripts Summary

| Script | Când să folosești | Unde rulează |
|--------|-------------------|--------------|
| `npm run dev` | Development zilnic | Local |
| `npm start` | Production/test build | Container/Pod |
| `npm run build:test` | Build pentru test env | CI/CD pipeline |
| `npm run build:prod` | Build pentru production | CI/CD pipeline |
| `npm run serve:ssr` | Test local SSR | Local după build |

---

**Implementat**: 15 octombrie 2025  
**Fișier modificat**: `package.json`  
**Impact**: Container-ul va rula corect în OpenShift

