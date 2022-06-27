const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the ContentType model
const contentSchema = new Schema({
    ownerInfo: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    typeId: {
        type: Schema.Types.ObjectId,
        ref: "ContentType",
        // required: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    version: {
        type: String,
        default: "0.0.0",
    },
    showAuthor: {
        type: Boolean,
        default: true,
    },
    showDate: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: "User",
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: Schema.ObjectId,
        ref: "User",
    },
    tags: {
        type: Array,
        default: "",
    },
    contentFields: {
        type: {
            label: String,
            value: String,
            dataType: String,
        },
    },
});

module.exports = Content = mongoose.model("contents", contentSchema);
