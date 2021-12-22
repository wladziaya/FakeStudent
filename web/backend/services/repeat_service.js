const RepeatRepository = require('../repositories/repeat_repository')

class RepeatService {

    constructor() {
        this.repeatRepository = new RepeatRepository()
    }

    async create(repeat) {
        return await this.repeatRepository.create(repeat)
    }

    async update(repeat) {
        return await this.repeatRepository.update(repeat)
    }

}

module.exports = RepeatService