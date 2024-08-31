const router = require("express").Router();
const jwt = require("jsonwebtoken");

const activityController = require("../controllers/activityController")

router.post("/activities/multipletasks", async (req,res) => {
    const tasks = req.body.theData;

    let activities = []
    for (let i = 0; i < tasks.length; i++) {
        let activityTemp = await activityController.getAllActivities(tasks[i]["task_id"]);
        activities.push(activityTemp.rows);
    }
    
    res.send(activities);
});

module.exports = router;