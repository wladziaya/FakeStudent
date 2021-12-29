const User = require('../entities/user')
const UserRepository = require('../repositories/user_repository')

class UserService {

    constructor() {
        this.userRepository = new UserRepository()
    }

    async create(user) {
        // todo add data validation
        return await this.userRepository.create(user)
    }

    async findByUsername(username) {
        try {
            const data = await this.userRepository.findByUsername(username)
            return new User(data['first_name'], data['last_name'], data['username'], data['password'], data['id'])
        } catch (error) {
            if (error instanceof TypeError) return
            throw new Error(error)
        }
    }

    async findById(id) {
        return await this.userRepository.findById(id)
    }

}

module.exports = UserService