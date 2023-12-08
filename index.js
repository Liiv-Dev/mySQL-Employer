const inquirer = require('inquirer');
const dbConnection = require('./config/connection');

// Attempts mysql connection
dbConnection.connect((err) => {
    err ? console.log('Error connecting to database', err) :
    console.log('Connected to database');
    initApp();
});

// Init function to start application
function initApp () {
    // Prompts user with questions/options
    inquirer
        .prompt ([
            {
                type: 'list',
                name:'options',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',//
                    'View all roles',//
                    'View all employees',//
                    'Add a department',//
                    'Add a role',//
                    'Add an employee',//
                    'Update an employee role',//
                    'Exit'//
                ]
            },
        ])
        // collects response
        .then((answers) => {
            // based on users choice, data will be pulled from db or manipulated
            switch(answers.options) {
                case 'View all departments' :
                    dbConnection.query('SELECT * FROM departments', (err, results) => {
                        err ? console.log(err) : console.table(results);
                        initApp(); // Returns user to intro prompts options
                    });
                break;
                case 'View all roles' :
                    dbConnection.query('SELECT * FROM roles', (err, results) => {
                        err ? console.log(err) : console.table(results);
                        initApp(); // Returns user to intro prompts options
                    });
                break;
                case 'View all employees' :
                    dbConnection.query('SELECT * FROM employees', (err, results) => {
                        err ? console.log(err) : console.table(results);
                        initApp(); // Returns user to intro prompts options
                    });
                break;
                case 'Add a department' :
                    addDepartment(); // Uses addDepartment function
                break;
                case 'Add a role' :
                    addRole(); // Uses addRole function
                break;
                case 'Add an employee' :
                    addEmployee();  // Uses addEmployee function
                break;
                case 'Update an employee role' :
                    updateEmployeeRole(); // Uses updateEmployee function
                break;
                case 'Exit' :
                    dbConnection.end(); // Ends connection to db
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

// FUNCTION ADDS DEPARTMENTS TO DATABASE 
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter department name',
                validate: function (input) {
                    return input !== '' ? true : 'Please enter valid department name';
                }, 
            },
        ])
        .then ((answers) => {
            const departmentName = answers.departmentName;

            // SQL query to insert the new departments into the database
            dbConnection.query('INSERT INTO departments (department_name) VALUES (?)', [departmentName], (err, results) => {
                err ? console.log(err) : console.log(`Department ${departmentName} inserted successfully`);
                initApp();
            })
        })
        .catch((err) => {
            console.error(err);
            initApp();
        })
};

// FUNCTION TO ADD NEW ROLES TO DATABASE
function addRole() {
    
    // Fetch department names from the database
    dbConnection.query('SELECT id, department_name FROM departments', (err, departments) => {
        if (err) {
            console.error(err);
            initApp();
            return;
        }

        // Extract department names and create a list for Inquirer prompt
        const departmentChoices = departments.map((department) => ({
            value: department.id,
            name: department.department_name,
        }));

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'roleName',
                    message: 'Enter the name for the new role:',
                    validate: function(input) {
                        return input !== '' ? true : 'Please enter a valid role name';
                    },
                },
                {
                    type: 'number',
                    name: 'roleSalary',
                    message: 'Enter the salary for the new role:',
                    validate: function(input) {
                        return !isNaN(input) && input > 0 ? true : 'Please enter a valid salary';
                    },
                },
                {
                    type: 'list',
                    name: 'roleDepartment',
                    message: 'Select the department for the new role:',
                    choices: departmentChoices,
                },
            ])
            .then((answers) => {
                const { roleName, roleSalary, roleDepartment } = answers;

                // Perform database insertion query using dbConnection
                dbConnection.query(
                    'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
                    [roleName, roleSalary, roleDepartment],
                    (err, results) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(`Role '${roleName}' added successfully!`);
                        }
                        initApp(); // Return to the main menu
                    }
                );
            })
            .catch((error) => {
                console.error(error);
                initApp(); // Return to the main menu in case of an error
            });
    });
}

// FUNCTION TO ADD EMPLOYEE TO DATABASE
function addEmployee() {

    // Fetch role titles from the database
    dbConnection.query('SELECT id, title FROM roles', (err, roles) => {
        if (err) {
            console.error(err);
            initApp(); // Return to the main menu in case of an error
            return;
        }

        // Extract role titles and create a list for Inquirer prompt
        const roleChoices = roles.map((role) => ({
            value: role.id,
            name: role.title,
        }));

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "Enter employee's first name",
                    validate: function (input) {
                        return input !== '' ? true : "Please enter the employee's first name";
                    },
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "Enter employee's last name",
                    validate: function (input) {
                        return input !== '' ? true : "Please enter the employee's last name";
                    },
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Choose employee's role",
                    choices: roleChoices,
                },
            ])
            .then((answers) => {
                const { firstName, lastName, role } = answers;

                dbConnection.query(
                    'INSERT INTO employees (first_name, last_name, role_id) VALUES (?, ?, ?)',
                    [firstName, lastName, role],
                    (err, results) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(`Employee '${firstName} ${lastName}' added successfully!`);
                        }
                        initApp(); // Return to the main menu
                    }
                );
            })
            .catch((error) => {
                console.error(error);
                initApp(); // Return to the main menu in case of an error
            });
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
    // Fetch employees' names and IDs from the database
    dbConnection.query('SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employees', (err, employees) => {
        if (err) {
            console.error(err);
            initApp(); // Return to the main menu in case of an error
            return;
        }

        // Extract employee names and create a list for Inquirer prompt
        const employeeChoices = employees.map((employee) => ({
            value: employee.id,
            name: employee.employee_name,
        }));

        // Fetch role titles and IDs from the database
        dbConnection.query('SELECT id, title FROM roles', (err, roles) => {
            if (err) {
                console.error(err);
                initApp(); // Return to the main menu in case of an error
                return;
            }

            // Extract role titles and create a list for Inquirer prompt
            const roleChoices = roles.map((role) => ({
                value: role.id,
                name: role.title,
            }));

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeId',
                        message: 'Select the employee to update:',
                        choices: employeeChoices,
                    },
                    {
                        type: 'list',
                        name: 'newRoleId',
                        message: 'Select the new role for the employee:',
                        choices: roleChoices,
                    },
                ])
                .then((answers) => {
                    const { employeeId, newRoleId } = answers;

                    // Update the employee's role in the database
                    dbConnection.query(
                        'UPDATE employees SET role_id = ? WHERE id = ?',
                        [newRoleId, employeeId],
                        (err, results) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log('Employee role updated successfully!');
                            }
                            initApp(); // Return to the main menu
                        }
                    );
                })
                .catch((error) => {
                    console.error(error);
                    initApp(); // Return to the main menu in case of an error
                });
        });
    });
}