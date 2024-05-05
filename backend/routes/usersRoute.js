const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// user registration

router.post("/register", async (req, res) => {
    try {
        // check if user already exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
          return res
            .status(200)
            .send({ message: "User already exists", success: false });
        }
    
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
    
        // create new user
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            message: "User created successfully",
            success: true,
        });
        } catch (error) {
            res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        });
    }
});



// Export the router
module.exports = router;
