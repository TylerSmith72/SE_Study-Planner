const router = require("express").Router();
const pool = require("../db");  
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const jwtGenerator = require("../utils/jwtGeneratior");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/auth");

let transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
      user: 'studyplanner123@outlook.com',
      pass: 'qwertyuiopasdfghjklmnbvcxz'
    }
  });


// Registering
router.post("/register", validInfo, async (req, res) => {
    //console.error("test"); //-- REMOVE
    try{
        //console.error("test0"); //-- REMOVE
        // Destructire the req.body
        const { username, firstname, surname, email, password, repeatpass } = req.body;

        // console.error("test1"); //-- REMOVE
        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        // console.error("test2"); //-- REMOVE
        if (user.rows.length !== 0){
            return res.status(401).json("User already exists!");
        }

        // Bcrypt password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        if (password != repeatpass){
            return res.status(401).json("Password is not the same!");
        }

        const bcryptPassword = await bcrypt.hash(password, salt);
        // console.error(bcryptPassword.length); -- REMOVE

        // Enter new user inside the database
        const newUser = await pool.query(
            "INSERT INTO users (username, first_name, surname, password, email, account_created) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) RETURNING *",
            [username, firstname, surname, bcryptPassword, email]
        );
        
        // Generate JWT token

        const token = jwtGenerator(newUser.rows[0].user_id);
        console.log(token)

        // Email the User
        let mailOptions = {
            from: 'studyplanner123@outlook.com',
            to: email,
            subject: 'Account Created Successfully',
            html: 
            `
            <h1>Welcome, ${firstname} ${surname}</h1>
            <p>Your account has been created successfully!</p>
            `
          };
  
          transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
              console.log(error);
            }
            else{
              console.log('Email Sent: ' + info.response);
            }
          });

        res.json({token});

    }catch(err){
        console.error(err.message);
        res.status(500).send("Sever Error: ");
    }
})


// Loggin in
router.post("/login", validInfo, async (req, res) => {
    try {
        
        // Destructure the req.body

        const {username, password} = req.body;

        // Check if user doesn't exist
        
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length === 0){
            return res.status(401).json("Username does not exist!");
        }

        // Check if the incoming passowrd is the sameasthe database password

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        console.log("Password value: " + validPassword);
        if(!validPassword){
            return res.status(401).json("Username or Password is incorrect!");

        }

        // Give them the JWT token

        const token = jwtGenerator(user.rows[0].user_id);

        res.json({token});


    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error: ");
    }
})

router.post("/verify", authorization, async (req, res) => {
    try {
      res.json(true);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  })


module.exports = router;