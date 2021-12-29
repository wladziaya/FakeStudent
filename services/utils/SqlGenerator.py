class SqlGenerator:

    @staticmethod
    def get_new_tasks_select():
        sql = """
        select t.id, u.first_name, u.last_name, t.url, p.title, r.delta
        from task t
        left join `repeat` r
            on t.id = r.task_id
        left join platform p
            on t.id = p.task_id
        left join user u
            on t.user_id = u.id
        WHERE DATE(t.dttm)=CURDATE()
            and now()-t.dttm < 600;
            and status_id != 0
        """

        return sql

    @staticmethod
    def get_task_check_dttm_update():
        sql = """
        update task
        set dttm = now() 
        where id = %(id)s;
        """

        return sql
