const mysql = require('mysql2');

const dbConnection = mysql.createConnection({
    host: 'localHost',
    user:'root',
    password: '',
    database: 'employee_db'  
});

module.exports = dbConnection;