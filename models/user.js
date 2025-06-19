const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Like Table Schema
const UserSchema = new mongoose.Schema (
    {
firstName:{
    type:String,
    required:true,
    minLength:4,
    maxLength:50
},
lastName:{
    type:String,
},
emailId:{
    type:String,
    lowercase:true,
    required :true,
    unique:true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid Email Address");
        }
    }
},
password:{
    type:String
},
age:{
    type:Number
},
gender:{
    type:String,
    enum : {
        values: ["male","female","other"],
        message :`{VALUE} is not Valid Gender Type`
    }
},
skills:{
    type:[String]
}
},
{
    timestamps:true
}

);

// 1. jwt token sign creating token or cookie storing in brower
UserSchema.methods.getJWT = async function (){
const user = this ;
const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'2h'})

return token;
}



// 2. validating password from db
UserSchema.methods.validatePassword = async function (passwordInputByUser){
const user = this ;
const validatedUser = await bcrypt.compare(passwordInputByUser,user.password)
return validatedUser;

}
// ALways Collection Should Need To Be In Capital Start it's Like Table
const User = mongoose.model("Users",UserSchema);

module.exports = User
