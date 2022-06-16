const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the user model
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
<<<<<<< HEAD
    unique: true,
=======
    default: "user",
>>>>>>> feature/ec/validation
  },
  email: {
    type: String,
    required: true,
    unique: true,
<<<<<<< HEAD
=======
    default: "user@user.com",
>>>>>>> feature/ec/validation
  },
  password: {
    type: String,
    required: true,
  },
<<<<<<< HEAD
  firstName: String,
  lastName: String,
  firstLogin: {
    type: Boolean,
=======
  firstName: {
    type: String,
    required: true,
    default: "John",
  },
  lastName: {
    type: String,
    required: true,
    default: "Doe",
  },
  firstLogin: {
    type: Boolean,
    default: true,
>>>>>>> feature/ec/validation
  },
  profileImage: {
    imgSrc: String,
    maxImgWidth: Number,
<<<<<<< HEAD
    maxImgHeighT: Number,
  },
  userBio: String,
=======
    maxImgHeight: Number,
  },
  userBio: {
    type: String,
    default: "Bio",
  },
>>>>>>> feature/ec/validation
  //Connect ContentType to User
  //TODO: Check if used right.
  userContentType: [
    {
      type: Schema.ObjectId,
      ref: "ContentType",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
