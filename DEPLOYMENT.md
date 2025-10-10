# Deployment Guide - Multiple Environments

## 🌍 Environments Configuration

The application supports 4 environments, each with its own configuration:

| Environment | Config File | Backend URL | Jentis |
|------------|-------------|-------------|---------|
| **Development** | `environment.ts` | `http://localhost:8080` | preview |
| **Test** | `environment.test.ts` | `https://...apps.ocp4-test...` | preview |
| **Prelive** | `environment.prelive.ts` | `https://...apps.ocp4-prelive...` | preview |
| **Production** | `environment.prod.ts` | `https://...raiffeisen.ro` | live |

---

## 🏗️ Building for Each Environment

### Development Build (default)
```bash
npm run build
# or
ng build
```

### Test Environment
```bash
npm run build:test
```
**Output:** `dist/rbro-www-mortgage-calculator-gui/`  
**Environment file used:** `environment.test.ts`  
**Backend:** Test OpenShift cluster

### Prelive Environment
```bash
npm run build:prelive
```
**Output:** `dist/rbro-www-mortgage-calculator-gui/`  
**Environment file used:** `environment.prelive.ts`  
**Backend:** Prelive OpenShift cluster

### Production Environment
```bash
npm run build:prod
```
**Output:** `dist/rbro-www-mortgage-calculator-gui/`  
**Environment file used:** `environment.prod.ts`  
**Backend:** Production servers

---

## 🐳 Docker Deployment

### Dockerfile Example
```dockerfile
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Build for specific environment
ARG ENVIRONMENT=production
RUN npm run build:${ENVIRONMENT}

# Production image
FROM node:20-alpine

WORKDIR /app
COPY --from=build /app/dist/rbro-www-mortgage-calculator-gui ./

# Environment variables for runtime proxy configuration
ENV BACKEND_URL=http://backend-service:8080
ENV ADMIN_SERVICE_URL=https://admin-service.domain.com
ENV PORT=4000
ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "server/server.mjs"]
```

### Building Docker Images for Each Environment

**Test:**
```bash
docker build --build-arg ENVIRONMENT=test -t rbro-mortgage-calculator:test .
docker run -p 4000:4000 \
  -e BACKEND_URL=https://backend-test.apps.ocp4-test.rbro.rbg.cc \
  -e ADMIN_SERVICE_URL=https://admin-test.apps.ocp4-test.rbro.rbg.cc \
  rbro-mortgage-calculator:test
```

**Prelive:**
```bash
docker build --build-arg ENVIRONMENT=prelive -t rbro-mortgage-calculator:prelive .
docker run -p 4000:4000 \
  -e BACKEND_URL=https://backend-prelive.apps.ocp4-prelive.rbro.rbg.cc \
  -e ADMIN_SERVICE_URL=https://admin-prelive.apps.ocp4-prelive.rbro.rbg.cc \
  rbro-mortgage-calculator:prelive
```

**Production:**
```bash
docker build --build-arg ENVIRONMENT=production -t rbro-mortgage-calculator:prod .
docker run -p 4000:4000 \
  -e BACKEND_URL=https://backend.raiffeisen.ro \
  -e ADMIN_SERVICE_URL=https://admin.raiffeisen.ro \
  -e NODE_ENV=production \
  rbro-mortgage-calculator:prod
```

---

## ☸️ OpenShift Deployment

### Environment Variables per Environment

**Test (OCP4-TEST):**
```yaml
apiVersion: v1
kind: DeploymentConfig
metadata:
  name: mortgage-calculator-test
spec:
  template:
    spec:
      containers:
      - name: app
        image: rbro-mortgage-calculator:test
        env:
        - name: BACKEND_URL
          value: "https://rbro-mortgage-calculator-backend-test.apps.ocp4-test.rbro.rbg.cc"
        - name: ADMIN_SERVICE_URL
          value: "https://rbro-loan-calculation-admin-service-www.apps.ocp4-test.rbro.rbg.cc"
        - name: NODE_ENV
          value: "test"
        - name: PORT
          value: "4000"
```

