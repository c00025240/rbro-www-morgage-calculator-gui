# Mock API for Mortgage Calculator

This directory contains a mock API setup for testing the mortgage calculator functionality.

## Setup

1. Install json-server globally:
```bash
npm install -g json-server
```

2. Start the mock API server:
```bash
json-server --watch db.json --port 3000
```

3. The API will be available at `http://localhost:3000`

## Endpoints

- `POST /mortgage/calculate` - Calculate mortgage based on request data

## Usage

The mortgage calculation service is configured to use this mock API endpoint. When all form fields are filled, the application will automatically call this endpoint and display the response in the right panel.

## Response Format

The mock API returns a `MortgageCalculationResponse` object with sample data including:
- Monthly installment amount
- Interest rates
- Loan amounts
- Payment terms
- And other mortgage calculation details
