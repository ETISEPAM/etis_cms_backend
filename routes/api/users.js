const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User= require('../../model/User');
const bcrypt= require('bcrypt');
const salt = require('salt');

/**
 * @route POST api/users/login
 * @des Signing in the admin
 * @access Public
 */
router.post('/login', (req,res)=>{
  User.findOne({username: req.body.username}).then(user=>{
    if(!user){
        return res.status(404).json({
            msg:"User is not found",
            success:"false",
        });
    }
//compare the passwords, if they match call generateToken func and send token 
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
        if(isMatch){
            generateToken(user,200,res);


        }
        else{
            return res.status(404).json({
             msg: "incorrect password",
             success: false
            });
           
         
         }
    })
  })

       

       


       
        
    });

/**
 * @route POST api/users/register
 * @des Signing up the admin
 * @access Public
 */




router.post('/register', async (req,res)=>{
let{
username,
password
}=req.body

    
// Check if this user already exisits
let user = await User.findOne({username:username}).then(user=>{
    if (user) {
        return res.status(400).json({
            msg:"username is already taken"
    });

}
})
 const newUser = new User({
    username,
    password
})

    //hash the password 
    bcrypt.genSalt(10, (err,salt)=>{
    bcrypt.hash(newUser.password, salt,(err,hash)=>{
        //register new user 
   
        if(err) throw err;
        newUser.password= hash;
        newUser.save().then(user=>{
            return res.status(201).json({
                success:true,
                msg:"User registred successfully"
            })
        })
    })
})

   
    
  
});










//configure httponly cookie with the token
const generateToken=async(user,statusCode,res)=>{
    const token = jwt.sign({_id:user.id},process.env.JWT_SECRET)

    const options={
        httpOnly: true
        
    }

    res.status(statusCode)
    .cookie('token',token,options)
    .json({ success:true /*token*/})
        return token
    
           
}

module.exports=router;