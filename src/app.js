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
app.use(express.json())
app.use(cookieParser())



app.get("/profile", async (req, res) => {
    try {
        console.log("data");
        const cookieToken = req.cookies
        const {token} = cookieToken;
        console.log(token, "cookieTokens");

        if (!token) {
            return res.status(401).json({ error: "Invalid Token" }); // Proper JSON response
        }

        // Decoding cookie
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decoded;
        
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: "No Such User Exists" }); // Proper JSON response
        }

        res.status(200).send(user); // Ensure JSON response
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
            const isPasswordValid = await bcrypt.compare(password,user.password);

            // 1. Creating jwt token

            // 2. Adding it to cookies sending back to browser
            if(isPasswordValid){
                
                const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
                res.cookie('token',token);
                res.send("Login Successfully");
            }else{
                throw new Error("Emailid not present in db");
            }
        }
    }catch(err){
        res.status(400).send("Error :" +err.message);
    }
})

// app.get("/allusers",async (req,res)=>{
//     try{
//         const allusers = await User.find({})
//         res.send(allusers)
//     }catch(err){
//         res.status(501).send("No Data Error")
//     }
// })

// Get Specific User
app.get("/user",async(req,res)=>{
    const userEmail = req.body.emailId
    try{
        const user = await User.findOne({emailId:userEmail})
        res.status(202).send(user)
    }catch(err){
        res.status(401).send(err)
    }

})

// delete user in db
// update user data
app.patch("/user",async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"after",runValidators:true});
    }catch(err){
        res.status(400).send("Update Failed");
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