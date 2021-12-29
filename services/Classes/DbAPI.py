import logging
import traceback

from services.utils.SqlGenerator import SqlGenerator
import mysql.connector

from services.config import db_config

logging.basicConfig(filename='app.log', format='%(asctime)s - %(levelname)s - %(message)s')


class DbAPI(SqlGenerator):

    @staticmethod
    def __init_mysql_connection():
        cnx = mysql.connector.connect(**db_config)
        cursor = cnx.cursor(dictionary=True)
        return cursor, cnx

    def __execute_mysql_query(self, query, commit=False):
        cursor, cnx = self.__init_mysql_connection()
        select_result = []

        try:
            cursor.execute(query)
        except Exception:
            print('ERROR in __execute_mysql_query ', traceback.format_exc(), '\n ', query)
            logging.exception(traceback.format_exc())

        else:
            if commit:
                cnx.commit()
            else:
                select_result = cursor.fetchall()
        finally:
            cursor.close()
            cnx.close()

        return select_result

    def get_new_tasks(self):
        query = self.get_new_tasks_select()
        query_results = self.__execute_mysql_query(query)

        return query_results

    def update_task_dttm(self):
        query = self.get_task_check_dttm_update()
        self.__execute_mysql_query(query)

    def insert_record_test(self):
        pass

    def insert_record_path(self):
        pass