const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the ContentType model
const fieldSchema = new Schema({
    label: {
        type: String,
        unique: true,
        // required: true,
    },
    dataType: {
        type: Schema.Types.Mixed,
        // required: true,
    },
    isMandatory: {
        type: Boolean,
        default: false,
    },
    isUnique: {
        type: Boolean,
        default: false,
    },
});

module.exports = Field = mongoose.model("fields", fieldSchema);
