-- Inserts departments into table
INSERT INTO departments (department_name) VALUES
('Human Resources'),
('Marketing'),
('Engineering'),
('Administration');

--Inserts roles in table
INSERT INTO roles (title, salary, department_id) VALUES
('HR Manager', 75000, 1),
('Sales Manager', 90000, 2),
('Software Engineer', 80000, 3),
('Data Entry', 55000, 4);

-- Inserts Employees into table
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
('Willie', 'Jones', 3, null),
('Latoya', 'Payton', 4, null),
('Tashe', 'Jones', 1, null),
('Meme', 'Jones', 2, null);