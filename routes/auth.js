const jwt = require('jsonwebtoken');
const {validateSignUpData} = require('../utils/validation'); 
const {userAuth} = require("../middlewares/auth");
const bcrypt = require('bcrypt');
const User = require('../models/user')

const express = require("express");
const authRouter = express.Router()

// signup the user (new user Creation in db)
authRouter.post('/signup',async (req,res)=>{
    console.log("daf");
    
    try{
    // 1. Validation 
    validateSignUpData(req);
    console.log("demo");
    
    const {firstName ,lastName,emailId,password} = req.body;

    // 2. Encryption(password hashing happens here to store password not in plain text)
    const passwordHash = await bcrypt.hash(password,10);

    // 3.Creating instance in db (New User Creation In Db)
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
authRouter.post("/login",async(req,res)=>{

    try{
        const {emailId,password} = req.body
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Crenditials");
        }else{
            const isPasswordValid = await user.validatePassword(password);

            // 1. Creating jwt token

            // 2. Adding it to cookies sending back to browser
            if(isPasswordValid){
                //  if Password is valid creating jwt token storing in browser for 
                //  reducing repeated login
                
                const token = await user.getJWT()
                res.cookie('token',token,{expiresIn:'2h'});
                res.send("Login Successfully");
            }else{
                throw new Error("Invalid Crenditials");
            }
        }
    }catch(err){
        res.status(400).send("Error :" +err.message);
    }
})

// logout the user
authRouter.post("/logout",(req,res)=>{
        res.cookie("token",null,{
            expires:new Date(Date.now())
        })
        .send("User Logged Out Successfully")
        console.log("For Logged user checking");
})

// forgot password


module.exports  = authRouter
