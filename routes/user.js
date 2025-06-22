const express = require('express');
const userRouter = express.Router();

// logged in user details 
const {userAuth } = require('../middlewares/auth');

const ConnectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";




// Shows all users
userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;

        // Fetching all connection request for logged in user
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        })

        const hiddenUserIds = new Set();
        connectionRequests.forEach(request => {
                hiddenUserIds.add(request.fromUserId.toString());
                hiddenUserIds.add(request.toUserId.toString());
        });

        // Fetching all users except the logged in user and hidden users
        const users = await User.find({
            _id: { $nin: [loggedInUser._id, ...Array.from(hiddenUserIds)] }
        }).select(USER_SAFE_DATA);

        res.status(200).json({
            message: "Users fetched successfully",
            users: users
        })


    }catch(err){
        res.status(500).json({error: "Internal Server Error"});
    }
})