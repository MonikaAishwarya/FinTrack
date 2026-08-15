# FinTrack API Documentation

## 1. Overview

FinTrack provides REST APIs for authentication, dashboard analytics, transaction management, customer management, financial analytics, fraud alerts, and financial reports.

### Base URL

```text
http://localhost:5000
```

All protected endpoints require a valid JWT access token.

### Authentication Header

For protected endpoints, send:

```http
Authorization: Bearer <access_token>
```

---

# 2. Authentication APIs

## Register User

### Endpoint

```http
POST /auth/register
```

### Authentication

Not required.

### Request Body

```json
{
  "name": "Monika",
  "email": "monika@example.com",
  "password": "password123"
}
```

### Purpose

Creates a new user account.

### Response

A successful registration returns a success response from the authentication controller.

---

## Login

### Endpoint

```http
POST /auth/login
```

### Authentication

Not required.

### Request Body

```json
{
  "email": "monika@example.com",
  "password": "password123"
}
```

### Purpose

Authenticates the user and generates a JWT access token.

### Response

The returned access token is used to access protected APIs.

Example:

```json
{
  "access_token": "<JWT_TOKEN>"
}
```

---

# 3. Dashboard APIs

All dashboard endpoints require JWT authentication.

## Dashboard Summary

### Endpoint

```http
GET /dashboard/summary
```

### Authentication

Required.

### Description

Returns the main financial metrics for the authenticated user.

### Response

```json
{
  "total_income": 65000,
  "total_expense": 5000,
  "total_revenue": 65000,
  "daily_revenue": 0,
  "monthly_revenue": 65000,
  "balance": 60000,
  "total_transactions": 10,
  "active_customers": 3,
  "pending_transactions": 1,
  "failed_transactions": 2,
  "fraud_alerts": 2
}
```

The dashboard summary is cached using Redis for improved performance.

---

## Category Summary

### Endpoint

```http
GET /dashboard/category-summary
```

### Authentication

Required.

### Description

Returns expense totals grouped by transaction category.

### Response

```json
[
  {
    "category": "Food",
    "amount": 3500
  },
  {
    "category": "Bills",
    "amount": 1500
  }
]
```

---

## Monthly Summary

### Endpoint

```http
GET /dashboard/monthly-summary
```

### Authentication

Required.

### Description

Returns monthly income and expense totals.

### Response

```json
[
  {
    "year": 2026,
    "month": "August",
    "income": 65000,
    "expense": 5000
  }
]
```

---

## Recent Transactions

### Endpoint

```http
GET /dashboard/recent-transactions
```

### Authentication

Required.

### Description

Returns the five most recent transactions belonging to the authenticated user.

### Response

```json
[
  {
    "id": 20,
    "title": "Failed Payment 3",
    "amount": 2000,
    "type": "expense",
    "category": "Payment",
    "status": "Failed",
    "created_at": "2026-08-13T10:00:00"
  }
]
```

---

# 4. Transaction APIs

All transaction endpoints require JWT authentication.

## Add Transaction

### Endpoint

```http
POST /transactions/
```

### Authentication

Required.

### Request Body

```json
{
  "title": "Coffee",
  "amount": 150,
  "type": "expense",
  "category": "Food",
  "customer_id": 1,
  "payment_method": "UPI",
  "status": "Success"
}
```

### Description

Creates a new transaction for the authenticated user.

The transaction is also checked against the configured fraud-detection rules.

### Response

```json
{
  "message": "Transaction Added Successfully",
  "fraud_alerts": []
}
```

---

## Get Transactions

### Endpoint

```http
GET /transactions/
```

### Authentication

Required.

### Query Parameters

| Parameter  | Description                  |
| ---------- | ---------------------------- |
| `search`   | Search transactions by title |
| `type`     | Filter by income or expense  |
| `status`   | Filter by transaction status |
| `date`     | Filter by transaction date   |
| `page`     | Page number                  |
| `per_page` | Number of records per page   |

### Example

```http
GET /transactions/?search=coffee&type=expense&status=Success&page=1&per_page=10
```

### Response

```json
{
  "transactions": [
    {
      "id": 1,
      "customer_id": 1,
      "title": "Coffee",
      "amount": 150,
      "type": "expense",
      "category": "Food",
      "payment_method": "UPI",
      "status": "Success",
      "created_at": "2026-08-13T10:00:00"
    }
  ],
  "page": 1,
  "per_page": 10,
  "total": 1,
  "pages": 1
}
```

---

## Get Single Transaction

### Endpoint

```http
GET /transactions/<id>
```

### Authentication

Required.

### Example

```http
GET /transactions/20
```

### Description

Returns one transaction belonging to the authenticated user.

---

## Update Transaction

### Endpoint

```http
PUT /transactions/<id>
```

### Authentication

Required.

### Request Body

```json
{
  "title": "Updated Coffee",
  "amount": 200,
  "type": "expense",
  "category": "Food",
  "customer_id": 1,
  "payment_method": "UPI",
  "status": "Success"
}
```

### Response

```json
{
  "message": "Transaction Updated Successfully"
}
```

---

## Delete Transaction

### Endpoint

```http
DELETE /transactions/<id>
```

### Authentication

Required.

### Description

Deletes a transaction belonging to the authenticated user.

Any fraud alerts associated with the transaction are also deleted.

### Response

```json
{
  "message": "Transaction deleted successfully"
}
```

---

# 5. Customer APIs

All customer endpoints require JWT authentication.

## Add Customer

### Endpoint

```http
POST /customers/
```

### Authentication

Required.

### Description

Creates a customer associated with the authenticated user.

---

## Get Customers

### Endpoint

```http
GET /customers/
```

### Authentication

Required.

### Description

Returns customers belonging to the authenticated user.

