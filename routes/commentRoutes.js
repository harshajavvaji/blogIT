const express = require("express");
const router = express.Router();
const checkUser = require("../middleware/getUser");
const {
  createComment,
  getComments,
  createReply
} = require("../controller/commentsController");

router.get("/", (req, res) => {
  res.send("Welcome to comment routes");
});

router.post("/blog/:blogId/create", checkUser, createComment);
// router.delete("/delete/:id", checkUser, deleteComment);
// router.put("/update/:id", checkUser, updateComment);
router.get("/blog/:blogId/getcomments", getComments);
router.post("/:commentId/reply/create", checkUser, createReply);

// router.get("/postcomments/")

module.exports = router;