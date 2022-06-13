const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User= require('../../model/User');
const key= require('../../config/keys').secret;
const bcrypt= require('bcryptjs');


/**
 * @route POST api/users/login
 * @des Signing in the admin
 * @access Public
 */
router.post('/login', (req,res)=>{
  const user =User.findOne({username: req.body.username, password:req.body.password});

    
        if(!user){
            return res.status(404).json({
                msg:"User is not found",
                success:"false",
            });
        }


        //If there is user then check the password
            if(req.body.password== user.password){
              
                            generateToken(user,200,res);
                   

            } else{
               return res.status(404).json({
                msg: "incorrect password",
                success: false
               });
              
            
            }
        
                
        
    });

const generateToken=async(user,statusCode,res)=>{
    const token = jwt.sign({_id:user.id},process.env.JWT_SECRET)

    const options={
        httpOnly: true
        
    }

    res.status(statusCode)
    .cookie('token',token,options)
    .json({ success:true,token})
        return token
    
           
}

module.exports=router;