import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const mysql = require('mysql2');

const { 
  MYSQ_DB_HOST,
  MYSQ_DB_PORT,
  MYSQ_DB_USER,
  MYSQ_DB_PASS
} = process.env

console.log(MYSQ_DB_HOST)

// // create the connection to database
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'example',
//   database: 'bolsiyo'
// });

// // simple query
// connection.query(
//   'SELECT * FROM `companies`',
//   function(err, results) {
//     console.log(results); // results contains rows returned by server
//   }
// );