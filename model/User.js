const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create the user model
const UserSchema = new Schema({
    username:{
        type:String,
        required:true
    },
  
    password:{
        type:String,
        required:true
    }
})

//get the token

   
module.exports = User =mongoose.model('users',UserSchema);
