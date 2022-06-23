const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the ContentType model
const contentSchema = new Schema({
  ownerId: [
    {
      type: Schema.ObjectId,
      ref: "User",
      // required: true,
    },
  ],
  typeId: {
    type: Schema.ObjectId,
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
  tag: {
    type: Array,
    default: "",
  },
  contentBody: {
    type: {
      title: String,
      description: String,
      body: String
    },
  },
});

module.exports = Content = mongoose.model("contents", contentSchema);
