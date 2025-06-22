const express = require("express")
const requestRouter = express.Router()

const {userAuth}= require("../middlewares/auth")
const connectionRequestSchema = require("../models/connectionRequest")



//  Connectoin Request Sending Route
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const connectionRequest = new connectionRequestSchema({
            fromUserId,
            toUserId,
            status
        })
        const allowedStatus = ["interested,ignored"]
        if(!allowedStatus.includes(status)){
            return res.status(400).send(status+" Not Allowed Status")
             
        }

        // Checks Connection toRequest User Already Exists in Database
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:"User Not Found"})
        }

        const existingConnectionRequest = await connectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ]
        })
        if(existingConnectionRequest){
            return res
                .status(400)
                .send({message:"connection request already existis!!"})
        }

        const data = await connectionRequest.save()

        res.json({
            message :"connection Request sent successfully",
            data,
        })

    }catch(err){
        res.status(401).send("ERROR" +err.message)
    }
  


})


module.exports = requestRouter