const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the ContentType model
const contentTypeSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    fields: [
        // {
        // String {
        //     minLength: Number,
        //     maxLength: Number,
        //     isMandatory: Boolean,
        //     isUnique: Boolean,
        // },
        // Number {
        //     minValue: Number,
        //     maxValue: Number,
        //     isMandatory: Boolean,
        //     isUnique: Boolean,
        // },
        // Boolean {
        //     ...
        // },
        // Date{
        //     ...
        // },
        // File{
        //     ...
        // }
        // },
    ],
    name: {
        type: String,
        required: true,
    },
    ownerInfo: {
        type: Schema.Types.ObjectId,
        ref: "users",
        // required: true,
    },
    version: {
        type: String,
        // required: true,
        default: "0.0.0",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: "users",
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: Schema.ObjectId,
        ref: "users",
        // default: ""
    },
});

module.exports = ContentType = mongoose.model(
    "content_types",
    contentTypeSchema
);
