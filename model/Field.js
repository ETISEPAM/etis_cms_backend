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
        type: String,
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
    fieldBody: {
        type: {
            defaultValue: String,
            minVal: Number,
            maxVal: Number,
            minDate: Date,
            maxDate: Date,
        },
    },
});

module.exports = Field = mongoose.model("fields", fieldSchema);
