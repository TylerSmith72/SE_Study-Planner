const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function(req, res, next) {
    try {

        // Destructure the token
        const jwtToken = req.header("token");

        if (!jwtToken) {
            return res.status(403).json("Not Authorize no token");
        }

        // Check if token is verified
        const verify = jwt.verify(jwtToken, process.env.jwtSecret);
        req.user = verify.user; // user_ID
        next();
        
    } catch (err) {
        console.log(err.message);
        return res.status(403).json("Not Authorize");
    }
}