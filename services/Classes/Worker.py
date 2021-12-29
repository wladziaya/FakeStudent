import time

from selenium.webdriver.common.by import By

from services.Classes.TaskFactory import Task
from selenium import webdriver


class Worker:
    MINUTE = 60

    def __init__(self, driver: webdriver.Remote, task: Task):

        self.driver: webdriver.Remote = driver
        self.task = task

    def join_conference(self):
        platform = self.choose_platform()
        if platform:
            platform()

    def choose_platform(self):
        if self.task.title == 'bbb':
            return self.enter_bbb
        else:
            return False

    def enter_bbb(self):
        self.driver.get(self.task.url)

        input_field = self.driver.find_element(By.CLASS_NAME, 'form-control join-form')
        input_field.send_keys(self.task.first_name+self.task.last_name)

        join_button = self.driver.find_element(By.ID, 'room-join')
        join_button.click()

        time.sleep(self.MINUTE*100)
