const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const bcrypt = require("bcrypt");
const { registerValidation } = require("../../utils/validation");
const { generateToken } = require("../../utils/tokenGen");
const { getUserID } = require("../../utils/getUserID");
const checkAuth = require("./middleware/checkAuth");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

//Login User
router.post("/", async (req, res) => {
    //Checking if the user exists
    const user = await User.findOne({ username: req.body.username });

    if (!user)
        return res.status(404).json({
            msg: "User Not Found",
            success: "false",
        });
    //Decrypt and check password Match
    bcrypt.compare(req.body.password, user.password).then((isMatch) => {
        if (isMatch) {
            getUserID(user, res);
            generateToken(user, 200, res);
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

    // execute query with page and limit values
    const users = await User.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    // get total documents in the Posts collection
    const count = User.countDocuments();

    // return response with posts, total pages, and current page
    res.json({
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    });
});

//READ Specific User with ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    User.findById(id).exec((err, user) => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({
                ERR: err.name,
                ERR_MSG: err.message,
            });
        }
    });
});

//UPDATE User
router.patch(
    "/:id",
    /*checkAuth,*/ async (req, res) => {
        const id = req.cookies.userID;
        //hash the password for update
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        User.findByIdAndUpdate(
            id,
            {
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashPassword,
            },

            { new: true },
            (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        msg: "User not Found",
                    });
                } else {
                    return res.status(200).json({
                        user,
                        msg: "User Updated Successfully!",
                    });
                }
            }
        );
    }
);

//DELETE User
router.delete(
    "/:id",
    /*checkAuth,*/ (req, res) => {
        User.findByIdAndDelete(req.params.id, (err, users) => {
            if (err || !users) {
                return res.status(400).json({
                    msg: "User not Found",
                });
            } else {
                return res.status(204).json({
                    msg: "User Deleted Successfully!",
                });
            }
        });
    }
);

//Get the content type with specific id
router.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: "Not found user with id" + id,
                });
            } else res.send(data);
        })
        .catch((err) => {
            res.status(500).send(
                { message: "Error while retrieving the user with id" } + id
            );
        });
});

module.exports = router;
