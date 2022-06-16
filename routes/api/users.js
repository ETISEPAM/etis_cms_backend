const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const bcrypt = require("bcrypt");
const { registerValidation } = require("../../utils/validation");
const { generateToken } = require("../../utils/tokenGen");

/**
 * @route POST api/users/login
 * @des Signing in the admin
 * @access Public
 */
router.post("/login", async (req, res) => {
  //Checking if the user exists
  const user = await User.findOne({ username: req.body.username });
  if (!user)
    return res.status(400).json({
      msg: "User not found",
      success: "false",
    });
  //checks pw
  bcrypt.compare(req.body.password, user.password).then((isMatch) => {
    if (isMatch) {
      generateToken(user, 200, res);
    } else {
      return res.status(404).json({
        msg: "incorrect password",
        success: false,
      });
    }
  });
});

/**
 * @route POST api/users/register
 * @des Signing up the admin
 * @access Public
 */

router.post("/register", async (req, res) => {
  // validate the data before creating an user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exist");

  let { username, firstName, lastName, password, email } = req.body;

  // Check if this user already exisits
  let user = await User.findOne({ username: username }).then((user) => {
    if (user) {
      return res.status(400).json({
        msg: "username is already taken",
      });
    }
  });
  //Adding the user
  const newUser = new User({
    username,
    firstName,
    lastName,
    password,
    email,
  });

  //hash the password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      //register new user

      if (err) throw err;
      newUser.password = hash;
      newUser.save().then((user) => {
        return res.status(201).json({
          newUser,
          success: true,
          msg: "User registred successfully",
        });
      });
    });
  });
});

module.exports = router;
