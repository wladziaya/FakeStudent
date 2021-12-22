class Task {

    constructor(id, title, url, datetime, userId, statusId) {
        this.id = id
        this.title = title
        this.url = url
        this.dttm = datetime
        this.userId = userId
        this.statusId = statusId
    }

}

module.exports = Task