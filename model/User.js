const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the user model
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        default: "user",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        default: "user@user.com",
    },
    password: {
        type: String,
        required: true,
    },

    firstName: {
        type: String,
        required: true,
        default: "John",
    },
    lastName: {
        type: String,
        required: true,
        default: "Doe",
    },
    firstLogin: {
        type: Boolean,
        default: true,
    },
    profileImage: {
        imgSrc: String,
        maxImgWidth: Number,

        maxImgHeight: Number,
    },
    userBio: {
        type: String,
        default: "Bio",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    //Connect ContentType to User
    //TODO: Check if used right.
    userContentType: [
        {
            type: Schema.ObjectId,
            ref: "content_types",
        },
    ],
    //User altında content id'lerinin array'i tutulacak
    userContent: [
        {
            type: Schema.Types.ObjectId,
            ref: "contents",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = User = mongoose.model("users", UserSchema);
