const router = require("express").Router();
const jwt = require("jsonwebtoken");

const calenderController = require("../controllers/calenderController");

router.get("/getSummatives", async (req,res) => {
    let summativeInfo = []
    const token = req.headers.authorization;  // Ensure req.token is correctly set

    const verify = jwt.verify(token, process.env.jwtSecret);
    const user_id = verify.user;

    const [scheduleIDs] = await calenderController.getUserSchedules(user_id);

    for (const scheduleID in scheduleIDs) {
        const [summative] = await calenderController.getSummativesByScheduleId(scheduleIDs[scheduleID].schedule_id)
        for (const summ in summative){
            summativeInfo.push(summative[summ])
        }
    }
    res.send(summativeInfo);
})

router.get("/getTasks", async (req,res) => {
    let taskInfo = []
    const token = req.headers.authorization;  // Ensure req.token is correctly set

    const verify = jwt.verify(token, process.env.jwtSecret);
    const user_id = verify.user;

    const [scheduleIDs] = await calenderController.getUserSchedules(user_id);

    for (const scheduleID in scheduleIDs) {
        const [tasks] = await calenderController.getTasksByScheduleId(scheduleIDs[scheduleID].schedule_id)
        console.log(tasks)
        for (const summ in tasks){
            taskInfo.push(tasks[summ])
        }
    }

    res.send(taskInfo);
})

module.exports = router;



