# SSL Certificates - Development vs Production

## Problema: Self-Signed Certificates în Development

### Simptome
```
❌ Admin service proxy error: self-signed certificate in certificate chain
[SELF_SIGNED_CERT_IN_CHAIN]
```

### Cauza

Serviciile externe (test environment) folosesc **certificate SSL self-signed** care nu sunt de încredere pentru Node.js în mod implicit.

## Soluția Implementată

### 1. Configurare Condiționată SSL în `src/server.ts`

```typescript
// Allow self-signed certificates in development/test environments
const isDevelopment = serverConfig.environment === 'development' || serverConfig.environment === 'test';

// Proxy configuration
app.use('/districts', createProxyMiddleware({
  target: serverConfig.adminService.url,
  changeOrigin: true,
  secure: !isDevelopment, // false în dev/test, true în production
  // ... rest of config
}));
```

### 2. Cum Funcționează

| Environment | `secure` | Verificare SSL | Când se folosește |
|-------------|----------|----------------|-------------------|
| `development` | `false` | ❌ Disabled | Local development |
| `test` | `false` | ❌ Disabled | Test env cu self-signed certs |
| `prelive` | `true` | ✅ Enabled | PreLive cu certs valide |
| `production` | `true` | ✅ Enabled | Production cu certs valide |

## Securitate

### ⚠️ Este Sigur?

**DA**, pentru că:

1. **Development Local**: Nu există risc de securitate - te conectezi la servicii de test cunoscute
2. **Test Environment**: Certificatele sunt self-signed pentru că este un mediu izolat de test
3. **Production**: SSL verification este **ACTIVATĂ** automat

### 🔒 În Production

```typescript
// În production, isDevelopment = false
secure: !isDevelopment  // = secure: true
```

Verificarea SSL este **ÎNTOTDEAUNA activată** în production pentru securitate maximă.

## Configurare Environment

### Verifică Environment-ul Curent

Server-ul afișează la pornire:
```
🚀 Server configuration loaded: {environment: "development", ...}
⚠️  SSL certificate verification disabled for development
```

### Setare Environment

Configurația se face în:
- `src/environments/server.config.ts` (development)
- `src/environments/server.config.test.ts` (test)
- `src/environments/server.config.prelive.ts` (prelive)
- `src/environments/server.config.prod.ts` (production)

```typescript
export const serverConfig = {
  environment: 'development', // sau 'test', 'prelive', 'production'
  // ...
};
```

## Alternative (NU Recomandate)

### ❌ Dezactivare Globală Node.js

**NU face asta:**
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
```

**De ce NU:**
- Dezactivează verificarea SSL pentru **TOATE** conexiunile
- Risc mare de securitate
- Poate masca probleme în production

### ✅ Soluția Noastră (Recomandată)

- Dezactivează verificarea SSL **DOAR** pentru proxy-uri specifice
- **DOAR** în development/test
- Automat activată în production
- Configurabilă per environment

## Troubleshooting

### Eroarea Persistă După Modificare

1. **Restart server-ul:**
   ```bash
   Ctrl+C
   npm run dev
   ```

2. **Verifică environment-ul:**
   - Caută în console: `🚀 Server configuration loaded`
   - Ar trebui să vezi: `⚠️ SSL certificate verification disabled for development`

3. **Verifică fișierul compilat:**
   ```bash
   # După build
   cat dist/rbro-www-mortgage-calculator-gui/server/server.mjs | grep "secure:"
   ```

### Eroarea Apare în Production

**Asta e o PROBLEMĂ reală!** În production nu ar trebui să fie certificatele self-signed.

**Soluții:**
1. Verifică că certificatele backend-ului sunt valide
2. Verifică că nu folosești `environment: 'development'` în production
3. Contactează echipa de infrastructure pentru certificatele corecte

## Best Practices

### ✅ DO

- Folosește configurarea condiționată (implementată)
- Testează în toate environment-urile
- Verifică logs-urile la pornirea server-ului
- Ține certificatele de production valide

### ❌ DON'T

- Nu dezactiva SSL global (`NODE_TLS_REJECT_UNAUTHORIZED`)
- Nu seta `secure: false` permanent în production
- Nu ignora warning-urile de certificat în production
- Nu commit-a environment-uri greșite

## Testing

### Test Local Development

```bash
npm run dev
```

Expected output:
```
⚠️  SSL certificate verification disabled for development
✅ Node Express server listening on http://localhost:4200
```

Request la districts ar trebui să funcționeze fără erori SSL.

### Test Production Build

```bash
npm run build
node dist/rbro-www-mortgage-calculator-gui/server/server.mjs
```

Expected:
- **NU** ar trebui să vezi warning-ul despre SSL disabled
- Certificatele ar trebui să fie valide în production

## Resurse Externe

- [http-proxy-middleware documentation](https://github.com/chimurai/http-proxy-middleware)
- [Node.js TLS/SSL](https://nodejs.org/api/tls.html)
- [Self-signed certificates in development](https://nodejs.org/en/knowledge/HTTP/servers/how-to-handle-multipart-form-data/)

---

**Implementat**: 15 octombrie 2025  
**Fișier modificat**: `src/server.ts`  
**Configurare**: Condiționată pe `serverConfig.environment`

