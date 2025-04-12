const express = require("express");
const checkUser = require("../middleware/getUser");
const {
  getOthersPost,
  getOurPosts,
  createPost,
  deletePosts,
  getBlog,
  getBlogs,
  deleteBlog,
  updateBlog,
  createBlog
} = require("../controller/blogsController");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("Welcome to blogs route");
});

router.post("/create", checkUser, createBlog);
router.delete("/delete/:id", checkUser, deleteBlog);
router.get("/allBlogs", getBlogs);
router.put("/update/:id", checkUser, updateBlog);
router.get("/getBlog/:id", getBlog);

module.exports = router;