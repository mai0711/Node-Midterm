const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    description: {
        type: String,
        max: 200
    },
    category: {
        type: String
    },
},
    {timeStamps: true}
);

module.exports = mongoose.model("Post", PostSchema); //export PostSchema as "Post"