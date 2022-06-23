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
            default: "",
            minVal: Number,
            maxVal: Number,
            mVal: Date,
            maVal: Date,
        },
    },

});

module.exports = Field = mongoose.model("fields", fieldSchema);
