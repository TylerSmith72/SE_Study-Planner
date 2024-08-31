const router = require("express").Router();
const taskController = require("../controllers/taskController");
const activityController = require("../controllers/activityController");
const jwt = require("jsonwebtoken");

router.post("/addtask", async (req, res) => {
    const {name, schedule, assessment, type, time, date, description} = req.body;
    taskController.insertTask(name, schedule, assessment, type, time, date, description);
})

router.post("/addactivity", async (req, res) => {
    const {name, task, time, description} = req.body;
    console.log(task);
    activityController.insertActivity(name, task, time, description);
})

module.exports = router;