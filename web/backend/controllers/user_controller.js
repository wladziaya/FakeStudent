const UserService = require('../services/user_service')

const User = require('../entities/user')

const Session = require('../entities/session')
const Logger = require('../utils/logger')

const { getRequestBody } = require('../utils/util')

const md5 = require('md5')
const fsp = require('fs/promises')

const logger = new Logger('./logs/main_log.txt', __filename)

class UserController {

    constructor() {
        this.userService = new UserService()
    }

    async signUpGet(client) {
        try {
            // Registration
            const { res } = client
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            const result = await fsp.readFile('../frontend/html/signup.html', {encoding: 'utf-8'})
            return result
        } catch (error) {
            await logger.error(error.message)
        }
    }

    async signInGet(client) {
        try {
            // Login
            const { res } = client
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            const result = await fsp.readFile('../frontend/html/signin.html', {encoding: 'utf-8'})
            return result
        } catch (error) {
            await logger.error(error.message)
        }
    }

    async signUpPost(client) {
        try {
            // Registration
            const { req, res } = client
            const body = await getRequestBody(req)

            if(!body) {
                await logger.debug('SignUpPost: recieved request body is empty')
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
                return {error: {code: 400, message: 'Get no JSON data from POST request'}}
            }
            await logger.debug('SignUpPost: recieved request body contains data')

            const { firstName, lastName, username, password } = body
            const user = new User(firstName, lastName, username, md5(password))
            const userId = await this.userService.create(user)
            await Session.start(client, {'user_id': userId, 'start_time': new Date()})
            client.sendCookie()
            await logger.info('Signup: Session have been created')
            res.writeHead(302, {Location: '/'})
            return
        } catch (error) {
            await logger.error(error.message)
        }
    }

    async signInPost(client) {
        try {
            // Login
            const { req, res } = client
            const body = await getRequestBody(req)

            if(!body) {
                await logger.debug('SignInPost: recieved request body is empty')
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
                return {error: {code: 400, message: 'Get no JSON data from POST request'}}
            }
            await logger.debug('SignInPost: recieved request body contains data')

            const user = await this.userService.findByUsername(body.username)
            if (user) {
                if (user.password === md5(body.password)) {
                    await Session.start(client, {'user_id': user.id, 'start_time': new Date()})
                    client.sendCookie()
                    res.writeHead(302, {Location: '/'})
                    return 
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
                    return {'error': {
                        'code': 400,
                        'message': 'Incorrect password'
                        }
                    }
                }
            }

            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
            return {'error': {
                'code': 400,
                'message': 'User not found'
                }
            }
        } catch (error) {
            await logger.error(error.message)
        }
    }

    // DELETE
    async signOut(client) {
        try {
            const { res } = client
            await Session.delete(client)
            client.sendCookie()
            res.writeHead(302, {Location: '/users/signin'})
            return
        } catch (error) {
            await logger.error(error.message)
        }
    }

    async findById(client) {
        const { res } = client
        const session = await Session.get(client)
        const user = await this.userService.findById(session['user_id'])
        await logger.debug(`FindById: ${user['username']}, ${user['first_name']}, ${user['last_name']}`)
        res.writeHead(200, {'Content-Type': 'application/json'}) 
        return {'username': user['username'], 'firstName': user['first_name'], 'lastName': user['last_name']}
    }
}

module.exports = UserController