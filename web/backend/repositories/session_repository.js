const mysql = require('mysql2/promise')
const { db } = require('../config')

class SessionRepository {

    async get(token) {
        try {
            const sql = 'SELECT * FROM session WHERE id = ?'
            const conn = await mysql.createConnection(db)
            const [rows] = await conn.query(sql, [token])
            await conn.end()
            return rows[0]
        } catch (error) {
            throw new Error(error)
        }   
    }

    async save(session) {
        try {
            const { token, userId, startTime } = session
            const sql = 'INSERT INTO session VALUES (?, ?, ?)'
            const conn = await mysql.createConnection(db)
            await conn.query(sql, [token, userId, startTime])
            await conn.end()
            return true
        } catch (error) {
            throw new Error(error)
        }
    }

    async delete(token) {
        try {
            const sql = 'DELETE FROM session WHERE id = ?'
            const conn = await mysql.createConnection(db)
            await conn.query(sql, [token])
            await conn.end()
            return true   
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = SessionRepository