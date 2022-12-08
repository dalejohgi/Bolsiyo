// import * as path from 'path';
// import * as dotenv from 'dotenv';
// dotenv.config({path: path.resolve(__dirname, '../../.env')});
import {createPool} from 'mysql2/promise';

// const {MYSQ_DB_HOST, MYSQ_DB_PORT, MYSQ_DB_USER, MYSQ_DB_PASS, MYSQ_DB_NAME} = process.env;

export async function connect() {
  const connection = await createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'example',
    database: 'bolsiyo',
    connectionLimit: 10,
  });

  return connection;
}
