import dotenv from 'dotenv'
dotenv.config()

import mysql from 'mysql2/promise'

export async function loadDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })
    console.log('Connected to DB successfully!')
    await connection.end()
  } catch (err) {
    console.error('Failed to connect to DB:', err.message)
  }
}

