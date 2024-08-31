const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "password123",
    host: "192.168.0.245",
    port: 5432,
    database: "studyplanner"
})

module.exports = pool;