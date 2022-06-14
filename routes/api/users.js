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
  const user =User.findOne({username: req.body.username, password:req.body.password});

        console.log(req.body.username)
       

        if(!user){
            return res.status(404).json({
                msg:"User is not found",
                success:"false",
            });
        }


        //If there is user then check the password
           else if(req.body.password== user.password){
              
                            generateToken(user,200,res);
                   

            } else{
               return res.status(404).json({
                msg: "incorrect password",
                success: false
               });
              
            
            }
        
                
        
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