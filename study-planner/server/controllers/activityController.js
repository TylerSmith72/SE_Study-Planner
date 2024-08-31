const pool = require("../db"); 

async function insertActivity(name, task_id, time, description) {
    await pool.query(
        "INSERT INTO activities (activity_name, task_id_fkey, activity_amount, activity_description) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, task_id, time, description]
    );
}

async function getAllActivities(taskID) {
    const activities = await pool.query(
        "SELECT * FROM activities WHERE task_id_fkey = $1",
        [taskID]
    );

    return activities;
}

module.exports = {
    insertActivity,
    getAllActivities
}