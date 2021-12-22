const mysql = require('mysql2/promise')
const { db } = require('../config')

class UserRepository {

    async create(user) {
        try {
            const { username, password, firstName, lastName } = user
            const sql = 'INSERT INTO user VALUES (NULL, ?, ?, ?, ?)'
            const conn = await mysql.createConnection(db)
            const [rows] = await conn.query(sql, [username, password, firstName, lastName])
            await conn.end()
            return rows.insertId
        } catch (error) {
            throw new Error(error)
        }
    }

    async findByUsername(username) {
        try {
            const sql = 'SELECT * FROM user WHERE username = ?'
            const conn = await mysql.createConnection(db)
            const [rows] = await conn.query(sql, [username])
            await conn.end()
            return rows[0]
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = UserRepository