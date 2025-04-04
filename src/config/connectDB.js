const mysql = require('mysql2/promise');

import "dotenv/config";


const connection = mysql.createPool({ 
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
})

export default connection;


