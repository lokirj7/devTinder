const mongoose = require('mongoose')

// Like Table Schema
const UserSchema = new mongoose.Schema ({
firstName:{
    type:String
},
lastName:{
    type:String,
},
emailId:{
    type:String,
    unique:true
},
password:{
    type:String
},
age:{
    type:Number
},
gender:{
    type:String
}
});

// ALways Collection Should Need To Be In Capital Start it's Like Table
const User = mongoose.model("Users",UserSchema);

module.exports = User
