const express = require('express')
require('dotenv').config(); // Load environment variables
// console.log(process.env.JWT_SECRET,"da");

const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const connectDB = require('../config/database')
const User = require('../models/user')
const app = express()
const jwt = require('jsonwebtoken');
const {validateSignUpData} = require('../utils/validation'); 
const {userAuth} = require("../middlewares/auth");
app.use(express.json())
app.use(cookieParser())



app.get("/profile",userAuth, async (req, res) => {
    try {
        const {user} = req
        if(!user){
            throw new Error("Noo Such User Found");
        }
        res.status(200).send(req.user); // Ensure JSON response
    } catch (error) {
        res.status(500).json({ error: error.message }); // Catch unexpected errors
    }
});


// When trying to login
app.post("/login",async(req,res)=>{

    try{
        const {emailId,password} = req.body
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Emailid not present in db");
        }else{
            const isPasswordValid = await user.validatePassword(password);

            // 1. Creating jwt token

            // 2. Adding it to cookies sending back to browser
            if(isPasswordValid){
                
                const token = await user.getJWT()
                res.cookie('token',token,{expiresIn:'2h'});
                res.send("Login Successfully");
            }else{
                throw new Error("Emailid not present in db");
            }
        }
    }catch(err){
        res.status(400).send("Error :" +err.message);
    }
})

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