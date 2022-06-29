const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the ContentType model
const fieldSchema = new Schema({
    label: {
        type: String,
    },
    dataType: [
        {
            type: String,
            default: "Def",
            minLength: Number,
            maxLength: Number,
        },
        {
            type: Number,
            default: 1,
            minVal: Number,
            maxVal: Number,
        },
        {
            type: Boolean,
            default: true,
        },
        {
            type: Date,
            minVal: Date,
            maxVal: Date,
        },
    ],
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
