const fsp = require('fs/promises')
const path = require('path')


class Logger {

    constructor(fileToSave=undefined, currentFile) {
        this.fileToSave = fileToSave
        this.currentFile = path.basename(currentFile)
    }

    async log(msg, level) {
        const date = new Date().toLocaleString().replace(',', '').replace('.', '-').replace('.', '-')
        const output = `[${date}]\t${this.currentFile}\t${level}\t${msg}`
        if (this.fileToSave) await fsp.appendFile(this.fileToSave, output + '\n')
        console.log(output)
    }

    async info(msg) {
        const level = 'INFO'
        await this.log(msg, level)
    }

    async debug(msg) {
        const level = 'DEBUG'
        await this.log(msg, level)
    }

    async warning(msg) {
        const level = 'WARNING'
        await this.log(msg, level)
    }

    async error(msg) {
        const level = 'ERROR'
        await this.log(msg, level)
    }
}

module.exports = Logger