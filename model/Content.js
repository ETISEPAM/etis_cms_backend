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
        ref: "content_types",
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
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    tags: 
    [
        {
          type: String
        }
      ]
    ,
    contentFields: {
        type: {
            label: String,
            value: String,
            dataType: String,
        },
    },
});

module.exports = Content = mongoose.model("contents", contentSchema);
