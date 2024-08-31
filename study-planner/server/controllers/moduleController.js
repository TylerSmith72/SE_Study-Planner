const pool = require("../db");

// Get all the information for dealines
async function getDeadlinesInfo(scheduleID){
  const result = await pool.query (
    //" SELECT summative_name, summative_type, summative_set_date, summative_due_date FROM summatives WHERE schedule_id_fkey = $1 ", [scheduleID]
    " SELECT * FROM summatives WHERE schedule_id_fkey = $1 ", [scheduleID]
  );

  return [result.rows];

}

//Get summatives by module code
async function getSummativesByModuleCode(module_code) {
  const result = await pool.query(
    "SELECT * FROM summatives WHERE module_code_fkey = $1", [module_code]
  );

  return [result.rows]
}

//Get summatives by module code and schedule ID
async function getSummativesByModuleCodeAndScheduleId(module_code, schedule_id) {
  const result = await pool.query(
    "SELECT * FROM summatives WHERE module_code_fkey = $1 AND schedule_id_fkey = $2", [module_code, schedule_id]
  );

  return [result.rows]
}

// Get all the information for displaying modules (at the bottom of the page)
async function getAllModulesInfo(Schedule_id) {
    const modulesInfo = await pool.query("SELECT * FROM modules WHERE module_code IN (SELECT module_code_fkey FROM sm_links WHERE schedule_id_fkey = $1)", [Schedule_id]);
    //console.log(modulesInfo.rows);
    
    return [modulesInfo.rows];
}

module.exports = {
  getDeadlinesInfo,
  getSummativesByModuleCode,
  getSummativesByModuleCodeAndScheduleId,
  getAllModulesInfo
}