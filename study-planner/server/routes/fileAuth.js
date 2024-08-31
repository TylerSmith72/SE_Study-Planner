const router = require("express").Router();
const moduleUploadController = require("../controllers/moduleUploadController")

const multer  = require('multer')
const upload = multer({dest: "uploads/"})
const fs = require('fs');
const jwt = require("jsonwebtoken");

// Check if file has been added                         // MIDDLEWARE //
// Check if file is extension (.json)                   // MIDDLEWARE //
// Fetch all modules from db for given user ID (ID stored in JWT Token)
// Parse file into parts
// Check if parsed module is in list of fetched modules
    // If not in fetched modules, add new module to list to be added later on (with all other new modules)


router.get("/getSchedule", async (req,res) => {
    const token = req.headers.authorization;  // Ensure req.token is correctly set

    const verify = jwt.verify(token, process.env.jwtSecret);
    const user_id = verify.user;

    const [scheduleData] = await moduleUploadController.getSchedules(user_id);

    res.send(scheduleData);
})

router.post("/insertSchedule", async (req, res) => {
    try {
        const { scheduleName } = req.body; // Correctly extract scheduleName
        const token = req.headers.authorization; // Ensure req.token is correctly set

        const verify = jwt.verify(token, process.env.jwtSecret);
        const user_id = verify.user;

        // Assuming moduleUploadController.insertSchedule returns a promise
        await moduleUploadController.insertSchedule(user_id, scheduleName);

        res.status(200).json({ message: "Schedule inserted successfully" });
    } catch (error) {
        console.error("Error inserting schedule:", error);
        res.status(500).json({ error: "Internal server error" });
    }

})

router.post("/upload", upload.single('file'), async (req,res) => {

    const file = req.file;
    const scheduleId = req.body.scheduleId;
    console.log(scheduleId);


    if(file){
        fs.readFile(file.path, 'utf8', async (err, data) => {
            if (err) {
                console.error('Error reading file: ', err);
                return;
            }

            // Parse JSON Data
            let parsedData = JSON.parse(data);

            for(const element of parsedData){
                let module_code = element.module_code;
                let module_name = element.module_name;
                let module_description = element.module_description;
                let module_organiser = element.module_organiser;
                let module_start_date = element.module_start_date;
                let module_end_date = element.module_end_date;

                // Insert module info into database and get the inserted ID
                await moduleUploadController.insertModules(module_code, module_name, module_description, module_organiser, module_start_date, module_end_date, scheduleId);

                let courseworks_exams = element.courseworks_exams;

                for(const element of courseworks_exams){
                    const name = element.summative_name;
                    const type = element.summative_type;
                    const summative_description = element.summative_description;
                    const summative_set_date = element.summative_set_date;
                    const summative_due_date = element.summative_due_date;

                    console.log(module_code);
                    await moduleUploadController.insertAllSummatives(module_code, name, type, summative_description, summative_set_date, summative_due_date, scheduleId);
                    
                }        
            }

            // Insert array of Tasks/Coursework into database

            console.log(data); // This will log the file contents to your console

            // Delete file once processed
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.error('Error deleting file: ', err);
                }
                console.log("Deleted File successfully.");
            });
        });

        res.send('File uploaded successfully');
    }
    else {
        console.log('No file uploaded');
        res.send('File failed to upload');
    }    
})

module.exports = router;