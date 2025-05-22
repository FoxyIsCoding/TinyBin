import dotenv from 'dotenv'
import { genID } from './url.js';
dotenv.config()

import mysql from 'mysql2/promise'

let connection;

export async function connectDb() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })
    console.log('Connected to DB successfully!')
  }
  return connection
}


export async function addNote(title, text, expiresAt = null) {
  const conn = await connectDb()
  const [result] = await conn.execute(
    `INSERT INTO notes (title, text, created_at, expires_at, url)
     VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?)`,
    [title, text, expiresAt, await genID()]
  )
  return result.insertId
}


export async function getNoteById(id) {
    const conn = await connectDb()
    const [rows] = await conn.execute(
        `SELECT id, title, text, created_at, expires_at
         FROM notes
         WHERE id = ? AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`,
        [id]
    )
    return rows[0]
}

export async function getNoteByURL(url) {
    const conn = await connectDb()
    const [rows] = await conn.execute(
        `SELECT id, title, text, created_at, expires_at, url
         FROM notes
         WHERE url = ?`,
        [url]
    )
    return rows[0]
}

export async function removeExpiredNotes() {
    const conn = await connectDb()
    const [result] = await conn.execute(
        `DELETE FROM notes
         WHERE expires_at IS NOT NULL AND expires_at <= CURRENT_TIMESTAMP`
    )
    return result.affectedRows
}
