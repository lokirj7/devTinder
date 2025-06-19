const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type : String,
        enum : {
            values:["interested","ignored","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        },
        required:true
    }

},{
    timestamps : true
})


// Creating Index
connectionRequestSchema.index({fromUserId : 1, toUserId : 1})


connectionRequestSchema.pre("save",function (){
    const connectionRequest = this;

    // Check From User Id is same as to user id
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You Cannot Give Request to Same User")
    }
    next();
})
const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema)
module.exports = ConnectionRequestModel