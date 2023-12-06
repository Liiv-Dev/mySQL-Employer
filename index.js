const inquirer = require('inquirer');
const dbConnection = require('./config/connection');

// Attempts mysql connection
dbConnection.connect((err) => {
    err ? console.log('Error connecting to database', err) :
    console.log('Connected to database')
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
                    addEmployee();
                break;
                case 'Update an employee role' :
                    updateEmployeeRole();
                break;
                case 'Exit' :
                    dbConnection.end(); // Ends connection to db
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

//Function allows user to add department name to database
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
                err ? console.log(err) : console.log(`Department ${departmentName} inserted successfully`)
                initApp();
            })
        })
        .catch((err) => {
            console.error(err);
            initApp()
        })
};

// Function allows user to add roles to database
function addRole() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter the name for the new role:',
            validate: function (input) {
                return input !== '' ? true : 'Please enter valid title for role';
            },
        },
        {
            type: 'number',
            name: 'roleSalary',
            message: 'Enter the salary for the new role:',
            validate: function (input) {
                return input > 0 ? true : 'Please enter valid salary'
            },
        },
        {
            type: 'input',
            name: 'roleDepartment',
            message: 'Enter the department for the new role:',
            // choices: 
        },
    ])
    .then ((answers) => {
        const {newRole, roleSalary, roleDepartment} = answers;

        // SQL query to insert the new roles into the database
        dbConnection.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [newRole, roleSalary, roleDepartment], (err, results) => {
            err ? console.log(err) : console.log(`New role ${newRole} inserted successfully`)
            initApp();
        })
    })
    .catch((err) => {
        console.error(err);
        initApp()
    })
};

// Function allows user to add employee info to database
function addEmployee() {
    inquirer
        .prompt ([
            {
                type: 'input',
                name: 'firstName',
                message: "Enters employee's first name",
                validate: function (input) {
                    return input !== '' ? true : "Please enter the employee's first name";
                },
            },
            {
                type: 'input',
                name: 'lastName',
                message: "Enters employee's last name",
                validate: function (input) {
                    return input !== '' ? true : "Please enter the employee's last name";
                },
            },
            {
                // FIX FUNCTION FOR EMPLOYEE ROLES
                type: 'input',
                name: 'role',
                message: "Enters employee's role",
                validate: function (input) {
                    return input !== '' ? true : "Please enter the employee's first name";
                },
            },
            {
                type: 'input',
                name: 'manager',
                message: "Enters employees manager",
                validate: function (input) {
                    return input !== '' ? true : "Please enter employee's manager";
                },
            },
        ])
        . then((answers) => {
            const firstName = answers.firstName;
            const lastName = answers.lastName;
            const role = answers.role;
            const manager = answers.manager;

            // SQL query to insert the new employee into the database
            dbConnection.query(
                'INSERT INTO employees (first_name, last_name, role, manager_id) VALUES (?, ?, ?, ?)',
                [firstName, lastName, role, manager],
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
        .catch((err) => {
            console.error(err);
            initApp()
        })
};

// Functions allows user to update employee information
function updateEmployeeRole() {
    
}