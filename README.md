# FinTrack – Personal Finance & Financial Analytics Dashboard

FinTrack is a full-stack personal finance and financial analytics dashboard that enables users to securely manage transactions, monitor income and expenses, manage customers, visualize financial activity, detect potentially fraudulent activity, and generate financial reports.

## Features

* User registration and login
* JWT-based authentication
* Password hashing
* Protected API endpoints
* User-specific data access
* Transaction management
* Add, update, and delete transactions
* Transaction search and filtering
* Transaction pagination
* Income and expense tracking
* Financial dashboard
* Financial analytics dashboard
* Revenue trend analysis
* Daily transaction analysis
* Monthly transaction analysis
* Expense category analysis
* Customer growth analysis
* Payment method distribution
* Transaction heatmap
* Customer management
* Customer analytics
* Customer-to-transaction association
* Rule-based fraud detection
* Fraud alert management
* Multiple login location detection
* Daily financial reports
* Weekly financial reports
* Monthly financial reports
* CSV report export
* PDF report export
* Toast notifications
* Responsive dashboard interface

---

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* Axios
* React Router
* Tailwind CSS
* Recharts
* Chart.js
* react-chartjs-2
* D3.js
* Lucide React
* React Hot Toast

### Backend

* Python
* Flask
* Flask REST APIs
* Flask-JWT-Extended
* Flask-SQLAlchemy
* Flask-CORS
* ReportLab

### Database

* MySQL
* SQLAlchemy ORM

### Tools

* Git
* GitHub
* Visual Studio Code

---

## Project Architecture

FinTrack follows a full-stack client-server architecture:

```text
                    User
                      │
                      ▼
              React Frontend
                      │
             Axios / REST APIs
                      │
                      ▼
               Flask Backend
                      │
             Controllers / Routes
                      │
                      ▼
              SQLAlchemy ORM
                      │
                      ▼
                MySQL Database
```

The frontend is organized into pages, reusable components, layouts, authentication context, and API services.

The backend is organized into routes, controllers, models, services, and database extensions.

---

## Authentication

FinTrack uses JWT-based authentication to protect user resources.

The authentication flow includes:

1. User registration with name, email, and password.
2. Password hashing before storing credentials.
3. Credential validation during login.
4. JWT access token generation after successful login.
5. Token storage on the frontend.
6. Automatic JWT attachment to protected API requests.
7. JWT verification on protected backend endpoints.
8. User-specific authorization for application resources.

Protected resources include:

* Transactions
* Customers
* Customer analytics
* Financial analytics
* Reports
* Fraud alerts

---

## Dashboard

The dashboard provides an overview of the user's financial activity.

It displays information such as:

* Total Balance
* Total Income
* Total Expenses
* Total Transactions
* Monthly financial activity
* Recent transactions
* Fraud alerts

The dashboard retrieves information from protected Flask REST APIs and presents it through reusable React components.

---

## Transaction Management

Users can manage financial transactions through the Transactions page.

Supported operations include:

* Add transactions
* View transactions
* Update transactions
* Delete transactions
* Search transactions
* Filter by transaction type
* Filter by transaction status
* Filter by date
* Paginate transaction results

Each transaction can contain:

* Transaction ID
* Title
* Amount
* Type
* Category
* Payment Method
* Status
* Customer
* Created At

Transactions are associated with the authenticated user.

Customer-related transactions can also be associated with customer records.

---

## Customer Management

FinTrack includes customer management functionality for maintaining customer-related financial information.

Users can:

* Add customers
* View customers
* View individual customer details
* Update customer information
* Delete customers
* View customer analytics

Customer information includes:

* Customer ID
* Customer Name
* Phone
* Email
* Created At

Customer records are protected by user-specific authorization.

Transactions can be associated with customers through the customer relationship in the database.

Deleting a customer does not automatically delete the associated transactions, allowing historical transaction records to be preserved.

---

## Financial Analytics

FinTrack provides an analytics dashboard for analyzing financial activity.

The analytics page includes:

### Revenue Trend

Displays successful income and expense activity over time.

### Daily Transactions

Shows the number of transactions recorded on each day.

### Monthly Transactions

Displays transaction counts grouped by month and year.

### Expense Analysis

Groups successful expenses by category and calculates the total amount spent in each category.

### Customer Growth

Shows customer additions over time.

### Payment Method Distribution

Displays the distribution of successful transactions across different payment methods.

### Transaction Heatmap

Provides a visual representation of transaction activity across dates.

The analytics dashboard uses interactive chart components to make financial trends easier to understand.

---

## Financial Calculations

The dashboard calculates important financial metrics from transaction data.

### Balance

```text
Balance = Total Income - Total Expenses
```

### Revenue

Revenue is calculated from the relevant successful income transactions.

### Expenses

Expenses are calculated from successful expense transactions.

Analytics endpoints aggregate transaction data using SQLAlchemy database queries.

---

## Fraud Detection

FinTrack includes a rule-based fraud detection system that identifies potentially suspicious activity.

### High-Value Transactions

Transactions with an amount of ₹50,000 or more generate a high-severity fraud alert.

### Multiple Failed Attempts

Multiple failed transactions for the same user can generate a high-severity fraud alert.

### Multiple Transactions in a Short Duration

Multiple transactions occurring within a five-minute period can generate a medium-severity fraud alert.

### Multiple Login Locations

The application tracks previous login locations.

If a user's login location changes, a high-severity fraud alert can be generated.

Example:

```text
Login location changed from Hyderabad to Vijayawada.
```

---

## Fraud Alerts

Detected suspicious activities are stored as fraud alerts.

Each fraud alert can contain:

* Alert ID
* User ID
* Transaction ID, when applicable
* Alert Type
* Severity
* Message
* Created At

