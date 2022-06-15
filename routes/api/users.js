const express = require('express');
const router = express.Router();
const User= require('../../models/User');
const dotenv = require('dotenv');

//Import Config
dotenv.config({ path: "./config/config.env" });

// router.get('/', (req, res) => {
//     User.findOne({username: "admin"}).exec((err, user) => {
//         if(err) {
//             res.send("ERROR")
//         } else
//         res.json(user.username);
//         console.log(user.username);
//     });
// })


// router.post('/', (req, res) => { 
//     let newUser = new User();

//     newUser.username = req.body.username;
//     newUser.firstName = req.body.firstName;
//     newUser.lastName = req.body.lastName;
//     newUser.email = req.body.email;

//     newUser.save((err, user) =>{
//         if (err) {
//             res.send(err.body);
//         } else {
//             console.log(user)
//             res.send(User)
//         }
//     })
// })

module.exports=router;