const express = require("express");
const router = express.Router();
const Field = require("../../model/Field");

//Lists All Fields
router.get("/", (req, res) => {
    Field.find((err, fields) => {
        if (!err) {
            res.status(200).json({
                fields,
            });
        } else {
            res.status(404).json({
                success: false,
                msg: "Field List Not Found!",
            });
        }
    });
});

//Add Field
router.post("/add", (req, res) => {
    let { label, dataType, minVal, maxVal } = req.body;
    Field.findOne({
        label: label,
        dataType: dataType,
        "fieldBody.minVal": minVal,
        "fieldBody.maxVal": maxVal,
    }).then((field) => {
        if (field) {
            return res.status(409).json({
                msg: `Content with the title of '${label}' already exists`,
            });
        } else {
            const newField = new Field({
                label: label,
                dataType: dataType,
                fieldBody: { maxVal, minVal },
            });

            newField.save().then(() => {
                return res.status(201).json({
                    newField,
                    success: true,
                    msg: "Field Added!",
                });
            });
        }
    });
});

router.get(":/id", (req, res) => {
    Field.findById(req.params.id, (err, fields) => {
        if (!err) {
            res.status(200).json({ fields });
        } else {
            res.status(404).json({
                success: false,
                msg: `Field with Id: ${req.params.id} not found!`,
            });
        }
    });
});

router.delete(":/id", (req, res) => {
    const id = req.params.id;
    Field.findByIdAndDelete(req.params.id, (err, fields) => {
        if (err || !field) {
            return res.status(404).json({
                success: false,
                msg: "The Field Not Found!",
            });
        } else {
            return res.status(200).json({
                success: true,
                msg: "Field Deleted!",
            });
        }
    });
});

module.exports = router;