---

## Get Single Customer

### Endpoint

```http
GET /customers/<id>
```

### Authentication

Required.

### Example

```http
GET /customers/1
```

---

## Update Customer

### Endpoint

```http
PUT /customers/<id>
```

### Authentication

Required.

### Description

Updates customer information belonging to the authenticated user.

---

## Delete Customer

### Endpoint

```http
DELETE /customers/<id>
```

### Authentication

Required.

### Description

Deletes a customer belonging to the authenticated user.

Transactions associated with the customer are not automatically deleted.

---

## Customer Analytics

### Endpoint

```http
GET /customers/analytics
```

### Authentication

Required.

### Description

Returns customer-related analytics for the authenticated user.

---

# 6. Financial Analytics APIs

All analytics endpoints require JWT authentication.

## Revenue Trend

### Endpoint

```http
GET /analytics/revenue-trend
```

### Description

Returns daily income and expense totals.

### Response

```json
[
  {
    "date": "2026-08-13",
    "income": 10000,
    "expense": 2500
  }
]
```

---

## Daily Transactions

### Endpoint

```http
GET /analytics/daily-transactions
```

### Description

Returns the number of transactions for each day.

### Response

```json
[
  {
    "date": "2026-08-13",
    "count": 5
  }
]
```

---

## Monthly Transactions

### Endpoint

```http
GET /analytics/monthly-transactions
```

### Description

Returns transaction counts grouped by month and year.

### Response

```json
[
  {
    "month": "August",
    "year": 2026,
    "label": "August 2026",
    "count": 25
  }
]
```

---

## Expense Analysis

### Endpoint

```http
GET /analytics/expense-analysis
```

### Description

Returns expense totals grouped by category.

### Response

```json
[
  {
    "category": "Food",
    "amount": 3500
  },
  {
    "category": "Bills",
    "amount": 1500
  }
]
```

---

## Customer Growth

### Endpoint

```http
GET /analytics/customer-growth
```

### Description

Returns customer growth grouped by month and year.

### Response

```json
[
  {
    "month": "August",
    "year": 2026,
    "label": "August 2026",
    "count": 10
  }
]
```

---

## Payment Method Distribution

### Endpoint

```http
GET /analytics/payment-method-distribution
```

### Description

Returns successful transaction counts grouped by payment method.

### Response

```json
[
  {
    "payment_method": "UPI",
    "count": 12
  },
  {
    "payment_method": "Card",
    "count": 8
  }
]
```

---

# 7. Fraud Alert APIs

All fraud endpoints require JWT authentication.

## Get Fraud Alerts

### Endpoint

```http
GET /fraud/alerts
```

### Authentication

Required.

### Description

Returns fraud alerts belonging to the authenticated user.

---

## Get Single Fraud Alert

### Endpoint

```http
GET /fraud/alerts/<id>
```

### Authentication

Required.

### Example

```http
GET /fraud/alerts/1
```

### Description

Returns a single fraud alert belonging to the authenticated user.

---

# 8. Report APIs

All report endpoints require JWT authentication.

## Daily Report

### Endpoint

```http
GET /reports/daily
```

### Authentication

Required.

### Description

Returns financial report information for the daily period.

---

## Weekly Report

### Endpoint

```http
GET /reports/weekly
```

### Authentication

Required.

### Description

Returns financial report information for the weekly period.

---

## Monthly Report

### Endpoint

```http
GET /reports/monthly
```

### Authentication

Required.

### Description

Returns financial report information for the monthly period.

---

## Export CSV Report

### Endpoint

```http
GET /reports/export/csv
```

### Authentication

Required.

### Query Parameters

```text
period=daily
period=weekly
period=monthly
```

### Example

```http
GET /reports/export/csv?period=monthly
```

### Response

Returns a CSV file containing the requested financial report.

---

## Export PDF Report

### Endpoint

```http
GET /reports/export/pdf
```

### Authentication

Required.

### Query Parameters

```text
period=daily
period=weekly
period=monthly
```

### Example

```http
GET /reports/export/pdf?period=monthly
```

### Response

Returns a PDF file containing the requested financial report.

---

# 9. Authentication and Authorization

FinTrack uses JWT-based authentication.

Protected endpoints verify the JWT token before processing the request.

The authenticated user's ID is retrieved from the JWT and used to restrict database queries.

For example:

```python
user_id = int(get_jwt_identity())
```

This ensures that users can access only their own:

* Transactions
* Customers
* Dashboard information
* Analytics
* Fraud alerts
* Reports

---

# 10. Error Handling

The API returns appropriate HTTP status codes for successful and unsuccessful operations.

Common status codes include:

| Status Code | Meaning                            |
| ----------- | ---------------------------------- |
| `200`       | Request successful                 |
| `201`       | Resource created                   |
| `400`       | Invalid request                    |
| `401`       | Authentication required or invalid |
| `404`       | Resource not found                 |
| `500`       | Internal server error              |

Example error response:

```json
{
  "message": "Transaction not found"
}
```

---

# 11. API Modules Summary

| Module         | Endpoints |
| -------------- | --------: |
| Authentication |         2 |
| Dashboard      |         4 |
| Transactions   |         5 |
| Customers      |         6 |
| Analytics      |         6 |
| Fraud Alerts   |         2 |
| Reports        |         5 |
| **Total**      |    **30** |

---

# 12. Technology Used

The API layer is implemented using:

* Python
* Flask
* Flask-JWT-Extended
* Flask-SQLAlchemy
* Flask-CORS
* MySQL
* Redis
* SQLAlchemy ORM
* ReportLab

The frontend communicates with these REST APIs using Axios.

---

# 13. Development Server

### Backend

```bash
cd backend
python run.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend then communicates with the Flask REST API running locally.