**Prelive (OCP4-PRELIVE):**
```yaml
apiVersion: v1
kind: DeploymentConfig
metadata:
  name: mortgage-calculator-prelive
spec:
  template:
    spec:
      containers:
      - name: app
        image: rbro-mortgage-calculator:prelive
        env:
        - name: BACKEND_URL
          value: "https://rbro-mortgage-calculator-backend-prelive.apps.ocp4-prelive.rbro.rbg.cc"
        - name: ADMIN_SERVICE_URL
          value: "https://rbro-loan-calculation-admin-service-www.apps.ocp4-prelive.rbro.rbg.cc"
        - name: NODE_ENV
          value: "prelive"
        - name: PORT
          value: "4000"
```

**Production:**
```yaml
apiVersion: v1
kind: DeploymentConfig
metadata:
  name: mortgage-calculator-prod
spec:
  template:
    spec:
      containers:
      - name: app
        image: rbro-mortgage-calculator:prod
        env:
        - name: BACKEND_URL
          value: "https://rbro-mortgage-calculator-backend.raiffeisen.ro"
        - name: ADMIN_SERVICE_URL
          value: "https://rbro-loan-calculation-admin-service.raiffeisen.ro"
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "4000"
```

---

## 🔧 Proxy Configuration Per Environment

The application uses a **two-layer proxy system**:

### Layer 1: Angular File Replacement (Build Time)
During build, Angular replaces `environment.ts` with the environment-specific file:
- **Test build** → uses `environment.test.ts`
- **Prelive build** → uses `environment.prelive.ts`
- **Production build** → uses `environment.prod.ts`

### Layer 2: Express Proxy (Runtime)
The Node.js server (`server.ts`) uses environment variables:
- `BACKEND_URL` → Backend API endpoint
- `ADMIN_SERVICE_URL` → Admin service endpoint

**Flow:**
```
Browser → /api/calculator
           ↓
Express Server reads BACKEND_URL from env vars
           ↓
Proxies to: ${BACKEND_URL}/calculator
```

---

## 📊 Jentis Tracking Configuration

Jentis workspace is configured per environment:

| Environment | Jentis Workspace | Reason |
|------------|-----------------|---------|
| Development | `preview` | Testing tracking |
| Test | `preview` | Testing tracking |
| Prelive | `preview` | Final testing |
| Production | `live` | Real analytics |

This is configured in each `environment.*.ts` file via the `jentisWorkspace` property.

---

## ✅ Verification Checklist

After deployment to each environment, verify:

- [ ] Application loads correctly
- [ ] Backend API calls work (`/api/*`)
- [ ] Districts API works (`/districts`)
- [ ] Jentis tracking is sending events (check browser console for `📊 Jentis event tracked`)
- [ ] Environment-specific URLs are being used
- [ ] Proxy logs show correct backend URLs
- [ ] No CORS errors in browser console

### Verification Commands

**Check proxy configuration:**
```bash
# SSH into pod/container
curl http://localhost:4000/api/health
# Should proxy to backend

# Check logs
kubectl logs <pod-name> | grep "Proxy configuration"
# Should show correct BACKEND_URL and ADMIN_SERVICE_URL
```

---

## 🚨 Troubleshooting

### Issue: Wrong Backend URL Being Used

**Check:**
1. Verify environment variables are set correctly:
   ```bash
   kubectl exec <pod> -- env | grep -E 'BACKEND|ADMIN'
   ```
2. Check server logs for proxy configuration:
   ```bash
   kubectl logs <pod> | grep "Proxy configuration"
   ```

### Issue: CORS Errors

**Solution:** Ensure `changeOrigin: true` is set in `server.ts` proxy configuration (already done).

### Issue: 404 on API Calls

**Check:**
1. Verify path rewrite in `server.ts`
2. Check backend is reachable from the pod:
   ```bash
   kubectl exec <pod> -- curl -v ${BACKEND_URL}/health
   ```

---

## 📝 Summary

### Development
```bash
npm start  # Uses proxy.conf.json
```

### Test Deployment
```bash
npm run build:test
# Deploy to OCP4-TEST with BACKEND_URL pointing to test backend
```

### Prelive Deployment
```bash
npm run build:prelive
# Deploy to OCP4-PRELIVE with BACKEND_URL pointing to prelive backend
```

### Production Deployment
```bash
npm run build:prod
# Deploy to Production with BACKEND_URL pointing to production backend
```

**Key Point:** The same Docker image can be used across environments by changing environment variables at runtime! 🚀

