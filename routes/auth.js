const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  // validate the data before creating an user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exist");

  //Hashing the password
  const salt = await bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

  //Creating new user from here
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser); // postmanda gönderilecek şeyleri burada değişterebilirim res.send({user:user._id}) gibi
  } catch (err) {
    res.status(400).send(err);
  }
});

//Login
router.post("/", async (req, res) => {
  //validate the data before creating an user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the user exists
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Username is not found");

  //Checking if the email exists

  const emailExist = await User.findOne({ email: req.body.email });
  if (!emailExist) return res.status(400).send("email is not found");

  //Password is Correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Password is invalid");

  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
  //   res.send("Logged in!");
});

module.exports = router;
