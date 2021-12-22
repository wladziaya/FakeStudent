const http = require('http')

const Client = require('./entities/client')
const Session = require('./entities/session')
const Logger = require('./utils/logger')

const AssetsController = require('./controllers/assets_controller')
const UserController = require('./controllers/user_controller')
const TaskController = require('./controllers/task_controller')

const assetsController = new AssetsController()
const userController = new UserController()
const taskController = new TaskController()

const logger = new Logger('./logs/main_log.txt', __filename)

const hostname = '127.0.0.1'
const port = 8000

const routing = {
    'GET': {
        '/': async (client) => {
            client.res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            return '<h1>Main page</h1>'
        },
        '/users/signin': async (client) => userController.signInGet(client),
        '/users/signup': async (client) => userController.signUpGet(client),
        '/tasks': async (client) => taskController.findAll(client),
        '/frontend/css': async (client) => assetsController.getCSSFile(client),
        '/frontend/js': async (client) => assetsController.getJSFile(client)
    },
    'POST': {
        '/users/signin': async (client) => userController.signInPost(client),
        '/users/signup': async (client) => userController.signUpPost(client),
        '/tasks': async (client) => taskController.create(client) 
    },
    'PUT': {
        '/tasks': async (client) => taskController.update(client)
    },
    'DELETE': {
        '/users/signout': async (client) => userController.signOut(client),
        '/tasks': async (client) => taskController.delete(client)
    }
}

const router = req => {
    const routes = routing[req.method]
    if (routes[req.url]) return routes[req.url]

    const routesArray = Object.keys(routes)
    const splitedUrl = req.url.split('/')
    const splitedRoutes = routesArray.map(item => item.split('/'))
    const counts = []
    for (let i = 0; i < splitedRoutes.length; i++) {
        let count = 0
        for (let j = 0; j < splitedRoutes[i].length; j++) {
            const regex = new RegExp(splitedRoutes[i][j])
            const result = regex.test(splitedUrl[j])
            if (result) count++
        }
        counts.push(count)
    }
    return routes[routesArray[counts.indexOf(Math.max(...counts))]]
}

const rendering = {
    string: s => s,
    object: JSON.stringify,
    undefined: () => 'Not Found',
}

const securityPatch = (fn) => async (client) => {
    const { req, res, sessionID } = client

    await logger.info(`Patcher: session=${sessionID}, method=${req.method}`)

    // User in system tries to sign up or sing in
    if (sessionID && (req.url === '/users/signin' | req.url === '/users/signup')) {
        await logger.info('User in system')
        if (req.method === 'GET') {res.writeHead(302, {Location: '/'}); return}
        else if (req.method === 'POST') return {'error': {'code': 400, 'message': 'User can`t do this while being authorized'}}
    }

    // User NOT in system tries to get access to resources except sing in, sing up and frontend files (.css, .js)
    if (!sessionID && (req.url !== '/users/signin' && req.url !== '/users/signup' && !req.url.match('/frontend/'))) {
        await logger.info('User NOT in system')
        if (req.method === 'GET') {res.writeHead(302, {Location: '/users/signin'}); return}
        else if (req.method === 'POST') {res.writeHead(403, 'Forbidden'); return}
    }

    return await fn(client)
}

const server = http.createServer(async (req, res) => {
    try {
        const client = new Client(req, res)
        await Session.restore(client)

        await logger.info(`${req.method}: ${req.url} `)
        await logger.info(`Cookies: ${req.headers.cookie}`)
        await logger.info(`Session: ${client.sessionID}`)

        const handler = router(req)
        await logger.debug(`hadler: ${handler}`)

        if (!handler) {
            res.statusCode = 404
            res.end('Not Found 404')
        }

        const patchedHandler = securityPatch(handler)
        const data = await patchedHandler(client)

        let result
        if (data instanceof Buffer) {
            result = data
        } else {
            const type = typeof data
            const renderer = rendering[type]
            result = renderer(data)
        }
        
        res.end(result)
    } catch (error) {
        await logger.error(error.message)
        res.statusCode = 500
        res.end('Internal Server Error 500')
    }
})


server.listen(port, hostname, async () => {
    await logger.info(`Server running on ${hostname}:${port}`)
})