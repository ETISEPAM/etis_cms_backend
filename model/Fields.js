const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the ContentType model
const fieldSchema = new Schema({
    label: String,
    dataType: {},
    minValue: Schema.Types.Mixed,
    maxValue: Schema.Types.Mixed,
    isMandatory: Boolean,
    isUnique: Boolean,
});

module.exports = Field = mongoose.model("fields", fieldSchema);
