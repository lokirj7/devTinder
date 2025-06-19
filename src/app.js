const express = require('express')
require('dotenv').config(); // Load environment variables
// console.log(process.env.JWT_SECRET,"da");


const cookieParser = require('cookie-parser');

// connection Happens in DB
const connectDB = require('../config/database');
const authRouter = require('../routes/auth');
const profileRouter = require('../routes/profile');
const connectionRequest = require("../routes/request")
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",connectionRequest)


connectDB()
.then(()=>{
    console.log("DataBase Connected Successfully");
    app.listen(7777,()=>{
    console.log("Server Started Successfully listening on the port 7777")
    })
})
.catch((err)=>{
    console.log(err);
    console.error("Db Not Connected Due To SOme Issues");
})

