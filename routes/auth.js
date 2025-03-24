const jwt = require('jsonwebtoken');
const {validateSignUpData} = require('../utils/validation'); 
const {userAuth} = require("../middlewares/auth");
const bcrypt = require('bcrypt');
const User = require('../models/user')

const express = require("express");
const authRouter = express.Router

authRouter.post('/signup',async (req,res)=>{
    console.log("daf");
    
    try{
    // 1. Validation 
    validateSignUpData(req);
    console.log("demo");
    
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
authRouter.post("/login",async(req,res)=>{

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


module.exports  = authRouter
