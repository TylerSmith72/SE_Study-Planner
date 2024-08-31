const pool = require("../db"); 

async function getUserSchedules(user_id) {
    const result = await pool.query(
        "SELECT schedule_id FROM schedules WHERE user_id_fkey = $1", [user_id]
      );
    
      return [result.rows]
}

async function getSummativesByScheduleId(schedule_id) {
    const result = await pool.query(
      "SELECT * FROM summatives WHERE schedule_id_fkey = $1", [schedule_id]
    );
  
    return [result.rows]
}

async function getTasksByScheduleId(schedule_id) {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE schedule_id_fkey = $1", [schedule_id]
    );
  
    return [result.rows]
}

module.exports = {
    getUserSchedules,
    getSummativesByScheduleId,
    getTasksByScheduleId
}