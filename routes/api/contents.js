const express = require("express");
const router = express.Router();
const Content = require("../../model/Content");
const ContentType = require("../../model/ContentType");
const checkAuth = require("./middleware/checkAuth");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

//CREATE New Content
router.post("/", async (req, res) => {
    let { label, value } = req.body;
    let userID = req.cookies.userID;
    let tagsArr = req.body.tags.split(", ");

    const isFound = await Content.findOne({
        "contentFields.label": label,
        "contentFields.value": value,
        new: true,
    });

    if (isFound) {
        res.status(409).json({
            Message: `Content with the title of '${label}' already exists`,
        });
    } else {
        const newContent = new Content({
            typeId: req.body.typeId,
            contentFields: { label, value },
            ownerInfo: userID,
            tags: tagsArr,
            new: true,
        });

        await newContent.save().then(
            res.status(201).json({
                Status: res.status,
                Message: `New Content Created`,
                newContent,
            })
        );
    }
});

//READ All Contents
router.get("/", async (req, res) => {
    Content.find({})
        .populate("ownerInfo")
        .exec((err, contents) => {
            if (contents) {
                res.status(200).json(contents);
            } else {
                res.status(404).json({
                    ERR: err.name,
                    ERR_MSG: err.message,
                });
            }
        });
});

//READ Specific Content with ID
router.get("/:id", async (req, res) => {
    let contentID = req.params.id;
    Content.findById(contentID)
        .populate("ownerInfo")
        .exec((err, content) => {
            if (content) {
                res.status(200).json(content);
            } else {
                res.status(400).json({
                    ERR: err.name,
                    ERR_MSG: err.message,
                });
            }
        });
});

//UPDATE Specific Content with ID
router.patch("/:id", (req, res) => {
    const contentID = req.params.id;
    let tagsArr = req.body.tags.split(", ");
    Content.findByIdAndUpdate(
        contentID,
        {
            "contentFields.label": req.body.label,
            "contentFields.value": req.body.value,
            tags: req.body.updatedTags,
            isPublished: req.body.isPublished,
            showAuthor: req.body.showAuthor,
            showDate: req.body.showDate,
            tags: tagsArr,
        },
        { new: true },
        (err, content) => {
            if (err) {
                res.status(400).json({
                    ERR_MSG: err.message,
                });
            } else {
                res.status(200).json({
                    Message: `Content with the ID: ${contentID} Updated!`,
                    content,
                });
            }
        }
    );
});

// DELETE Specific Content
router.delete("/:id", (req, res) => {
    const contentID = req.params.id;
    Content.findByIdAndDelete(contentID, (err, content) => {
        if (err || !content) {
            res.status(404).json({
                Message: "Content Not Found",
            });
        } else {
            res.status(200).json({
                ERR_MSG: "Deleted Successfully",
                DeletedContent: content,
            });
        }
    });
});

module.exports = router;
