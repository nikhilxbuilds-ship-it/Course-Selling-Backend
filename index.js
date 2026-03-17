const express = require("express");
const app = express();
const { userRouter } = require("./routes/user.js")
const { courseRouter } = require('./routes/course.js')
const mongoose = require("mongoose");
const { config } = require("dotenv");
require("dotenv").config();
mongoose.connect(process.env.MONGOOSE_URL)
app.use(express.json());
// users routes
app.use("/users", userRouter);

// courses routes
//app.use("/course", courseRouter)

// admin routes
app.use("/admin", adminRouter);

app.listen(process.env.PORT, ()=>{
    console.log(`Listening at port ${process.env.PORT}`)
})