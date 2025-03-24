const express = require('express');
const profileRouter = express.Router

profileRouter.get("/profile",userAuth, async (req, res) => {
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

module.exports = profileRouter;