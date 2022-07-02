const express = require("express");
const router = express.Router();
const Field = require("../../model/Fields");
const DataType = require("../../model/DataType");
const checkAuth = require("./middleware/checkAuth");

//List ALL Fields
router.get("/", async (req, res) => {
    Field.find().exec((err, fields) => {
        if (fields) {
            res.status(200).json(fields);
        } else {
            res.status(404).json({
                ERR: err.name,
                ERR_MSG: err.message,
            });
        }
    });
});

//Create New Field
router.post("/", async (req, res) => {
    let { label, minValue, maxValue, isMandatory, isUnique } = req.body;
    let dataType = await DataType.find({ name: req.body.dataType });

    let newField = new Field({
        label: label,
        dataType: dataType,
        minValue: minValue,
        maxValue: maxValue,
        isMandatory: isMandatory,
        isUnique: isUnique,
    });

    newField
        .save()
        .then(() => {
            res.status(201).json({
                Message: `Field Created`,
                newField,
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
