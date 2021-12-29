# FakeStudent API

## Operations with User

### POST `/users/signup` - creates a new User and logs into system
Expected request body:
```json
{
    "firstName": "Eliot",
    "lastName": "Alderson",
    "username": "mr.robot",
    "password": "fsociety"
}
```
If success:

Response 302 - Redirect to main page `/`

If no json recieved: 

Response 200 with json
```json
{
    "error": {
        "code": 400,
        "message": "Get no JSON data from POST request"
    }
}
```

---

### GET `/users` - returns information about User

If success:

Response 200 with json
```json
{
    "username": "mr_robot",
    "firstName": "Eliot",
    "lastName": "Alderson"
}
```

---

### POST `/users/signin` - logs into system with created User data
Expected request body:
```json
{
    "username": "mr.robot",
    "password": "fsociety"
}
```
If success:

Response 302 - Redirect to main page `/`

If no json recieved: 

Response 200 with json
```json
{
    "error": {
        "code": 400,
        "message": "Get no JSON data from POST request"
    }
}
```

If password is incorrect:

Response 200 with json
```json
{
    "error": {
        "code": 400,
        "message": "Incorrect password"
    }
}
```

If no such user in system:

Response 200 with json
```json
{
    "error": {
        "code": 400,
        "message": "User not found"
    }
}
```

---

### DELETE `/users/signout` - logs User out
No response body expected.

If success:

Response 302 - Redirect to sign in page `/users/signin`

---

## Operations with Task

### GET `/tasks` - returns a list of Tasks

If success:

Response 200 with json
```json
[
    {
        "id": 1,
        "title": "Parallel Prog1",
        "url": "https://www.websitetovisit.com/pp",
        "dttm": "2021-11-17T08:25:00.000Z",
        "delta": 7,
        "repeatTitle": "Every week",
        "platformTitle": "BBB"
    },
    {
        "id": 2,
        "title": "Comp Arch 2",
        "url": "https://www.websitetovisit.com/test",
        "dttm": "2021-12-20T10:30:00.000Z",
        "delta": 1,
        "repeatTitle": "Every day",
        "platformTitle": "BBB"
    }
]
```

If User have no Tasks:

Response 200 with json
```json
[]
```

---

### POST `/tasks` - creates a new Task
Expected request body:
```json
{
    "title": "Comp Arch 2",
    "url": "https://www.websitetovisit.com/test",
    "dttm": "2021-11-17 10:25:00",
    "delta": 7,
    "repeatTitle": "Every week",
    "platformTitle": "BBB"
}
```

If success:

Response 200 with json
```json
{
    "taskId": 1
}
```

---

### PUT `/tasks` - updates Task data
Expected request body:
```json
{
    "taskId": 2,
    "title": "Brand New Update",
    "url": "https://www.changed.com/no-test",
    "dttm": "2036-03-10 16:30:00",
    "delta": 14,
    "repeatTitle": "Every 2 weeks",
    "platformTitle": "Cisco"
}
```

If success:

Response 200 with json
```json
{
    "taskId": 2
}
```

If no such Task or User tries to update someone's else Task:

Response 200 with json
```json
{
    "error": {
        "code": 400,
        "message": "Can`t update task: task doesn`t exist or you don`t have rights to update it"
    }
}
```

---

### DELETE `/tasks` - deletes Task
Expected request body:
```json
{
    "taskId": 2
}
```

If success:

Response 200 with json
```json
{
    "taskId": 2
}
```

If no such Task or User tries to update someone's else Task:

Response 200 with json
```json
{
    "error": {
        "code": 400,
        "message": "Can`t delete task: task doesn`t exist or you don`t have rights to delete it"
    }
}
```
