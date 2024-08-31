const router = require("express").Router();
const jwt = require("jsonwebtoken");

const moduleController = require("../controllers/moduleController")

// Retrieve nessessary data to add to the module page

router.get("/deadlines/:scheduleID", async (req,res) => {
    const scheduleId = req.url.split("/")[2];

    const [deadlineInfo] = await moduleController.getDeadlinesInfo(scheduleId);

    res.send(deadlineInfo);
});

router.get("/summatives/:moduleCode", async (req, res) => {
    const module_code = req.url.split("/")[2];
    const [summativesInfo] = await moduleController.getSummativesByModuleCode(module_code);
    res.send(summativesInfo);
});

router.get("/summativesWithSchedule/:moduleCode/:scheduleId", async (req, res) => {
    const module_code = req.url.split("/")[2];
    const schedule_id = req.url.split("/")[3];
    const [summativesInfo] = await moduleController.getSummativesByModuleCodeAndScheduleId(module_code, schedule_id);
    res.send(summativesInfo);
});

// router.post("/proreess", async (req,res) => {

// });

router.get("/modules/:scheduleID", async (req,res) => {
    const scheduleId = req.url.split("/")[2];
    const [modules] = await moduleController.getAllModulesInfo(scheduleId);
    //console.log(JSON.stringify(modules));
    res.send(modules);
});

module.exports = router;