const express = require("express");
const router = express.Router();
const Field = require("../../model/Field");
const checkAuth = require("./middleware/checkAuth");

//Lists All Fields
router.get(
    "/",
    /*checkAuth*/ (req, res) => {
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
    }
);

//Add Field
router.post(
    "/",
    /*checkAuth*/ (req, res) => {
        let { label, dataType, minVal, maxVal } = req.body;
        Field.findOne({
            label: label,
            dataType: dataType,
            "fieldBody.minVal": minVal,
            "fieldBody.maxVal": maxVal,
        }).then((field) => {
            if (field) {
                return res.status(409).json({
                    success: false,
                    msg: `Field with the label of '${label}' already exists`,
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
    }
);
//Get field by id
router.get(
    "/:id",
    /*checkAuth*/ (req, res) => {
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
    }
);

//Delete field

router.delete(
    "/:id",
    /*checkAuth*/ (req, res) => {
        Field.findByIdAndDelete(req.params.id, (err) => {
            if (err) {
                return res.status(404).json({
                    success: false,
                    msg: "The Field Not Found!",
                });
            } else {
                return res.status(204).json({
                    success: true,
                    msg: "Field Deleted!",
                });
            }
        });
    }
);

//Field Update
router.patch(
    "/:id",
    /*checkAuth*/ (req, res) => {
        const id = req.params.id;
        Field.findByIdAndUpdate(
            id,
            {
                label: req.body.label,
                dataType: req.body.dataType,
                "fieldBody.minVal": req.body.minVal,
                "fieldBody.maxVal": req.body.maxVal,
            },
            { new: true },
            (err, field) => {
                if (err || !field) {
                    return res.status(400).json({
                        success: false,
                        msg: "No field found!",
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        msg: "Field Updated 👍",
                        field,
                    });
                }
            }
        );
    }
);

module.exports = router;
