const express = require("express");
const router = express.Router();
const ContentType = require("../../model/ContentType");
const checkAuth = require("./middleware/checkAuth");

const cookieParser = require("cookie-parser");

router.use(cookieParser());

//CREATE New Content Type
router.post("/", async (req, res) => {
    let { name, description } = req.body;
    let userID = req.cookies.userID;
    let labelName = req.body.labelName;

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
                fields: [],
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
    let newField = {
        label: req.body.label,
        isMandatory: req.body.isMandatory,
        isUnique: req.body.isUnique,
        dataType: req.body.dataType,
    };

    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty",
        });
    }
    const id = req.params.id;
    let foundContentType = await ContentType.findById(id);
    let fieldsArr = foundContentType.fields;
    fieldsArr.push(newField);

    //res.json({foundContentType})
    ContentType.findOneAndUpdate(
        { id: contentTypeID },
        { fields: fieldsArr },
        { new: true }
    ).exec((err, contentType) => {
        if (contentType) {
            res.status(200).json({ contentType });
        } else {
            res.status(404).json({ err: err.message });
        }
    });
});

// //Delete content type according to id
// router.delete("/:id", async (req, res, next) => {
//     const id = req.params.id;
//     ContentType.findByIdAndRemove(id)
//         .then((data) => {
//             if (!data) {
//                 res.status(404).send({
//                     message: `Cannot delete content type with id =${id}`,
//                 });
//             } else {
//                 res.send({
//                     message: "Delete is succeed",
//                     deletedData: data,
//                 });
//             }
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 message: "could not delete content type with id" + id,
//             });
//         });
// });

module.exports = router;
