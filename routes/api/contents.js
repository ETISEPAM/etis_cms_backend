const express = require("express");
const router = express.Router();
const Content = require("../../model/Content");
const ContentType = require("../../model/ContentType");
const checkAuth = require("./middleware/checkAuth");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

//CREATE New Content
router.post("/", async (req, res) => {
    let { label, value, showAuthor, isPublished, showDate } = req.body;
    let userID = req.cookies.userID;
    let tagsArr = req.body.tags.split(", ");
    let ctName = req.body.ctName;
    let contentName = req.body.contentName;

    const foundCtObj = await ContentType.findOne({
        name: ctName,
    });
    const isFound = await Content.findOne({
        //Content Type'ı oluşturan field'ları kontrol et!
        //isUnique === true ? ERR : SUCC
        // TODO: DELETE THIS
        contentName: contentName,
        // TODO: DELETE THIS
    });

    if (isFound) {
        res.status(409).json({
            Message: `Content with the title of '${label}' already exists`,
        });
    } else {
        //Versioning
        let majorIdx = 0;
        let minorIdx = 1;
        let patchIdx = 2;
        let firstVersion = "0.0.0";
        let versionDecimals = firstVersion.split(".");
        [0, 0, 0];
        //Update Major Version if Published
        let isPublished = req.body.isPublished;
        if (isPublished === "true") {
            versionDecimals[majorIdx]++;
            currentVersion = versionDecimals.join(".");
            ("1.0.0");
        } else {
            currentVersion = firstVersion;
        }
        const newContent = new Content({
            contentName: contentName,
            ctInfo: foundCtObj,
            ownerInfo: userID,
            tags: tagsArr,
            version: currentVersion,
            showAuthor: showAuthor,
            isPublished: isPublished,
            showDate: showDate,
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
router.get("/", (req, res) => {
    const { page = 1, limit = 100 } = req.query;
    Content.find({ isDeleted: "false" })
        .populate("ownerInfo")
        .populate("ctInfo")
        .limit(limit * 1)
        .skip((page - 1) * limit)
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
router.patch("/:id", async (req, res) => {
    const contentID = req.params.id;
    let tagsArr = req.body.tags.split(", ");

    let foundContent = await Content.findById(contentID);
    let updatedContent = await Content.findByIdAndUpdate(
        { _id: contentID },
        {
            contentName: req.body.contentName,
            tags: req.body.tags,
        },
        { new: true }
    );
    let currentVersion = foundContent.version;
    let versionDecimals = currentVersion.split(".");
    let patchIdx = 2;
    if (updatedContent) {
        if (
            updatedContent.tags.every((item) =>
                foundContent.tags.includes(item)
            )
        ) {
            res.status(200).json({
                Message: "GOGOGO",
            });
        } else {
            versionDecimals[patchIdx]++;
            currentVersion = versionDecimals.join(".");
            Content.updateOne(
                { _id: contentID },
                {
                    version: currentVersion,
                }
            ).exec((err, content) => {
                if (content) {
                    res.status(200).json({
                        content,
                    });
                }
            });
        }
    }
});

// Soft delete
router.patch("/delete/:id", (req, res) => {
    const contentID = req.params.id;
    Content.findByIdAndUpdate(
        contentID,
        {
            isDeleted: true,
        },
        { new: true },
        (err, content) => {
            if (err) {
                res.status(400).json({
                    ERR_MSG: err.message,
                });
            } else {
                res.status(200).json({
                    Message: `Content with the ID: ${contentID} Deleted!`,
                    content,
                });
            }
        }
    );
});
//Filter contents according to tags
router.get("/tags/:tags", async (req, res) => {
    let data = await Content.find({
        tags: req.query.tags,
    });
    res.send({
        data,
    });
});

module.exports = router;
