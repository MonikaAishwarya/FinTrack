-- ==========================================================
-- FinTrack - Fintech Dashboard Analytics
-- Database Script
-- Database: MySQL
-- ==========================================================


-- ==========================================================
-- CREATE DATABASE
-- ==========================================================

CREATE DATABASE IF NOT EXISTS fintech_dashboard;

USE fintech_dashboard;


-- ==========================================================
-- USERS TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(120) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    last_login_location VARCHAR(100) NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);


-- ==========================================================
-- CUSTOMERS TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS customers (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    customer_name VARCHAR(100) NOT NULL,

    phone VARCHAR(20) NULL,

    email VARCHAR(120) NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_customers_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)

);


-- ==========================================================
-- TRANSACTIONS TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS transactions (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    customer_id INT NULL,

    title VARCHAR(100) NOT NULL,

    amount FLOAT NOT NULL,

    type VARCHAR(20) NOT NULL,

    category VARCHAR(50) NOT NULL,

    payment_method VARCHAR(50) NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'Success',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transactions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_transactions_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)

);


-- ==========================================================
-- FRAUD ALERTS TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS fraud_alerts (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    transaction_id INT NULL,

    alert_type VARCHAR(100) NOT NULL,

    severity VARCHAR(20) NOT NULL DEFAULT 'Medium',

    message VARCHAR(255) NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_fraud_alerts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_fraud_alerts_transaction
        FOREIGN KEY (transaction_id)
        REFERENCES transactions(id)

);


-- ==========================================================
-- INDEXES
-- ==========================================================

CREATE INDEX idx_customers_user_id
ON customers(user_id);


CREATE INDEX idx_transactions_user_id
ON transactions(user_id);


CREATE INDEX idx_transactions_customer_id
ON transactions(customer_id);


CREATE INDEX idx_transactions_created_at
ON transactions(created_at);


CREATE INDEX idx_transactions_status
ON transactions(status);


CREATE INDEX idx_fraud_alerts_user_id
ON fraud_alerts(user_id);


CREATE INDEX idx_fraud_alerts_transaction_id
ON fraud_alerts(transaction_id);


-- ==========================================================
-- DATABASE COMPLETE
-- ==========================================================