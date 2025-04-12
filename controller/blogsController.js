const { default: mongoose } = require("mongoose");
// const LikeModel = require("../models/LikeModel");
const BlogModel = require("../models/BlogModel");
// const RelationModel = require("../models/RelationModel");
// const UserModel = require("../models/UserModel");
// const CommentModel = require("../models/CommentModel");
// const SavedPostsModel = require("../models/SavedPostsModel");

const createBlog = async (req, res) => {
  const { title, description, image } = req.body;
  if (!title || !description ) {
    return res.status(402).json({ error: "Fill All Mandatory Fields" });
  }
  const newBlog = await BlogModel.create({
    title,
    description,
    image,
    userId: req.userId,
  });
  res.json({ message: "Blog Created Successfully", blog: newBlog });
};

const getBlog = async(req,res)=>{
  const { id } = req.params;
  const valid = mongoose.Types.ObjectId.isValid(id);
  
  if (!valid) {
    return res.status(402).json({ error: "Not a valid blog" });
  }
  const blog = await BlogModel.findById(id);
  if (!blog) {
    return res.status(404).json({ error: "Not found" });
  }
  return res.status(200).json(blog);
    
}

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const valid = mongoose.Types.ObjectId.isValid(id);
  if (!valid) {
    return res.status(402).json({ error: "Not a valid blog" });
  }
  const blog = await BlogModel.findById(id);
  if (!blog) {
    return res.status(404).json({ error: "Not found" });
  }
  if (req.userId !== blog.userId.toString()) {
    return res.status(402).json({ error: "Not Allowed" });
  }

  await BlogModel.findByIdAndDelete(id);

//   let itscomments = await CommentModel.find({ postid: id });
  // console.log(itscomments);

//   await Promise.all(
//     itscomments.map((item, ind) => {
//       return CommentModel.findByIdAndDelete(item._id);
//     })
//   );

//   let likes = await LikeModel.find({ postid: id });
//   await Promise.all(
//     likes.map((item, ind) => {
//       return LikeModel.findByIdAndDelete(item._id);
//     })
//   );

//   let savedposts = await SavedPostsModel.findOne({ userid: req.user });
//   console.log(savedposts);
//   let postssaved = savedposts.postsSaved;
//   console.log(postssaved);
//   if (postssaved.length !== 0) {
//     const others = postssaved.filter((post, ind) => {
//       return post.postid.toString() !== id;
//     });
//     console.log(others);

//     await SavedPostsModel.findByIdAndUpdate(
//       savedposts._id,
//       {
//         $set: { postsSaved: others },
//       },
//       { new: true }
//     );
//   }
  res.json({ message: "Blog Deleted Successfully" });
};

// };
const getBlogs = async (req, res) => {
  const all = await BlogModel.find();
  res.json({ Blogs: all });
};

const updateBlog = async (req, res) => {
  const { image, title, description } = req.body;
  let upBlog = {};

  if (title) {
    upBlog.title = title;
  }
  if (image) {
    upBlog.image = image;
  }
  if (description) {
    upBlog.description = description;
  }

  try {
    const { id } = req.params;
    const valid = mongoose.Types.ObjectId.isValid(id);
    if (!valid) {
      return res.status(402).json({ error: "Not a valid blog" });
    }
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Not found" });
    }
    if (req.userId !== blog.userId.toString()) {
      return res.status(402).json({ error: "Not Allowed" });
    }

    const updated = await BlogModel.findByIdAndUpdate(
      id,
      { $set: upBlog },
      { new: true }
    );

    res.json({ message: "Blog Updated Successfully", Blog: updated });
  } catch (error) {
    console.log(error);
  }
};

// const likePost = async (req, res) => {
//   const { id } = req.params;
//   let newLike;
//   const liked = await LikeModel.findOne({ userid: req.user, postid: id });
//   if (!liked) {
//     newLike = await LikeModel.create({ postid: id, userid: req.user });
//     const post = await PostsModel.findById(id);
//     await PostsModel.findByIdAndUpdate(
//       id,
//       {
//         $set: { likeCount: post.likeCount + 1 },
//       },
//       { new: true }
//     );
//     res.json({ message: "Liked the Post", newLike });
//   } else {
//     await LikeModel.findOneAndDelete({ userid: req.user, postid: id });
//     const post = await PostsModel.findById(id);
//     await PostsModel.findByIdAndUpdate(
//       id,
//       { $set: { likeCount: post.likeCount - 1 } },
//       { new: true }
//     );

//     res.json({ message: "Unliked The Post" });
//   }
// };

// const getOurPosts = async (req, res) => {
//   try {
//     const ours = await PostsModel.find({ userid: req.user });
//     res.json({ yourPosts: ours });
//   } catch (error) {
//     console.log(error);
//   }
// };




module.exports = {
  createBlog,
  getBlogs,
  deleteBlog,
  getBlog,
  updateBlog,
};