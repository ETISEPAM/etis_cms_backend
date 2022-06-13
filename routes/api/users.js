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

            } else{
               return res.status(404).json({
                msg: "incorrect password",
                success: false
               });
              
            
            }
        
                
        
    });


module.exports=router;