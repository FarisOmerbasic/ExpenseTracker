CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    currency_preference VARCHAR(3) 
);

CREATE TABLE PaymentMethod (
    payment_method_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    name VARCHAR(100),
    type VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
)

CREATE TABLE Category (
    category_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    name VARCHAR(100),
    sort_order INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
)

CREATE TABLE Account (
    account_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    name VARCHAR(100),
    type VARCHAR(100),
    initial_balance DECIMAL(10, 2),
    current_balance DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
)

CREATE TABLE Expenses(
    expense_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    account_id INT,
    category_id INT,
    payment_method_id INT,
    amount DECIMAL(10, 2),
    date DATE,
    description VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (account_id) REFERENCES Account(account_id),
    FOREIGN KEY (category_id) REFERENCES Category(category_id),
    FOREIGN KEY (payment_method_id) REFERENCES PaymentMethod(payment_method_id)
)

CREATE TABLE Budget (
    budget_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    category_id INT,
    amount DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
)

INSERT INTO Users (name, email, password_hash, currency_preference)
VALUES
('Faris Omerbašić', 'farisomerbasic@hotmail.com', 'hashedpassowrd', 'BAM')

INSERT INTO Category (name, sort_order)
VALUES
('Food', 200),
('Rent', 500),
('Transport', 50);

INSERT INTO PaymentMethod (user_id, name, type)
VALUES
(1, 'Visa Debit Card', 'Debit');

INSERT INTO Account (user_id, name, type, initial_balance, current_balance)
VALUES
(1, 'Wallet', 'Wallet', 2000.00, 1400.00)

INSERT INTO Budget (user_id, category_id, amount)
VALUES
(1, 1, 500.00);

INSERT INTO Expenses (user_id, account_id, category_id, payment_method_id, amount, date, description)
VALUES
(1,1,1,1, 55.95, '2025-11-14', 'Kupovina u Bingu');