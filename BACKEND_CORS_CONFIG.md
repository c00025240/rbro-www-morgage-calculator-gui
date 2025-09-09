# Configurare CORS pentru Backend (Spring Boot)

## 1. Configurare CORS în Spring Boot

Adaugă următoarea configurație în backend-ul tău Spring Boot:

### Opțiunea 1: Configurare globală CORS

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200") // Angular dev server
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Opțiunea 2: Anotare pe controller

```java
@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/calculator")
public class MortgageCalculatorController {
    
    @PostMapping("/mortgage-calculator")
    public ResponseEntity<MortgageCalculationResponse> calculateMortgage(
            @RequestBody MortgageCalculationRequest request) {
        // Implementation
    }
}
```

### Opțiunea 3: Configurare prin application.properties

```properties
# application.properties
cors.allowed-origins=http://localhost:4200
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true
```

## 2. Configurare pentru producție

Pentru producție, actualizează origin-urile permise:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:4200",           // Development
                    "https://your-production-domain.com" // Production
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## 3. Testarea CORS-ului

### Verifică în browser console:
```javascript
fetch('http://localhost:8080/api/calculator/mortgage-calculator', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({test: 'data'})
})
.then(response => console.log('CORS OK:', response))
.catch(error => console.log('CORS Error:', error));
```

### Verifică cu curl:
```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  http://localhost:8080/api/calculator/mortgage-calculator
```

## 4. Debugging CORS

### Verifică header-ele în Network tab:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

### Mesaje de eroare comune:
- `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
- `Response to preflight request doesn't pass access control check`

## 5. Soluții alternative

### A. Folosește proxy în Angular (recomandat pentru development):
```bash
npm run start:proxy
```

### B. Dezactivează CORS în browser (doar pentru development):
```bash
# Chrome
chrome.exe --user-data-dir=/tmp/foo --disable-web-security --disable-features=VizDisplayCompositor
```

### C. Folosește un server proxy (nginx, Apache):
```nginx
location /api/ {
    proxy_pass http://localhost:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```
