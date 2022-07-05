const express = require("express");
const router = express.Router();
const ContentType = require("../../model/ContentType");
const Fields = require("../../model/Field");
const checkAuth = require("./middleware/checkAuth");

const cookieParser = require("cookie-parser");

router.use(cookieParser());

//CREATE New Content Type
router.post("/", async (req, res) => {
    let { name, description } = req.body;
    let userID = req.cookies.userID;

    await ContentType.findOne({ name: name }).then((contentType) => {
        if (contentType) {
            return res.status(409).json({
                msg: "Content Type Already Exists!",
            });
        } else {
            const newContentType = new ContentType({
                name: req.body.name,
                description: req.body.description,
                ownerInfo: userID,
            });
            newContentType.save().then(() => {
                return res.status(201).json({
                    success: true,
                    msg: "Content Type Created Successfully",
                    newContent: newContentType,
                });
            });
        }
    });
});

//READ All Content Types
router.get("/", async (req, res) => {
    const { page = 1, limit = 100 } = req.query;

    ContentType.find({})
        .populate("ownerInfo")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec((err, contentTypes) => {
            if (contentTypes) {
                res.status(200).json(contentTypes);
            } else {
                res.status(404).json({
                    ERR: err.name,
                    ERR_MSG: err.message,
                });
            }
        });
});

//READ Specific Content with  ID
router.get("/:id", async (req, res) => {
    let contentTypeID = req.params.id;
    ContentType.find(contentTypeID)
        .populate("ownerInfo")
        .exec((err, contentType) => {
            if (contentType) {
                res.status(200).json(contentType);
            } else {
                res.status(404).json({
                    ERR: err.name,
                    ERR_MSG: err.message,
                });
            }
        });
});

// //UPDATE Specific Content-Type by ID
router.patch("/:id", async (req, res) => {
    let contentTypeID = req.params.id;
    ContentType.findByIdAndUpdate(contentTypeID, {
        name: req.body.name,
        description: req.body.description,
    }).exec((err, contentType) => {
        if (contentType) {
            res.status(200).json({ contentType });
        } else {
            res.status(404).json({
                ERR: err.name,
                ERR_MSG: err.message,
            });
        }
    });
});

//UPDATE Fields of a Specific ContentType
router.patch("/:id/fields", async (req, res) => {
    let contentTypeID = req.params.id;
    let fieldName = req.body.fieldName;
    let foundField = Fields.findOne({ name: fieldName });
    ContentType.findByIdAndUpdate(contentTypeID, {
        fields: foundField,
    }).exec((err, contentType) => {
        if (contentType) {
            res.status(200).json({ contentType });
        } else {
            res.status(400).json({
                ERR: err.name,
                ERR_MSG: err.message,
            });
        }
    });
});

//Delete content type according to id
router.delete("/:id", async (req, res, next) => {
    const id = req.params.id;
    ContentType.findByIdAndRemove(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete content type with id =${id}`,
                });
            } else {
                res.send({
                    message: "Delete is succeed",
                    deletedData: data,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "could not delete content type with id" + id,
            });
        });
});

module.exports = router;
