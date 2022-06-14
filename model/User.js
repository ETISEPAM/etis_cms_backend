const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create the user model
const UserSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    firstName: String,
    lastName: String,
    firstLogin: {
        type: Boolean,
    },
    profileImage: {
        imgSrc: String,
        maxImgWidth: Number,
        maxImgHeighT: Number,
    },
    userBio: String,
    userContentType: Array,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = User =mongoose.model('users',UserSchema);
