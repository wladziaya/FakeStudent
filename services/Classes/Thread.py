import logging
import logging
import time
import traceback
from copy import deepcopy
from threading import Thread

from selenium import webdriver
from selenium.webdriver.firefox.options import Options

from services.Classes.DbAPI import DbAPI
from services.Classes.Worker import Worker
from services.config import capabilities, address_remote_driver

logging.basicConfig(filename='app.log', format='%(asctime)s - %(levelname)s - %(message)s')

LIST_PROCESSING_TASKS = []
LIST_PROCESSING_DRIVER = []


class MainThread(Thread, DbAPI):

    def __init__(self, task):
        """Инициализация потока"""
        Thread.__init__(self)
        DbAPI.__init__(self)

        LIST_PROCESSING_TASKS.append(self.task.id)

        self.task = task
        self.user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
        self.driver = webdriver.Remote

    def run(self) -> None:
        try:
            self.runner()
        except Exception:
            print('ERROR IN THREAD RUN CHECK _ LOGS')
            logging.exception(traceback.format_exc())

            self.close_driver()
            self.cancel_task_execution()

        finally:
            self.cancel_task_execution()
            self.close_driver()

    def runner(self):

        fp = webdriver.FirefoxProfile()
        fp.set_preference("general.useragent.override", self.user_agent)
        cap = deepcopy(capabilities)

        options = Options()
        options.headless = False
        options.set_preference("dom.webdriver.enabled", False)
        options.set_preference('useAutomationExtension', False)
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.preferences.update({"javascript.enabled": True})

        cap['name'] = f'StudentTask#_{self.task.id}'
        capabilities['browserVersion'] = "89.0"
        capabilities['sessionTimeout'] = "20m"
        options.set_capability("browserVersion", "89.0")

        self.driver = webdriver.Remote(command_executor=address_remote_driver,
                                       desired_capabilities=cap,
                                       browser_profile=fp,
                                       options=options)

        if self.driver:
            worker = Worker(self.driver, self.task)
            worker.join_conference()

            self.close_driver()
            self.cancel_task_execution()

    def close_driver(self):
        try:
            self.driver.quit()
            LIST_PROCESSING_DRIVER.pop(LIST_PROCESSING_DRIVER.index(self.driver))
        except Exception as e:
            pass
        finally:
            time.sleep(1)

    def cancel_task_execution(self):
        try:
            LIST_PROCESSING_TASKS.pop(LIST_PROCESSING_TASKS.index(self.task['id']))
        except Exception:
            pass
        finally:
            time.sleep(1)

