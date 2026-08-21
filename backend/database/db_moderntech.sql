CREATE DATABASE IF NOT EXISTS db_moderntech;
USE railway;



-- CREATE TABLES
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'hr',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  dept VARCHAR(100) NOT NULL,
  salary INT NOT NULL,
  contact VARCHAR(100) NOT NULL,
  history TEXT,
  status VARCHAR(20) DEFAULT 'Active',
  score INT DEFAULT 85
);

CREATE TABLE attendance (
  attendance_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  attendance_date VARCHAR(10) NOT NULL,
  status ENUM('Present', 'Absent') NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
  review_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  reviewer_name VARCHAR(100) DEFAULT 'HR Department',
  review_date DATE NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  comments TEXT NOT NULL,
  quarter VARCHAR(20) NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE payroll_timesheet (
  employeeId INT PRIMARY KEY,
  hoursWorked INT DEFAULT 160,
  leaveDeductions INT DEFAULT 0,
  finalSalary INT,
  gross INT,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE time_off (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  leave_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);


-- INSERT DATA

INSERT INTO users (username, password_hash, role) VALUES
('admin', '$2b$10$9MXdadwIBwiSlNBpXgI8JeygKTHaalKVbIgIId86w0M8fHALn1Bae', 'admin');

-- EMPLOYEES: structure + data from hr_db (dept/contact/history/score columns)
INSERT INTO employees (id, name, position, dept, salary, contact, history, score) VALUES (1, 'Sibongile Nkosi', 'Software Engineer', 'Development', 70000, 'sibongile.nkosi@moderntech.com', 'Joined in 2015, promoted to Senior in 2018', 92);
INSERT INTO employees (id, name, position, dept, salary, contact, history, score) VALUES (2, 'Lungile Moyo', 'HR Manager', 'HR', 80000, 'lungile.moyo@moderntech.com', 'Joined in 2013, promoted to Manager in 2017', 88);
INSERT INTO employees (id, name, position, dept, salary, contact, history, score) VALUES (3, 'Thabo Molefe', 'Quality Analyst', 'QA', 55000, 'thabo.molefe@moderntech.com', 'Joined in 2018', 95);
INSERT INTO employees (id, name, position, dept, salary, contact, history, score) VALUES (4, 'Keshav Naidoo', 'Sales Representative', 'Sales', 60000, 'keshav.naidoo@moderntech.com', 'Joined in 2020', 85);
INSERT INTO employees (id, name, position, dept, salary, contact, history, score) VALUES (5, 'Zanele Khumalo', 'Marketing Specialist', 'Marketing', 58000, 'zanele.khumalo@moderntech.com', 'Joined in 2019', 90);
INSERT INTO employees (id, name, position, dept, salary, contact, history, score) VALUES (6, 'Sipho Zulu', 'UI/UX Designer', 'Design', 65000, 'sipho.zulu@moderntech.com', 'Joined in 2016', 94);
INSERT INTO employees (id, name, position, dept, salary, contact, history, score) VALUES (7, 'Naledi Moeketsi', 'DevOps Engineer', 'IT', 72000, 'naledi.moeketsi@moderntech.com', 'Joined in 2017', 87);
INSERT INTO employees (id, name, position, dept, salary, contact, history, score) VALUES (8, 'Farai Gumbo', 'Content Strategist', 'Marketing', 56000, 'farai.gumbo@moderntech.com', 'Joined in 2021', 89);
INSERT INTO employees (id, name, position, dept, salary, contact, history, score) VALUES (9, 'Karabo Dlamini', 'Accountant', 'Finance', 62000, 'karabo.dlamini@moderntech.com', 'Joined in 2018', 91);
INSERT INTO employees (id, name, position, dept, salary, contact, history, score) VALUES (10, 'Fatima Patel', 'Customer Support Lead', 'Support', 58000, 'fatima.patel@moderntech.com', 'Joined in 2016', 86);

-- ATTENDANCE (employee_id matches employees table directly, 1-10)
INSERT INTO attendance (employee_id, attendance_date, status) VALUES
(1, '2025-07-25', 'Present'), (1, '2025-07-26', 'Absent'), (1, '2025-07-27', 'Present'), (1, '2025-07-28', 'Present'), (1, '2025-07-29', 'Present'),
(2, '2025-07-25', 'Present'), (2, '2025-07-26', 'Present'), (2, '2025-07-27', 'Absent'), (2, '2025-07-28', 'Present'), (2, '2025-07-29', 'Present'),
(3, '2025-07-25', 'Present'), (3, '2025-07-26', 'Present'), (3, '2025-07-27', 'Present'), (3, '2025-07-28', 'Absent'), (3, '2025-07-29', 'Present'),
(4, '2025-07-25', 'Absent'), (4, '2025-07-26', 'Present'), (4, '2025-07-27', 'Present'), (4, '2025-07-28', 'Present'), (4, '2025-07-29', 'Present'),
(5, '2025-07-25', 'Present'), (5, '2025-07-26', 'Present'), (5, '2025-07-27', 'Absent'), (5, '2025-07-28', 'Present'), (5, '2025-07-29', 'Present'),
(6, '2025-07-25', 'Present'), (6, '2025-07-26', 'Present'), (6, '2025-07-27', 'Absent'), (6, '2025-07-28', 'Present'), (6, '2025-07-29', 'Present'),
(7, '2025-07-25', 'Present'), (7, '2025-07-26', 'Present'), (7, '2025-07-27', 'Present'), (7, '2025-07-28', 'Absent'), (7, '2025-07-29', 'Present'),
(8, '2025-07-25', 'Present'), (8, '2025-07-26', 'Absent'), (8, '2025-07-27', 'Present'), (8, '2025-07-28', 'Present'), (8, '2025-07-29', 'Present'),
(9, '2025-07-25', 'Present'), (9, '2025-07-26', 'Present'), (9, '2025-07-27', 'Present'), (9, '2025-07-28', 'Absent'), (9, '2025-07-29', 'Present'),
(10, '2025-07-25', 'Present'), (10, '2025-07-26', 'Present'), (10, '2025-07-27', 'Absent'), (10, '2025-07-28', 'Present'), (10, '2025-07-29', 'Present');

-- REVIEWS (employee_id matches employees table directly, 1-10)
INSERT INTO reviews (employee_id, reviewer_name, review_date, rating, comments, quarter) VALUES
(1, 'HR Department', '2026-08-12', 4.5, 'Sibongile Nkosi brings strong focus to development work and continues to contribute positively as a software engineer. Their reliability and collaboration make them a valuable part of the team.', 'Q2 2025'),
(2, 'HR Department', '2026-08-12', 4.5, 'Lungile Moyo brings strong focus to her work and continues to contribute positively as a HR manager. Their reliability and collaboration make them a valuable part of the team.', 'Q2 2025'),
(3, 'HR Department', '2026-08-12', 4.5, 'Thabo Molefe brings strong focus to a quality analysis and continues to contribute positively as a quality analyst. Their reliability and collaboration make them a valuable part of the team.', 'Q2 2025'),
(4, 'HR Department', '2026-08-12', 4.0, 'Keshav Naidoo brings strong focus to sales work and continues to contribute positively as a sales representative. Their reliability and collaboration make them a valuable part of the team.', 'Q2 2025'),
(5, 'HR Department', '2026-08-12', 4.0, 'Zanele Khumalo brings strong focus to marketing work and continues to contribute positively as a marketing specialist. Their reliability and collaboration make them a valuable part of the team.', 'Q2 2025'),
(6, 'HR Department', '2026-08-12', 4.2, 'Sipho Zulu brings strong focus to design work and continues to contribute positively as a UX designer. Their reliability and collaboration make them a valuable part of the team.', 'Q2 2025'),
(7, 'HR Department', '2026-08-12', 4.3, 'Naledi Moeketsi brings strong focus to IT work and continues to contribute positively as a devops engineer. Their reliability and collaboration make them a valuable part of the team.', 'Q2 2025'),
(8, 'HR Department', '2026-08-12', 4.5, 'Farai Gumbo brings strong focus to marketing work and continues to contribute positively as a content strategist. Their reliability and collaboration make them a valuable part of the team.', 'Q2 2025'),
(9, 'HR Department', '2026-08-12', 4.5, 'Karabo Dlamini brings strong focus to finance work and continues to contribute positively as a accountant. Their reliability and collaboration make them a valuable part of the team.', 'Q2 2025'),
(10, 'HR Department', '2026-08-12', 4.0, 'Fatima Patel brings strong focus to support work and continues to contribute positively as a customer support lead. Their reliability and collaboration make them a valuable part of the team.', 'Q2 2025');

-- PAYROLL_TIMESHEET: structure + data from hr_db
INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES (1, 160, 8, 69500, 70000);
INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES (2, 150, 10, 79000, 80000);
INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES (3, 170, 4, 54800, 55000);
INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES (4, 165, 6, 59700, 60000);
INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES (5, 158, 5, 57850, 58000);
INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES (6, 168, 2, 64800, 65000);
INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES (7, 175, 3, 71800, 72000);
INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES (8, 160, 0, 56000, 56000);
INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES (9, 155, 5, 61500, 62000);
INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES (10, 162, 4, 57750, 58000);


INSERT INTO time_off (employee_id, leave_type, start_date, end_date, status, reason) VALUES
(1, 'Sick Leave', '2025-07-22', '2025-07-22', 'Approved', NULL),
(1, 'Personal', '2024-12-01', '2024-12-01', 'Pending', NULL),
(2, 'Family Responsibility', '2025-07-15', '2025-07-15', 'Denied', NULL),
(2, 'Vacation', '2024-12-02', '2024-12-02', 'Approved', NULL),
(3, 'Medical Appointment', '2025-07-10', '2025-07-10', 'Approved', NULL),
(3, 'Personal', '2024-12-05', '2024-12-05', 'Pending', NULL),
(4, 'Bereavement', '2025-07-20', '2025-07-20', 'Approved', NULL),
(5, 'Childcare', '2024-12-01', '2024-12-01', 'Pending', NULL),
(6, 'Sick Leave', '2025-07-18', '2025-07-18', 'Approved', NULL),
(7, 'Vacation', '2025-07-22', '2025-07-22', 'Pending', NULL),
(8, 'Medical Appointment', '2024-12-02', '2024-12-02', 'Approved', NULL),
(9, 'Childcare', '2025-07-19', '2025-07-19', 'Denied', NULL),
(10, 'Vacation', '2024-12-03', '2024-12-03', 'Pending', NULL);

-- Clear old data (optional, but safe)
DELETE FROM payroll_timesheet;

-- Re-insert the data with the correct columns
INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES 
(1, 160, 8, 69500, 70000),
(2, 150, 10, 79000, 80000),
(3, 170, 4, 54800, 55000),
(4, 165, 6, 59700, 60000),
(5, 158, 5, 57850, 58000),
(6, 168, 2, 64800, 65000),
(7, 175, 3, 71800, 72000),
(8, 160, 0, 56000, 56000),
(9, 155, 5, 61500, 62000),
(10, 162, 4, 57750, 58000);

ALTER TABLE payroll_timesheet
ADD COLUMN tax DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN uif DECIMAL(10,2) NOT NULL DEFAULT 0;

UPDATE payroll_timesheet
SET 
  tax = ROUND(gross * 0.18, 2),
  uif = ROUND(gross * 0.01, 2);
  
SELECT p.*, e.name as employee_name, e.dept as department,
       (p.gross - p.tax - p.uif) AS calculatedNetPay
FROM payroll_timesheet p
JOIN employees e ON p.employeeId = e.id ;
  
SELECT * FROM users;
SELECT * FROM employees;
 SELECT * FROM attendance;
SELECT * FROM reviews;
SELECT * FROM payroll_timesheet;
SELECT * FROM time_off;