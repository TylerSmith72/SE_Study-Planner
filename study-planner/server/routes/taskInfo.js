const router = require("express").Router();
const jwt = require("jsonwebtoken");

const taskController = require("../controllers/taskController")

router.get("/tasks/:scheduleID", async (req,res) => {
    const scheduleId = req.url.split("/")[2];

    const [tasks] = await taskController.getTasksFromSchedule(scheduleId);
    
    res.send(tasks);
});

module.exports = router;