const { parseCookies } = require('../utils/util')


class Client {

    constructor(req, res) {
        this.req = req
        this.res = res
        this.cookies = parseCookies(req.headers.cookie)
        this.sessionID = undefined
        this.cookiesToSend = []
    }

    setCookie(name, value, httpOnly = true) {
        let cookie = `${name}=${value};Path=/`
        if (httpOnly) cookie += ';HttpOnly'
        this.cookiesToSend.push(cookie)
    }

    deleteCookie(name) {
        const expired = new Date()
        expired.setMinutes(expired.getMinutes() - 5)
        this.cookiesToSend.push(`${name}=deleted;Expires=${expired.toUTCString()};Path=/`)
    }

    sendCookie() {
        const {res, cookiesToSend} = this
        if (cookiesToSend.length && !res.headersSent) {
            res.setHeader('Set-Cookie', cookiesToSend)
        }
    }
}

module.exports = Client