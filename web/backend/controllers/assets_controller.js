const fsp = require('fs/promises')
const path = require('path')

class AssetsController {
    
    async getCSSFile(client) {
        const { req, res } = client
        res.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'})
        const filePath = path.join(__dirname, '../../', req.url)
        return await fsp.readFile(filePath)
    }

    async getJSFile(client) {
        const { req, res } = client
        res.writeHead(200, {'Content-Type': 'text/javascript; charset=utf-8'})
        const filePath = path.join(__dirname, '../../', req.url)
        return await fsp.readFile(filePath)
    }

    async getNotFoundPage(client) {
        const { res } = client
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
        const filePath = path.join(__dirname, '../../', '404.html')
        return await fsp.readFile(filePath)
    }

    async getMainPage(client) {
        const { res } = client
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        const filePath = path.join(__dirname, '../../', 'frontend/html/main.html')
        return await fsp.readFile(filePath)
    }
}

module.exports = AssetsController
