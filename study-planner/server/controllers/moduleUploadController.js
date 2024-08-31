const pool = require("../db"); 

async function isSmLinkUnique(moduleID, scheduleId){
  const result = await pool.query(
    "SELECT EXISTS (SELECT 1 FROM sm_links WHERE module_code_fkey = $1 AND schedule_id_fkey = $2)",
    [moduleID, scheduleId]
  );
  return result.rows[0].exists;
}

async function isModuleUnique(moduleID) {
  const result = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM modules WHERE module_code = $1)",
    [moduleID]
  );
  return result.rows[0].exists;
}

async function isSummativeUnique(moduleID, scheduleId, summativeName){
  const result = await pool.query(
    "SELECT EXISTS (SELECT 1 FROM summatives WHERE module_code_fkey = $1 AND schedule_id_fkey = $2 AND summative_name = $3)",
    [moduleID, scheduleId, summativeName]
  );
  return result.rows[0].exists;
}

// Inserting modules
async function insertModules(moduleID, module_name, module_description, module_organiser, module_start_date, module_end_date, scheduleId){
  console.log("Modules:",  await isModuleUnique(moduleID))
  console.log("SM links:", await isSmLinkUnique(moduleID, scheduleId))

  if (await isModuleUnique(moduleID) == false) {
    try {

      await pool.query(
        "INSERT INTO modules (module_code, module_name, module_description, module_organiser, module_start_date, module_end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", 
        [moduleID, module_name, module_description, module_organiser, module_start_date, module_end_date]
      );
  
      console.log("Modules inserted successfully!")
    } catch (e) {
      console.log("Error with insering modules:", e);
    }
  } else {
    console.log("Modules alredy exits!")
  }

  if (await isSmLinkUnique(moduleID, scheduleId) == false) {
    try {
      await pool.query(
        "INSERT INTO sm_links (schedule_id_fkey ,module_code_fkey) VALUES ($1, $2) RETURNING *", [scheduleId ,moduleID]
      );
  
      console.log("SM links inserted successfully!")
    } catch (e) {
      console.log("Error on inserting schedule to module link:", e)
    }
  } else {
    console.log("SM links already exit!")
  }
}

async function checkScheduleExist(user_id){
  const result = await pool.query(
    "SELECT COUNT(schedule_name) FROM schedules WHERE user_id_fkey = $1", [user_id]
  );
  return result.rows[0].count === 0;
}

async function getSchedules(user_id){
  if (await checkScheduleExist(user_id) == false){
    const scheduleData = await pool.query(
      "SELECT schedule_name, schedule_id FROM schedules WHERE user_id_fkey = $1", [user_id]
    )


    return [scheduleData.rows];
  } else {
    return [0]
  }
}

async function insertSchedule(user_id, schedule_name){
  await pool.query(
    "INSERT INTO schedules (user_id_fkey, schedule_name) VALUES ($1, $2)", [user_id, schedule_name]
  );
}


// Inserting courseworks and exams
async function insertAllSummatives(module_code, name, type, summative_description, summative_set_date, summative_due_date, scheduleId){
  if (await isSummativeUnique(module_code, scheduleId, name) == false){
    try {
      await pool.query(
        "INSERT INTO summatives (module_code_fkey, summative_name, summative_type, summative_description, summative_set_date, summative_due_date, schedule_id_fkey) VALUES ($1, $2, $3, $4, $5, $6, $7)" 
        , [module_code, name, type, summative_description, summative_set_date, summative_due_date, scheduleId]
      );

      console.log("Summative added successfully!")
    } catch (e) {
      console.log("Error with inserting the summative:", e)
    }
  } else {
    console.log("Summative aleady exists!")
  }
}

module.exports = {
  insertModules,
  insertAllSummatives,
  getSchedules,
  insertSchedule
}