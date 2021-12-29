const TaskService = require('../services/task_service')
const RepeatService = require('../services/repeat_service')
const PlatformService = require('../services/platform_service')

const Task = require('../entities/task')
const Repeat = require('../entities/repeat')
const Platform = require('../entities/platform')

const Session = require('../entities/session')
const Logger = require('../utils/logger')

const { getRequestBody } = require('../utils/util')

const logger = new Logger('./logs/main_log.txt', __filename)

class TaskController {

    constructor() {
        this.taskService = new TaskService()
        this.repeatService = new RepeatService()
        this.platformService = new PlatformService()
    }

    // POST
    async create(client) {
        try {
            const { req, res } = client
            const body = await getRequestBody(req)  
            const { title, url, dttm, delta, repeatTitle, platformTitle } = body
            const session = await Session.get(client)
    
            const task = new Task(undefined, title, url, dttm, session['user_id'], 1)
            const taskId = await this.taskService.create(task)
            await logger.debug('Create: Task created')
    
            const repeat = new Repeat(delta, repeatTitle, taskId)
            await this.repeatService.create(repeat)
            await logger.debug('Create: Repeat created')
    
            const platform = new Platform(platformTitle, taskId)
            await this.platformService.create(platform)
            await logger.debug('Create: Platform created')
           
            res.writeHead(200, {'Content-Type': 'application/json'})
            return {taskId}
        } catch (error) {
            await logger.error(error.message)
        }
    }

    // GET
    async findAll(client) {
        try {
            const { res } = client
            const session = await Session.get(client)
            res.writeHead(200, {'Content-Type': 'application/json'})
            const result = await this.taskService.findAll(session['user_id'])
            await logger.debug(`FindAll: ${result.length} Tasks found`)
            return result
        } catch (error) {
            await logger.error(error.message)
        }
    }

    // PUT 
    async update(client) {
        try {
            const { req, res } = client
            const body = await getRequestBody(req)
            const { taskId, title, url, dttm, delta, repeatTitle, platformTitle } = body
            const session = await Session.get(client)
    
            const task = new Task(taskId, title, url, dttm, session['user_id'], 1)
            const successUpdate = await this.taskService.update(task)
            await logger.debug(`Update: successUpdate=${successUpdate}`)

            if (!successUpdate) {
                res.writeHead(200, {'Content-Type': 'application/json'})
                return {'error': {'code': 400, 'message': 'Can`t update task: task doesn`t exist or you don`t have rights to update it'}}
            }
    
            const repeat = new Repeat(delta, repeatTitle, taskId)
            await this.repeatService.update(repeat)
    
            const platform = new Platform(platformTitle, taskId)
            await this.platformService.update(platform)
            
            res.writeHead(200, {'Content-Type': 'application/json'})
            return {taskId}
        } catch (error) {
            await logger.error(error.message)
        }
    }

    // DELETE
    async delete(client) {
        try {
            const { req, res } = client
            const body = await getRequestBody(req)
            const session = await Session.get(client)
            const successDelete = await this.taskService.delete(session['user_id'], body.taskId)
            await logger.debug(`Delete: successDelete=${successDelete}`)

            if (!successDelete) {
                res.writeHead(200, {'Content-Type': 'application/json'})
                return {'error': {'code': 400, 'message': 'Can`t delete task: task doesn`t exist or you don`t have rights to delete it'}}
            }

            res.writeHead(200, {'Content-Type': 'application/json'})
            return {'taskId': body.taskId}
        } catch (error) {
            await logger.error(error.message)
        }
    }

}

module.exports = TaskController