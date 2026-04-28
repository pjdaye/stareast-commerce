# Stareast Commerce API

## Description
Simple REST API for an e-commerce flow using JavaScript and Express.  
It allows user registration and login with JWT, and authenticated checkout with business rules.

## Installation
```bash
npm install
```

## How to Run
```bash
npm start
```

The API will run at `http://localhost:3000`.

Swagger documentation is available at `http://localhost:3000/docs`.

## Rules
- The API has only 4 endpoints: `register`, `login`, `checkout`, `healthcheck`.
- Checkout accepts only `cash` or `credit_card`.
- Cash payment applies `10%` discount.
- Only authenticated users can checkout.
- Data is in memory only (no database).

## Data Already Existent
### Users
- `alice@example.com` / `alice123`
- `bob@example.com` / `bob123`
- `carol@example.com` / `carol123`

### Products
- `1 - Keyboard - 100`
- `2 - Mouse - 50`
- `3 - Monitor - 300`

## How to Use the Rest API
### 1) Register
`POST /api/register`

Example body:
```json
{
  "name": "David Lee",
  "email": "david@example.com",
  "password": "david123"
}
```

### 2) Login
`POST /api/login`

Example body:
```json
{
  "email": "alice@example.com",
  "password": "alice123"
}
```

Response returns:
```json
{
  "token": "your-jwt-token"
}
```

### 3) Checkout (Authenticated)
`POST /api/checkout`

Header:
`Authorization: Bearer <token>`

Example body:
```json
{
  "paymentMethod": "cash",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 1 }
  ]
}
```

### 4) Healthcheck
`GET /api/healthcheck`
