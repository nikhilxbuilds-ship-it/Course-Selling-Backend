const express = require("express");
const app = express();
const { userRouter } = require("./routes/user")
const { courseRouter } = require('./routes/course')
const { config } = require("dotenv");
require("dotenv").config();

// users routes
app.use("/users", userRouter);
app.use("/course", courseRouter)

// admin routes
app.use("/admin", adminRouter);

app.listen(process.env.PORT, ()=>{
    console.log(`Listening at port ${process.env.PORT}`)
})