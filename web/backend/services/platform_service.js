const PlatformRepository = require('../repositories/platform_repository')

class PlatformService {

    constructor() {
        this.platformRepository = new PlatformRepository()
    }

    async create(platform) {
        return await this.platformRepository.create(platform)
    }

    async update(platform) {
        return await this.platformRepository.update(platform)
    }
}

module.exports = PlatformService