import mysql, { type ConnectionOptions } from "mysql2/promise";

const access: ConnectionOptions = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
};

export const $dbconn = mysql.createConnection(access);
