class User {

    constructor(firstName, lastName, username, password, id=undefined) {
        this.firstName = firstName
        this.lastName = lastName
        this.username = username
        this.password = password
        this.id = id
    }

}

module.exports = User
