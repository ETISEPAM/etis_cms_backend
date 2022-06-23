const express = require("express");
const router = express.Router();
const ContentType = require("../../model/ContentType");
const checkAuth = require("./middleware/checkAuth");

//Create New Content Type
router.post(
    "/",
    /*checkAuth*/ async (req, res) => {
        let { name, description } = req.body;
        await ContentType.findOne({ name: name }).then((contentType) => {
            if (contentType) {
                return res.status(409).json({
                    msg: "Content Type Already Exists!",
                });
            } else {
                const newContentType = new ContentType({ name, description });
                newContentType.save().then(() => {
                    return res.status(201).json({
                        success: true,
                        msg: "Content Type Created Successfully",
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
        ContentType.find((err, docs) => {
            if (!err) {
                // console.log(docs)
                let contentTypeNameList = [];
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

router.patch("/:id", async (req, res, next) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty",
        });
    }
    const id = req.params.id;
    ContentType.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Can not update the content type with id=${id}`,
                });
            } else {
                res.send({ message: "Updated succesfully" });
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
