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

//Get All Content Types
router.get(
    "/",
    /*checkAuth*/ (req, res, next) => {
        const { page = 1, limit = 10 } = req.query;

        try {
            // execute query with page and limit values
            const result = ContentType.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            // get total documents in the Posts collection
            const count = ContentType.countDocuments();

            // return response with posts, total pages, and current page
            res.json({
                result,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
            });
        } catch (err) {
            console.error(err.message);
        }

        


        ContentType.find((err, docs) => {
            if (!err) {
                //pagination

                let contentTypeNameList = [];

                // console.log(docs)

                docs.forEach((item) => {
                    contentTypeNameList.push({ name: item.name, id: item._id });
                });
                return res.status(200).json({
                    contentTypeNameList,
                });
            } else {
                return res.status(404).json({
                    msg: "Failed to retrieve content type list",
                });
            }
        });


        
    }
);

//Add Field to Content Type
router.post("/field", (req, res) => {});

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

//Update content type according to id

router.patch("/:id", async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty",
        });
    }
    const id = req.params.id;
    ContentType.findByIdAndUpdate(
        id,
        req.body,
        
        { new: true }
    )

        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Can not update the content type with id=${id}`,
                });
            } else {
                res.send({ message: "Updated succesfully", data });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Error updating content type with id= ${id}`,
            });
        });
});

//Get the content type with specific id
router.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    ContentType.findById(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: "Not found content type with id" + id,
                });
            } else res.send(data);
        })
        .catch((err) => {
            res.status(500).send(
                { message: "Error while retrieving the content type with id" } +
                    id
            );
        });
});

module.exports = router;
