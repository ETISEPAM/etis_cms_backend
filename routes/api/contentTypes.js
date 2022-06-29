const express = require("express");
const router = express.Router();
const ContentType = require("../../model/ContentType");
const checkAuth = require("./middleware/checkAuth");

const cookieParser = require("cookie-parser");

router.use(cookieParser());

//Create New Content Type
router.post(
    "/",
    /*checkAuth*/ async (req, res) => {
        // let fieldsArr = req.body.fieldBody.split(", ");

        let { name, description } = req.body;
        let userID = req.cookies.userID;

        await ContentType.findOne({ name: name }).then((contentType) => {
            if (contentType) {
                return res.status(409).json({
                    msg: "Content Type Already Exists!",
                });
            } else {
                const newContentType = new ContentType({
                    name,
                    description,
                    ownerId: req.cookies.userID,
                    
                });
                newContentType.save().then(() => {
                    return res.status(201).json({
                        success: true,
                        msg: "Content Type Created Successfully",
                        newContent: newContentType
                        
                    });
                });
            }
        });
    }
);



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
