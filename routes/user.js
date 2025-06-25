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
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        // Ensure limit does not exceed 50
        limit = Math.min(limit, 50);   
        const skip = (page - 1) * limit;
        // Validate pagination parameters
        if (page < 1 || limit < 1) {    
            return res.status(400).json({ error: "Invalid pagination parameters" });
        }   
      
        // Fetching all connection request for logged in user
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        })

        // User Has to be hide from the feed has been pushed to hiddenUserIds
        const hiddenUserIds = new Set();
        connectionRequests.forEach(request => {
                hiddenUserIds.add(request.fromUserId.toString());
                hiddenUserIds.add(request.toUserId.toString());
        });

        // Fetching all users except the logged in user and hidden users
        const users = await User.find({
            _id: { $nin: [loggedInUser._id, ...Array.from(hiddenUserIds)] }
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.status(200).json({
            message: "Users fetched successfully",
            users: users
        })


    }catch(err){
        res.status(500).json({error: "Internal Server Error"});
    }
})