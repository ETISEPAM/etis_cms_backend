const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataTypeSchema = new Schema({
    name: String,
    desc: String,
});

module.exports = DataType = mongoose.model("data_types", dataTypeSchema);
