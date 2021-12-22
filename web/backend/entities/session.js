const SessionRepository = require('../repositories/session_repository')
const Logger = require('../utils/logger')
const { generateToken } = require('../utils/util')

const storage = new SessionRepository()

const logger = new Logger('./logs/main_log.txt', __filename)

class Session {

    static inMemoryStorage = new Map()

    constructor(id) {
        this.id = id
    }

    static async start(client, data) {
        try {
            if (client.sessionID) return client.sessionID
            const token = generateToken()
            this.inMemoryStorage.set(token, data)
            await Session.save(token, data['user_id'], data['start_time'])
            client.sessionID = token
            await logger.info(`Start: ${client.sessionID}`)
            client.setCookie('session', token)
            return token
        } catch (error) {
            await logger.error(error.message)
        }
    }

    static async restore(client) {
        try {
            const { cookies } = client
            await logger.info(`Restore: cookie ${cookies}`)
            if (!cookies) return
            const sessionID = cookies.session
            if (sessionID) {
                if (this.inMemoryStorage.get(sessionID)) {
                    // client`s cookie session found in memory
                    client.sessionID = sessionID
                    await logger.info(`Restore: restored ${client.sessionID} from memory`)
                } else if (await storage.get(sessionID)) {
                    // client`s cookie session found in storage
                    client.sessionID = sessionID
                    await logger.info(`Restore: restored ${client.sessionID} from storage`)
                } else {
                    // client`s cookie session is absent in system
                    await this.delete(client)
                    await logger.warning(`Restore: invalid session ${client.sessionID}`)
                }
            }
        } catch (error) {
            await logger.error(error.message)
        }
    }

    static async get(client) {
        try {
            const sessionID = client.sessionID
            if (sessionID) {
                const res = this.inMemoryStorage.get(sessionID) ?? await storage.get(sessionID)
                return res
            } 
            return
        } catch (error) {
            await logger.error(error.message)
        }
    }

    static async delete(client) {
        try {
            const { sessionID } = client
            if (sessionID) {
                this.inMemoryStorage.delete(sessionID)
                await storage.delete(sessionID)
                client.sessionID = undefined
                client.deleteCookie('session')
                await logger.info(`Delete: ${sessionID} deleted`)
            }
        } catch (error) {
            await logger.error(error.message)
        }
    }

    static async save(token, userId, startTime) {
        try {
            await storage.save({token, userId, startTime})
        } catch (error) {
            await logger.error(error.message)
        }
    }
}

module.exports = Session