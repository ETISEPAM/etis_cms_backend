const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const bcrypt = require("bcrypt");
const { registerValidation } = require("../../utils/validation");
const { generateToken } = require("../../utils/tokenGen");
const checkAuth = require("../api/middleware/check-auth");

/**
 * @route POST api/users/login
 * @des Signing in the admin
 * @access Public
 */
router.post("/", async (req, res) => {
  //Checking if the user exists
  const user = await User.findOne({ username: req.body.username });
  if (!user)
    return res.status(404).json({
      msg: "User Not Found",
      success: "false",
    });
  //checks pw
  bcrypt.compare(req.body.password, user.password).then((isMatch) => {
    if (isMatch) {
      generateToken(user, 201, res);
      
    } else {
      return res.status(403).json({
        msg: "Incorrect Password",
        success: false,
      });
    }
  });
});

/**
 * @route POST api/users/register
 * @des Signing up the admin

router.post("/registration", async (req, res) => {
 * @access Private
 */


//restrict the route with token verify
router.post("/register", checkAuth, async (req, res) => {


  // validate the data before creating an user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(409).send("Email Already Exists");

  let { username, firstName, lastName, password, email } = req.body;

  // Check if this user already exisits
  let user = await User.findOne({ username: username }).then((user) => {
    if (user) {
      return res.status(409).json({
        msg: "Username is Already Taken",
      });
    }
  });
  const newUser = new User({username, firstName, lastName, password, email });

  //Password Hashing
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      //Add New User
      if (err) throw err;
      newUser.password = hash;
      newUser.save().then((user) => {
        return res.status(201).json({
          newUser,
          success: true,
          msg: "User Successfully Added!",
        });
      });
    });
  });
});


module.exports = router;
