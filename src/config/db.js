require('dotenv').config();

const mysql = require('mysql2');

const settings = {
    connectionLimit : 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
    dateStrings: true
}

const mysqlpool = mysql.createPool(settings);

module.exports = mysqlpool.promise(); //Async/Await