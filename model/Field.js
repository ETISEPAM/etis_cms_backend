const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the ContentType model
const fieldSchema = new Schema({
  label: {
    type: String,
    required: true,
  },
  dataType: {
    type: String,
    required: true,
  },
  isMandatory: {
    type: Boolean,
    default: false,
  },
  valueRange: {
    type: Object,
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
    default: "",
  },
});

module.exports = Field = mongoose.model("fields", fieldSchema);
