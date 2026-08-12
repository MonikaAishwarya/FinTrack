# FinTrack – Personal Finance & Financial Analytics Dashboard

FinTrack is a full-stack personal finance and financial analytics dashboard that allows users to securely manage transactions, monitor income and expenses, visualize financial activity, detect potentially fraudulent activity, and generate financial reports.

## Features

* User registration and login
* JWT-based authentication
* Password hashing
* Protected API endpoints
* User-specific data access
* Transaction management
* Add and delete transactions
* Transaction search and filtering
* Transaction pagination
* Income and expense tracking
* Financial dashboard
* Monthly financial analytics
* Recent transaction tracking
* Customer management
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

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* Axios
* React Router
* Tailwind CSS
* Recharts

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

## Project Architecture

The application follows a full-stack architecture:

```text
User
  ↓
React Frontend
  ↓
REST APIs
  ↓
Flask Backend
  ↓
SQLAlchemy ORM
  ↓
MySQL Database
```

The backend is organized into routes, controllers, services, and models. The frontend is organized into pages, layouts, reusable components, context, and API services.

## Authentication

FinTrack uses JWT-based authentication to secure protected resources.

The authentication flow includes:

1. User registration with name, email, and password.
2. Password hashing before storing the password.
3. Credential validation during login.
4. JWT access token generation after successful login.
5. Token storage on the frontend.
6. Automatic JWT attachment to protected API requests.
7. Protected backend endpoints using JWT verification.
8. User-specific access to transactions, customers, reports, and fraud alerts.

## Dashboard

The dashboard provides an overview of the user's financial activity.

It displays:

* Total Balance
* Total Income
* Total Expenses
* Total Transactions
* Monthly income and expense analytics
* Recent transactions
* Fraud alerts

The dashboard retrieves data from protected backend APIs and displays it through reusable React components.

## Transaction Management

Users can manage their financial transactions through the Transactions page.

Supported operations include:

* Add transactions
* View transactions
* Delete transactions
* Search transactions
* Filter by transaction type
* Filter by transaction status
* Filter by date
* Paginate transaction results

Each transaction contains information such as:

* Transaction ID
* Title
* Amount
* Type
* Category
* Payment Method
* Status
* Created At

Transactions are associated with the authenticated user.

## Financial Analytics

The application provides financial analytics based on transaction data.

The dashboard calculates:

* Total Income
* Total Expenses
* Current Balance
* Total Transactions

Balance is calculated as:

```text
Balance = Total Income - Total Expenses
```

The application also provides:

* Category-wise expense summaries
* Monthly income summaries
* Monthly expense summaries
* Recent transaction information

## Customer Management

The backend includes customer management functionality.

Customers can be associated with transactions through relationships in the database.

Customer data is handled through protected backend APIs and is associated with the authenticated user.

## Fraud Detection

FinTrack includes a rule-based fraud detection system that identifies potentially suspicious activity.

### High-Value Transactions

Transactions with an amount of ₹50,000 or more generate a high-severity fraud alert.

### Multiple Failed Attempts

Multiple failed transactions for the same user generate a high-severity fraud alert.

### Multiple Transactions in a Short Duration

Multiple transactions occurring within a five-minute period generate a medium-severity fraud alert.

### Multiple Login Locations

The application tracks the user's previous login location.

If a user's login location changes, a high-severity fraud alert is generated.

Example:

```text
"Login location changed from Hyderabad to Vijayawada."
```

## Fraud Alerts

Detected suspicious activities are stored as fraud alerts in the database.

Each fraud alert contains:

* Alert ID
* User ID
* Transaction ID, when applicable
* Alert Type
* Severity
* Message
* Created At

Users can view their fraud alerts through the dashboard.

Fraud alerts are restricted to the authenticated user's data.

## Financial Reports

FinTrack supports financial reporting for different time periods.

Supported report types:

* Daily
* Weekly
* Monthly

Reports contain:

* Total Transactions
* Total Revenue
* Total Expenses
* Net Revenue
* Successful Transactions
* Pending Transactions
* Failed Transactions
* Refunded Transactions

## CSV Export

Financial transactions can be exported as CSV files.

The exported CSV contains:

* Transaction ID
* Title
* Amount
* Type
* Category
* Payment Method
* Status
* Created At

CSV reports are available for daily, weekly, and monthly periods.

## PDF Export

FinTrack also supports PDF financial report generation.

PDF reports contain:

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

## API Architecture

The backend follows a layered structure:

```text
Routes → Controllers → Services → Models → Database
```

### Routes

Define API endpoints and connect requests to controllers.

### Controllers

Handle requests, authentication, database operations, and API responses.

### Services

Contain reusable business logic such as fraud detection.

### Models

Define the database structure using SQLAlchemy ORM.

## Database Models

The application contains the following major models:

* User
* Customer
* Transaction
* Fraud Alert

### User

Stores user authentication and profile information.

### Customer

Stores customer information.

### Transaction

Stores financial transaction information.

### Fraud Alert

Stores information about detected suspicious activity.

## Frontend Architecture

The React frontend is organized into reusable components.

Main frontend sections include:

* Authentication components
* Common components
* Dashboard components
* Fraud components
* Transaction components
* UI components
* Pages
* Layouts
* Authentication context
* API services

The authentication context manages the current user's login state and logout functionality.

The centralized Axios API service handles communication with the Flask backend and automatically attaches JWT tokens to protected requests.

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

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Configure the required environment variables in the backend `.env` file.

Make sure MySQL is running and the required database is configured.

Run the backend:

```bash
python run.py
```

### Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

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

## Future Improvements

Possible future improvements include:

* Advanced machine-learning-based fraud detection
* More financial analytics
* Budget planning
* Spending predictions
* Additional report formats
* Improved notification systems
* More granular user roles and permissions
* Automated testing
* Cloud deployment
* Performance optimization

## Author

**Monika Aishwarya Vegesna**

B.Tech – Computer Science (AI & Data Science)

## License

This project was developed as a full-stack financial analytics application for learning, development, and project demonstration purposes.
