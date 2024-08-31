const db = require("../db");

const insert = "INSERT INTO users (first_name, surname, username, password, email, is_email_verified, account_created) VALUES ('Tyler','Charman-Smith', 'Tyler.Smith_72', 'testing123', 'randomEmail@mail.com', false, CURRENT_DATE)";

db.query(insert, function (err, result) {
    if (err) throw err;
    console.log("User inserted")
});