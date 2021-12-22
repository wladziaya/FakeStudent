const mysql = require('mysql2/promise')
const { db } = require('../config')

class PlatformRepository {

    async create(platform) {
        try {
            const { title, taskId } = platform
            const sql = 'INSERT INTO platform VALUES(NULL, ?, ?)'
            const conn = await mysql.createConnection(db)
            const [rows] = await conn.query(sql, [title, taskId])
            await conn.end()
            return rows.insertId
        } catch (error) {
            throw new Error(`Can't create platform: ${error.message}`)
        }
    }

    async update(platform) {
        try {
            const { title, taskId } = platform
            const sql = 'UPDATE platform SET title = ? WHERE task_id = ?'
            const conn = await mysql.createConnection(db)
            const [rows] = await conn.query(sql, [title, taskId])
            await conn.end()
            return rows.changedRows
        } catch (error) {
            throw new Error(`Can't update platform: ${error.message}`)
        }
    }
}

module.exports = PlatformRepository