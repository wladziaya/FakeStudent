from pydantic import BaseModel

from services.Classes.DbAPI import DbAPI


class Task(BaseModel):
    id: int
    first_name: str
    last_name: str
    url: str
    title: str
    delta: int


class TaskFactory(DbAPI):

    def get_tasks(self):
        res = [Task(**data) for data in self.get_new_tasks()]
        return res
