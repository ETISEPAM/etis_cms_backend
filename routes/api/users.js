const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User= require('../../model/User');
const { estimatedDocumentCount } = require('../../model/User');
const key= require('../../config/keys').secret;

/**
 * @route POST api/users/login
 * @des Signing in the admin
 * @access Public
 */
router.post('/login', (req,res)=>{
    User.findOne({username: req.body.username}).then(user => {
        if(!user){
            return res.status(404).json({
                msg:"User is not found",
                success:"false"
            });
        }
        //If there is user then check the password
        bcrypt.compare(req.body.password, user.password).then(isMatch=>{
            if(isMatch){
                //Users password is correct, send the json token
                const payload = {
                    _id:user._id,
                    username: user.username
                 
                }
                jwt.sign(payload, key, {expiresIn: 604800
                }, (err, token) => {
                    res.status(200).json({
                        success:true,
                        token: `Bearer ${token}`,
                        msg:"You are now logged in"
                    })
                }) 

            }else{
                return res.status(404).json({
                    msg:"Incorrect password."
                })
            }
        })
    })
})
module.exports=router;