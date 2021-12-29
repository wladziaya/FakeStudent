import unittest
from services.Classes.DbAPI import DbAPI


class MyTestCase(unittest.TestCase):
    def test_db_grab_tasks(self):
        db = DbAPI()
        try:
            db.get_new_tasks()
        except Exception as e:
            self.fail("get_new_tasks() raised Exception unexpectedly!")


if __name__ == '__main__':
    unittest.main()
