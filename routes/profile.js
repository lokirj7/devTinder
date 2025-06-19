const express = require('express');
const profileRouter = express.Router()
const userAuth = require("../middlewares/auth");
const{ allowedFieldsToEdit } = require("../utils/validation");

// Profile View
profileRouter.get("/profile/view", async (req, res) => {
    try {
        const {user} = req
        if(!user){
            throw new Error("Noo Such User Found");
        }
        res.status(200).send(req.user); // Ensure JSON response
    } catch (error) {
        res.status(500).json({ error: error.message }); // Catch unexpected errors
    }
});

// Profile Edit
profileRouter.patch("/profile/edit", async (req, res) => {
    try {
        if (!allowedFieldsToEdit(req)) { 
            throw new Error("Some Not Allowed Keys were found");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((eachKey) => {
            loggedInUser[eachKey] = req.body[eachKey]; 
        });

        console.log(loggedInUser);

        res.json({
            message: "User Details Updated Successfully",
            data: loggedInUser,
        });

    } catch (err) {
        return res.status(400).send("Error: " + err.message); // ✅ Return after error response
    }
});




module.exports = profileRouter;