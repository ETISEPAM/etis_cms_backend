const express = require("express");
const router = express.Router();
const Content = require("../../model/Content");
const checkAuth = require("./middleware/checkAuth");

const cookieParser = require("cookie-parser");
router.use(cookieParser());

// List All Contents
router.get("/",  async(req, res) => {
    

    //pagination
    const { page = 1, limit = 10 } = req.query;

    try {
      // execute query with page and limit values
      const contents =  await Content.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
  
      // get total documents in the Posts collection 
      const count =   Content.countDocuments();
  
      // return response with posts, total pages, and current page
      res.json({
        contents,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (err) {
      console.error(err.message);
    }
});

//Show One Content
router.get("/:id", (req, res) => {
    Content.findById(req.params.id, (err, content) => {
        if (!err) {
            res.status(200).json({
                content,
            });
        } else {
            res.status(404).json({
                msg: `Content with ID: ${req.params.id} not found! `,
            });
        }
    });
});

//CREATE New Content
router.post(
    "/",
    /*checkAuth,*/ async (req, res) => {
        let { title, body } = req.body;
        Content.findOne({
            "contentBody.title": title,
            "contentBody.body": body, new:true
        }).then((content) => {
            if (content) {
                return res.status(409).json({
                    msg: `Content with the title of '${title}' already exists`,
                });
            } else {
                const newContent = new Content({
                    ownerId: req.cookies.userID,
                    contentBody: { title, body },
                });
                newContent.save().then(() => {
                    return res.status(201).json({
                        success: true,
                        msg: "Content Created",
                        newContent,
                    });
                });
            }
        });
    }
);

//UPDATE Specific Content
router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    Content.findByIdAndUpdate(
        id,
        { "contentBody.title": req.body.title },
        { new: true },
        (err, content) => {
            if (err || !content) {
                return res.status(400).json({
                    msg: "No Content Found",
                });
            } else {
                return res.status(200).json({
                    msg: "User Updated Successfully!",
                    content,
                });
            }
        }
    );
});

//DELETE Specific Content
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    Content.findByIdAndDelete(id, (err, content) => {
        if (err || !content) {
            return res.status(404).json({
                msg: "Content Not Found",
            });
        } else {
            return res.status(200).json({
                msg: "Content Deleted Successfully",
                deletedContent: content
            });
        }
    });
});

module.exports = router;
