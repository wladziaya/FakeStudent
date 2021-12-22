const TaskRepository = require('../repositories/task_repository')

class TaskService {

    constructor() {
        this.taskRepository = new TaskRepository()
    }

    async create(task) {
        return await this.taskRepository.create(task)
    }

    async findAll(userId) {
        return await this.taskRepository.findAll(userId)
    }

    async update(task) {
        const result = await this.taskRepository.update(task)
        return result > 0
    }

    async delete(userId, id) {
        const result = await this.taskRepository.delete(userId, id)
        return result > 0
    }

}

module.exports = TaskService