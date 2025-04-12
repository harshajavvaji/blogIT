const { default: mongoose } = require("mongoose");
const CommentModel = require("../models/CommentModel");
const BlogModel = require("../models/BlogModel");

const createComment = async (req, res) => {
  const { blogId } = req.params
  const { comment, canReply } = req.body;

  if (!comment || !blogId) {
    return res.status(402).json({ error: "Enter all Mandatory Fields" });
  }
  try {
    const valid = await mongoose.Types.ObjectId.isValid(blogId);
    if (!valid) {
      return res.status(402).json({ error: "Invalid Blog id" });
    }

    const isExists = await BlogModel.findById(blogId);

    if (!isExists) {
      return res.status(404).json({ error: "Not Found" });
    }

    const newComment = await CommentModel.create({
      blogId,
      comment,
      userId: req.userId,
      userName: req.user.name,
      userImage: req.user.profilePic,
      canReply
      // profilePic: req.user.profilePic, -->Must b fixed later
    });
    // await BlogModel.findByIdAndUpdate(
    //   postid,
    //   { $set: { comments: [...isExists.comments, newComment] } },
    //   { new: true }
    // );

    res.json({ message: "Comment Created Successfully", comment: newComment });
  } catch (error) {
    console.log(error);
  }
};

const getComments = async (req, res) => {

  const { blogId } = req.params;
  console.log('blogId', blogId);
  if (!blogId) {
    return res.status(402).json({ error: "Send BlogId" });
  }
  
  var valid = mongoose.Types.ObjectId.isValid(blogId);
  if (!valid) {
    return res.status(402).json({ error: "Not a valid BlogId" });
  }
  
  try {
    const comments = await CommentModel.find({ blogId });
    res.json({ comments });
  } catch (error) {
    console.log(error);
  }
};

const createReply = async (req, res) => {
  const { commentId } = req.params
  const { reply } = req.body
  if (!reply) {
    return res.status(402).json({ error: "Enter Reply" })
  }
  const valid = mongoose.Types.ObjectId.isValid(commentId)
  if (!valid) {
    return res.status(402).json({ error: "Not a valid comment" })
  }

  const comment = await CommentModel.findById(commentId)
  if (!comment) {
    return res.status(404).json({ error: "Not Found" })
  }

  if (comment.canReply === false) {
    return res.status(402).json({ error: "Cannot reply" })
  }
  var upComment = {}
  upComment.replies = [...comment.replies, {
    userId: req.userId,
    userName: req.user.name,
    userImage: req.user.profilePic,
    reply
  }]

  const updated = await CommentModel.findByIdAndUpdate(
    commentId,
    { $set: upComment },
    { new: true }
  );

  return res.json({ message: "Reply Created Successfully", comment: updated })
}
module.exports = { getComments, createComment, createReply };