const validator = require("validator");

const validateSignUpData = async(req,res)=>{
    
const {firstName , lastName , emailId , password } = req.body;
if(!firstName || !lastName){
    throw new Error("Name is not valid");
}
else if(!validator.isEmail(emailId)){
    throw new Error("Email is not Valid");
    
}else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not strong");
}

}
const allowedFieldsToEdit = (req)=>{
const allowedFields = ["age","skills","firstName"];
const isAllowed = Object.keys(req.body).every((field) => allowedFields.includes(field));
 return isAllowed;

}
module.exports = { validateSignUpData,allowedFieldsToEdit}