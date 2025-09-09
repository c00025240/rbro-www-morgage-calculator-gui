# Backend Configuration

## API Endpoint

The application is configured to make requests to a real backend service instead of using mock data.

## CORS Configuration

To avoid CORS errors, you have several options:

### Option 1: Use Angular Proxy (Recommended for Development)
```bash
npm run start:proxy
```

### Option 2: Configure CORS in Backend
See `BACKEND_CORS_CONFIG.md` for detailed Spring Boot CORS configuration.

### Option 3: Use Direct API Calls
Update `src/app/config/api.config.ts` to use direct backend URL:
```typescript
BASE_URL: 'http://localhost:8080'
```

### Current Configuration

- **Base URL**: `http://localhost:8080`
- **Mortgage Calculator Endpoint**: `/calculator/mortgage-calculator`
- **Full URL**: `http://localhost:8080/calculator/mortgage-calculator`

### Request Headers

The application sends the following custom headers with each request:

#### Default Headers
- `Content-Type: application/json`
- `Accept: application/json`
- `X-Requested-With: XMLHttpRequest`
- `X-Client-Version: 1.0.0`
- `X-Client-Platform: web`

#### Tracking Headers
- `X-Request-ID: 99391c7e-ad88-49ec-a2ad-99ddcb1f7721` - Unique request identifier (UUID format)
- `X-Timestamp: 2023-12-21T10:30:45.123Z` - Request timestamp (ISO format)
- `X-Correlation-ID: 99391c7e-ad88-49ec-a2ad-99ddcb1f7721` - Correlation ID for tracking (UUID format)

#### Business Headers
- `X-Business-Unit: mortgage` - Business unit identifier
- `X-Product-Code: {productCode}` - Product code from request
- `X-Channel: web` - Channel identifier
- `X-Language: ro-RO` - Language preference

#### Authentication Headers (Optional)
- `Authorization: Bearer {token}` - Authentication token
- `X-User-ID: {userId}` - User identifier
- `X-Session-ID: {sessionId}` - Session identifier

### Request Format

The application sends POST requests with the following structure:

```json
{
  "productCode": "casaTa",
  "loanAmount": {
    "currency": "RON",
    "amount": 400000
  },
  "area": {
    "city": "Bucuresti",
    "county": "Bucuresti"
  },
  "income": {
    "currentIncome": 12000,
    "otherInstallments": 2100
  },
  "tenor": 360,
  "age": 30,
  "owner": true,
  "downPayment": 100000,
  "interestRateType": {
    "type": "fixa_3",
    "value": undefined
  },
  "hasInsurance": true,
  "installmentType": "EQUAL_INSTALLMENTS",
  "specialOfferRequirements": {
    "hasSalaryInTheBank": true,
    "casaVerde": true
  }
}
```

### Expected Response Format

The backend should return a response with the following structure:

```json
{
  "interestRateType": {
    "type": "fixed",
    "value": 5.5
  },
  "nominalInterestRate": 5.5,
  "interestRateFormula": {
    "bankMarginRate": 2.5,
    "irccRate": 3.0
  },
  "loanAmount": {
    "currency": "RON",
    "amount": 400000
  },
  "maxAmount": {
    "currency": "RON",
    "amount": 500000
  },
  "downPayment": {
    "currency": "RON",
    "amount": 100000
  },
  "loanAmountWithFee": {
    "currency": "RON",
    "amount": 410000
  },
  "housePrice": {
    "currency": "RON",
    "amount": 500000
  },
  "totalPaymentAmount": {
    "currency": "RON",
    "amount": 750000
  },
  "tenor": 360,
  "monthlyInstallment": {
    "amountFixedInterest": 2850,
    "amountVariableInterest": 0
  },
  "loanCosts": {
    "fees": [],
    "lifeInsurance": [],
    "discounts": {},
    "totalDiscountsValues": {}
  },
  "annualPercentageRate": 5.8,
  "noDocAmount": 0,
  "minGuaranteeAmount": 50000
}
```

### Error Handling

The application handles the following HTTP status codes:

- **400**: "Datele trimise sunt invalide"
- **404**: "Serviciul de calculare nu a fost găsit"
- **500**: "Eroare internă a serverului"
- **0**: "Nu se poate conecta la server. Verificați conexiunea la internet."

### Configuration

To change the backend URL, update the `API_CONFIG` in `src/app/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://your-backend-url:port',
  MORTGAGE_CALCULATOR: '/your-endpoint-path'
};
```

### Product Codes

The application sends the following product codes based on user selection:

- **"casaTa"** - for "Achiziție imobil"
- **"refinantare"** - for "Refinanțare"
- **"constructie"** - for "Construcție/renovare"
