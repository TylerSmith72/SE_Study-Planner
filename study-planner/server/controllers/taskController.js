const pool = require("../db"); 

async function insertTask(name, schedule_id, summative_id, type, time, date, description) {
    try {
        await pool.query(
            "INSERT INTO tasks(task_name, schedule_id_fkey, summative_id_fkey, task_type, task_amount, task_due_date, task_description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [name, schedule_id, summative_id, type, time, date, description]
        )
    }
    catch(err) {
        console.error(err.message);
    }
}

async function getTasksFromSchedule(schedule_id) {
    try {
        const tasks = await pool.query("SELECT * FROM tasks WHERE schedule_id_fkey = $1", [schedule_id]);
        return [tasks.rows];
    }
    catch(err) {
        console.error(err.message);
    }
}

module.exports = {
    insertTask,
    getTasksFromSchedule
}