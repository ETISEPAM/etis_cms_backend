const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the ContentType model
const contentTypeSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  fields: [
    {
      type: Schema.ObjectId,
      ref: "Fields",
    },
  ],
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.ObjectId,
    ref: "User",
    // required: true,
  },
  version: {
    type: String,
    // required: true,
    default: "0.0.0",
  },
  contents: [
    {
      type: Schema.ObjectId,
      ref: "Content",
    },
  ],
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
    // default: ""
  },
});

module.exports = ContentType = mongoose.model(
  "content_type",
  contentTypeSchema
);
