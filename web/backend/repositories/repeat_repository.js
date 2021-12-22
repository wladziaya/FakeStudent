const mysql = require('mysql2/promise')
const { db } = require('../config')

class RepeatRepository {

    async create(repeat) {
        try {
            const { delta, title, taskId } = repeat
            const sql = 'INSERT INTO `repeat` VALUES (NULL, ?, ?, ?)'
            const conn = await mysql.createConnection(db)
            const [rows] = await conn.query(sql, [delta, title, taskId])
            await conn.end()
            return rows.insertId
        } catch (error) {
            throw new Error(`Can't create Repeat: ${error.message}`)
        }
    }

    async update(repeat) {
        try {
            const { delta, title, taskId } = repeat
            const sql = 'UPDATE `repeat` SET delta = ?, title = ? WHERE task_id = ?'
            const conn = await mysql.createConnection(db)
            const [rows] = await conn.query(sql, [delta, title, taskId])
            await conn.end()
            return rows.changedRows
        } catch (error) {
            throw new Error(`Can't update Repeat: ${error.message}`)
        }
    }

}

module.exports = RepeatRepository