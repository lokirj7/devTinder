
const jwt = require('jsonwebtoken');
const User = require("../models/user")
const userAuth = async (req,res,next)=>{
    console.log("data");
    const cookieToken = req.cookies
    const {token} = cookieToken;
    console.log(token, "cookieTokens");

    if (!token) {
        return res.status(401).json({ error: "Invalid Token" }); // Proper JSON response
    }

    // Decoding cookie
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;
    
    const user = await User.findById(_id);
    if (!user) {
        return res.status(404).json({ error: "No Such User Exists" }); // Proper JSON response
    }
    req.user = user
    next();
}

module.exports = {userAuth}