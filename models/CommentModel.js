const { default: mongoose } = require("mongoose");

const CommentSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    userName: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogs",
    },
    comment: {
        type: String,
        required: true,
    },
    canReply: {
        type: Boolean,
        default: true,
    },
    replies: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
            userName: {
                type: String,
                required: true
            },
            userImage: {
                type: String,
            },
            reply:{
                type: String,
                required: true
            },
            repliedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    commentedAt: {
        type: Date,
        default: Date.now,
    },
});

const CommentModel = mongoose.model("comments", CommentSchema);

module.exports = CommentModel;