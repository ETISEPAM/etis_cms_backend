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

    const foundFieldObj = await Field.findOne({
        label: labelName,
    });

    let foundContentType = await ContentType.findOne({ name: name });

    if (foundContentType) {
        res.status(409).json({
            Message: `Content-Type with the name of ${name} already exists`,
        });
    } else {
        const newContentType = new ContentType({
            name: req.body.name,
            description: req.body.description,
            ownerInfo: userID,
            fields: foundFieldObj,
        });

        await newContentType.save().then(
            res.status(201).json({
                Status: res.status,
                Message: `New Content-Type Created`,
                newContentType,
            })
        );
    }
});

//READ All Content Types
router.get("/", async (req, res) => {
    ContentType.find({})
        .populate("ownerInfo")
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

// //Update content type according to id

// router.patch("/:id", async (req, res) => {
//     if (!req.body) {
//         return res.status(400).send({
//             message: "Data to update can not be empty",
//         });
//     }
//     const id = req.params.id;
//     ContentType.findByIdAndUpdate(id, req.body, { new: true })

//         .then((data) => {
//             if (!data) {
//                 res.status(404).send({
//                     message: `Can not update the content type with id=${id}`,
//                 });
//             } else {
//                 res.send({ message: "Updated succesfully", data });
//             }
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 message: `Error updating content type with id= ${id}`,
//             });
//         });
// });

module.exports = router;
