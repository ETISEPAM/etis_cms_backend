const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User= require('../../model/User');
const dotenv = require('dotenv');
const bcrypt= require('bcryptjs');

//Import Config
dotenv.config({ path: "./config/config.env" });

const key = process.env.SECRET;
/**
 * @route POST api/users/login
 * @des Signing in the admin
 * @access Public
 */


router.get('/', (req, res) => {
    return res.send(req.body)
})

router.post('/', (req,res)=>{
  const user =User.findOne({username: req.body.username, password:req.body.password});
        if(!user){
            return res.status(404).json({
                msg:"User is not found",
                success:"false",
            });
        }
        //If there is user then check the password
            if(req.body.password== user.password){
                const payload={
                    __id: user.__id,
                    username: user.username,
                    password:user.password
                }
                jwt.sign(payload,key,
                    {expiresIn: 604800
                    }, (err,token)=>{
                            res.status(200).json({
                                success: true,
                                token: `Bearer ${token}`
                            })
                    })
            } else {
               return res.status(404).json({
                msg: "incorrect password",
                success: false
               });
              
            }
    });


module.exports=router;