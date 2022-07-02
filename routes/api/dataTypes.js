const express = require("express");
const router = express.Router();
const DataType = require("../../model/DataType");
const checkAuth = require("./middleware/checkAuth");

//List All Data Types
router.get("/", async (req, res) => {
    DataType.find().exec((err, dataTypes) => {
        if (dataTypes) {
            res.status(200).json(dataTypes);
        } else {
            res.status(404).json({
                ERR: err.name,
                ERR_MSG: err.message,
            });
        }
    });
});

//Create New Data Type
router.post("/", async (req, res) => {
    let { name, desc } = req.body;
    let newDataType = new DataType({
        name: name,
        desc: desc,
    });

    newDataType
        .save()
        .then(() => {
            res.status(201).json({
                Message: `Data Type Created!`,
                newDataType,
            });
        })
        .catch((err) => {
            res.status(400).json({
                ERR: err.name,
                ERR_MSG: err.message,
            });
        });
});

module.exports = router;
