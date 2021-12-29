import traceback
from datetime import datetime
import time
from random import shuffle
import gc
from pprint import pprint

from Classes.TaskFactory import TaskFactory
from Classes.Thread import MainThread, LIST_PROCESSING_TASKS, LIST_PROCESSING_DRIVER

# === Распределение задач и запуск потоков ===


def quit_drivers():
    print('START KILLING DRIVER')
    print('WAIT')

    """функция закрытия драйверов и дропа контейнеров"""
    try:
        """проходим по списку запущенных драйверов и выходим из них"""
        for driver in LIST_PROCESSING_DRIVER:

            try:
                driver.quit()
            except Exception:
                pass
            else:
                print("DRIVER QUIT")

        """
        как запасной вариант проходим по всем экземплярам класса MainThread
        и вызываем их метод closeDriver
        """

        for obj in gc.get_objects():
            if isinstance(obj, MainThread):
                try:
                    obj.close_driver()
                    obj.cancel_task_execution()
                except Exception as e:
                    pass
                else:
                    print("DRIVER QUIT")
    except Exception:
        pass


def create_threads():
    """функция распределения задач"""

    while True:
        task_maker = TaskFactory()
        tasks = task_maker.get_tasks()
        print('GET TASK')
        if len(tasks) == 0:
            print('Zero Task')

            for task in tasks:
                try:
                    my_thread = MainThread(task)
                    my_thread.setDaemon(True)
                    my_thread.start()
                    time.sleep(3)

                except Exception as ex:
                    print('exception when make threads - ', ex)

        time.sleep(600)


if __name__ == '__main__':
    THREADS = 10

    try:
        create_threads()
    except KeyboardInterrupt as ki:
        quit_drivers()
        time.sleep(3)
        exit()
    except Exception:
        print(traceback.format_exc())
        quit_drivers()
        time.sleep(2)

