const express = require("express");
const router = express.Router();
const Field = require("../../model/Field");
const checkAuth = require("./middleware/checkAuth");

const cookieParser = require("cookie-parser");
const ContentType = require("../../model/ContentType");

router.use(cookieParser());

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
    /*checkAuth*/ async (req, res) => {
        let {
            label,
            dataType,
            minVal,
            maxVal,
            isMandatory,
            isUnique,
            defaultValue,
            minDate,
            maxDate,
            ctTypeId,
        } = req.body;
        Field.findOne({
            label: label,
            dataType: dataType,
            isMandatory: isMandatory,
            isUnique: isUnique,
            "fieldBody.minVal": minVal,
            "fieldBody.maxVal": maxVal,
            "fieldBody.minDate": minDate,
            "fieldBody.maxDate": maxDate,
            "fieldBody.defaultValue": defaultValue,
        }).then((field) => {
            if (field) {
                return res.status(409).json({
                    success: false,
                    msg: `Field with the label of '${label}' already exists`,
                });
            } else {
                const fieldCt = ContentType.findOne({
                    ctTypeId: req.body.ctTypeId,
                });

                // hangi ct'ye field eklenecek     const foundCt = ContentType.findOne({})
                const newField = new Field({
                    label: label,
                    dataType: dataType,
                    isMandatory: isMandatory,
                    isUnique: isUnique,
                    ctTypeId: req.body.ctTypeId,
                    fieldBody: {
                        maxVal,
                        minVal,
                        defaultValue,
                        maxDate,
                        minDate,
                    },
                });

                fieldCt.fields.push(newFields);

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
                isMandatory: req.body.isMandatory,
                isUnique: req.body.isUnique,
                "fieldBody.minVal": req.body.minVal,
                "fieldBody.maxVal": req.body.maxVal,
                "fieldBody.minDate": req.body.minDate,
                "fieldBody.maxDate": req.body.maxDate,
                "fieldBody.defaultValue": req.body.defaultValue,
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
