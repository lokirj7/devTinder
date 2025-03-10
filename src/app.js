const express = require('express')
const bcrypt = require('bcrypt');
const connectDB = require('../config/database')
const User = require('../models/user')
const app = express()
const {validateSignUpData} = require('../utils/validation'); 
app.use(express.json())

app.post('/signup',async (req,res)=>{
    try{
    // 1. Validation 
    validateSignUpData(req);
    const {firstName ,lastName,emailId,password}= req.body;

    // 2. Encryption
    const passwordHash = await bcrypt.hash(password,10);

    // 3.Creating instance in db (Saving in db)
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash
    })
        await user.save();
        res.send("User Created Successfully In Db")
    }catch(err){
        res.status(400).send(err)
    }
})

// When trying to login
app.post("/login",async(req,res)=>{
    try{
        const {emailId,password} = req.body
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Emailid not present in db");
        }else{
            const isPasswordValid = await bcrypt.compare(password,user.password);
            if(isPasswordValid){
                res.send("Login Successfully");
            }else{
                throw new Error("Invalid Credentials")
            }
        }
    }catch(err){
        res.status(400).send("Error :" +err.message);
    }
})

//  Payload To Fetch All The Users
app.get("/allusers",async (req,res)=>{
    try{
        const allusers = await User.find({})
        res.send(allusers)
    }catch(err){
        res.status(501).send("No Data Error")
    }
})

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