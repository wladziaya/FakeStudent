const mysql = require('mysql2/promise')
const { db } = require('../config')

class TaskRepository {

    async create(task) {
        try {
            const { userId, title, url, dttm, statusId } = task
            const sql = 'INSERT INTO task VALUES (NULL, ?, ?, ?, ?, ?)'
            const conn = await mysql.createConnection(db)
            const [rows] = await conn.query(sql, [userId, title, url, dttm, statusId])
            await conn.end()
            return rows.insertId
        } catch (error) {
            throw new Error(`Can't create new task: ${error.message}`)
        }
    }

    async findAll(userId) {
        try {
            const sql = 'SELECT * FROM task WHERE user_id = ?'
            const conn = await mysql.createConnection(db)
            const [rows] = await conn.query(sql, [userId])
            await conn.end()
            return rows
        } catch (error) {
            throw new Error(`Can't find tasks of user with id=${userId}: ${error.message}}`)
        }
    }

    async update(task) {
        try {
            const { id, title, url, dttm, userId, statusId } = task
            const sql = `
                UPDATE task SET
                user_id = ?, title = ?, url = ?, dttm = ?, status_id = ?
                WHERE id = ? AND user_id = ?
            `
            const conn = await mysql.createConnection(db)
            const [rows] = await conn.query(sql, [userId, title, url, dttm, statusId, id, userId])
            await conn.end()
            return rows.changedRows
        } catch (error) {
            throw new Error(`Can't update task: ${error.message}`)
        }
    }

    async delete(userId, id) {
        try {
            const sql = 'DELETE FROM task WHERE user_id = ? AND id = ?'
            const conn = await mysql.createConnection(db)
            const [rows] = await conn.query(sql, [userId, id])
            await conn.end()
            return rows.affectedRows
        } catch(error) {
            throw new Error(`Can't delete task with user_id=${userId} and id=${id}: ${error.message}`)
        }
    }

}

module.exports = TaskRepository