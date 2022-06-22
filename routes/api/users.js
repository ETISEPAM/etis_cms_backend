const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const bcrypt = require("bcrypt");
const { registerValidation } = require("../../utils/validation");
const { generateToken } = require("../../utils/tokenGen");
const checkAuth = require("./middleware/checkAuth");

/**
 * @route POST api/users/login
 * @des Signing in the admin
 * @access Public
 */
router.post("/", async (req, res) => {
    //Checking if the user exists
    const user = await User.findOne({ username: req.body.username });

    // Return User's ID on login
    const userID = user._id.toString();

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

//Add User
router.post("/registration", async (req, res) => {
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
    const newUser = new User({
        username,
        firstName,
        lastName,
        password,
        email,
    });

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

//List Users
router.get("/", async (req, res) => {
 
    const { page = 1, limit = 10 } = req.query;

    try {
      // execute query with page and limit values
      const users = await User.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
  
      // get total documents in the Posts collection 
      const count = await User.countDocuments();
  
      // return response with posts, total pages, and current page
      res.json({
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (err) {
      console.error(err.message);
    }
});

//UPDATE User
//TODO - CHECK params given in fromt +  CHECK LOGIC
router.patch(
    "/:username",
    /*checkAuth,*/ async (req, res) => {
        let query = {
            username: req.params.username,
            email: req.params.email,
        };
        await User.findOneAndUpdate(
            query,
            { username: req.body.username },
            (err, docs) => {
                if (err || !docs) {
                    return res.status(400).json({
                        msg: "User not Found",
                    });
                } else {
                    return res.status(200).json({
                        msg: "User Updated Successfully!",
                    });
                }
            }
        );
        /*
   Will be added to the query depending on the front form params (What can be updated on front?)
        |___{firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, username : req.body.username, role: req.body.role}
  */
    }
);

//DELETE User
router.delete(
    "/:username",
    /*checkAuth,*/ async (req, res) => {
        let query = {
            username: req.params.username,
        };
        await User.findOneAndDelete(query, (err, docs) => {
            if (err || !docs) {
                return res.status(400).json({
                    msg: "User not Found",
                });
            } else {
                return res.status(200).json({
                    msg: "User Deleted Successfully!",
                });
            }
        });
    }
);

module.exports = router;
