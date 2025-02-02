import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config();

const connection = mysql.createConnection(
    {
        host: process.env.host,
        port: process.env.port,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database

    }
)

export default connection;