Fraud alerts are restricted to the authenticated user's data.

---

## Financial Reports

FinTrack supports financial reporting for multiple periods.

Supported report types:

* Daily
* Weekly
* Monthly

Reports provide information such as:

* Total Transactions
* Total Revenue
* Total Expenses
* Net Revenue
* Successful Transactions
* Pending Transactions
* Failed Transactions
* Refunded Transactions

---

## CSV Export

Financial transaction data can be exported as CSV files.

The exported data can contain:

* Transaction ID
* Title
* Amount
* Type
* Category
* Payment Method
* Status
* Created At

CSV reports are available for:

* Daily
* Weekly
* Monthly

---

## PDF Export

FinTrack also supports PDF report generation.

PDF reports contain financial summaries and transaction information.

### Financial Summary

* Total Transactions
* Total Revenue
* Total Expenses
* Net Revenue
* Successful Transactions
* Pending Transactions
* Failed Transactions
* Refunded Transactions

### Transaction Details

* Transaction ID
* Title
* Amount
* Type
* Category
* Status

PDF reports are available for daily, weekly, and monthly periods.

---

## API Architecture

The backend follows a layered structure:

```text
Routes
   ↓
Controllers
   ↓
Services / Business Logic
   ↓
Models
   ↓
SQLAlchemy ORM
   ↓
MySQL Database
```

### Routes

Routes define API endpoints and connect incoming requests to controller functions.

### Controllers

Controllers handle:

* Request processing
* Authentication
* Authorization
* Database operations
* Data aggregation
* API responses

### Services

Services contain reusable business logic, including fraud detection and related processing.

### Models

SQLAlchemy models define the application's database structure and relationships.

---

## Database Models

The application contains major models including:

* User
* Customer
* Transaction
* Fraud Alert

### User

Stores authentication and user profile information.

### Customer

Stores customer information associated with a user.

### Transaction

Stores financial transaction information and can be associated with a customer.

### Fraud Alert

Stores information about potentially suspicious activities.

---

## Frontend Architecture

The React frontend is organized into reusable sections:

```text
frontend/
│
├── src/
│   ├── components/
│   │   ├── analytics/
│   │   ├── common/
│   │   ├── transactions/
│   │   └── ...
│   │
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── App.jsx
```

Important frontend sections include:

* Authentication components
* Common components
* Dashboard components
* Analytics components
* Customer components
* Fraud components
* Transaction components
* Pages
* Layouts
* Authentication context
* API services

The authentication context manages the user's login state and logout functionality.

The centralized Axios API service handles communication with the Flask backend and attaches JWT tokens to protected requests.

---

## Data Visualization

FinTrack uses interactive visualization libraries to present financial data.

Charts are used for:

* Revenue trends
* Transaction activity
* Expense analysis
* Customer growth
* Payment method distribution
* Other financial analytics

The application primarily uses **Recharts** for React-based financial charts, with Chart.js and D3.js available for data visualization requirements and specialized visualizations.

---

## Security

The application implements:

* Password hashing
* JWT-based authentication
* Protected API endpoints
* User-specific authorization
* User-specific transaction access
* User-specific customer access
* User-specific fraud alert access
* User-specific report access
* Environment-based configuration for sensitive values

Sensitive values such as database credentials and JWT secrets should be stored in environment variables and should not be committed to GitHub.

## Testing & Validation

The application was manually tested across the major functional modules to verify that the implemented features work correctly.

### Authentication

* User registration
* User login
* Invalid login credentials
* JWT-protected routes
* Logout

### Transaction Management

* Add transaction
* View transactions
* Update transaction
* Delete transaction
* Search transactions
* Filter by transaction type
* Filter by transaction status
* Filter by date
* Pagination
* Customer-linked transactions

### Customer Management

* Add customer
* View customers
* Update customer
* Delete customer
* Customer analytics
* Customer-transaction relationship handling

### Dashboard & Analytics

* Dashboard summary
* Income and expense calculations
* Balance calculation
* Monthly financial analytics
* Category-wise expense analysis
* Revenue trend
* Daily transaction analysis
* Monthly transaction analysis
* Customer growth analysis
* Payment method distribution

### Fraud Detection

* High-value transaction detection
* Multiple failed transaction detection
* Multiple transactions within a short duration
* Multiple login location detection
* Fraud alert retrieval

### Reports

* Daily report generation
* Weekly report generation
* Monthly report generation
* CSV report export
* PDF report export

### Redis Caching

* Dashboard cache creation
* Cached dashboard data retrieval
* Cache invalidation after transaction changes

### Database

* MySQL database initialization
* User and customer relationships
* User and transaction relationships
* Customer and transaction relationships
* Fraud alert and transaction relationships
* Foreign-key constraints
* Database indexes


## Installation and Setup

### Prerequisites

The following software is required:

* Python
* Node.js
* npm
* MySQL
* Git

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables in the backend `.env` file.

Make sure MySQL is running and the required database is configured.

Run the Flask backend:

```bash
python run.py
```

### Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL provided by Vite in the browser.

---

## Git and Environment Files

Sensitive and generated files are excluded through `.gitignore`.

Examples include:

```text
.env
venv/
node_modules/
__pycache__/
dist/
.vscode/
```

Environment variables should never be committed to the repository.

---

## Future Improvements

Possible future improvements include:

* Advanced machine-learning-based fraud detection
* Budget planning
* Spending predictions
* Additional financial analytics
* More report formats
* Improved notification systems
* More granular user roles and permissions
* Automated unit and integration testing
* Cloud deployment
* Performance optimization
* Advanced customer analytics

---

## Author

**Monika Aishwarya Vegesna**

B.Tech – Computer Science (AI & Data Science)

---

## License

This project was developed as a full-stack financial analytics application for learning, development, and project demonstration purposes.
