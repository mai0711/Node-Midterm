const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        min: 2,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 30,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
},
    {timeStamps: true}
);

module.exports = mongoose.model("User", UserSchema); //export UserSchema as "User"