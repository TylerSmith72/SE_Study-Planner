const express = require("express")
const app = express()
const cors = require("cors")

// middleware

app.use(express.json()) //req.body
app.use(cors())

// Routes
app.use("/authentication", require("./routes/jwtAuth"));
app.use("/submitFile", require("./routes/fileAuth"));
app.use("/otherForm", require("./routes/otherForm"));
app.use("/dashboard", require("./routes/moduleInfo"));
app.use("/taskinfo", require("./routes/taskInfo"));
app.use("/activityinfo", require("./routes/activityInfo"));
app.use("/studycallender", require("./routes/caldender"));


app.listen(4000, () => {
    console.log("Server is running onport 4000.");
})