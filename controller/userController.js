const UserModel = require("../models/UserModel");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const RelationModel = require("../models/RelationModel");
// const CommentModel = require("../models/CommentModel");
// const PostsModel = require("../models/PostsModel");
// const KEY = "IWOULDALWAYSLOVETOBETHEBESTWHOWORSHIPSGODANDSHOWSGRATTITUDE";

const signup = async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Fill All Mandatory Fields" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address" });
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character",
    });
  }
  try {
    const isExist = await UserModel.findOne({ email });

    if (isExist) {
      return res.status(402).json({ error: "User Already Exists" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character",
      });
    }

    const salt = await bycrypt.genSalt(10);
    const hashed = await bycrypt.hash(password, salt);
    const newUser = await UserModel.create({ name, email, password: hashed, profilePic });
    const now = new Date();
    const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
    const expiryTime = oneHourLater.getTime(); // 1 hour from now
    const token = await jwt.sign(
      { userId: newUser._id, expiryTime },
      process.env.KEY
    );
    const { password: _, ...userWithoutPassword } = newUser._doc;
    res.json({
      message: "User Created Successfully",
      newUser: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Fill All Mandatory Fields" });
  }
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character",
      });
    }
    const isExist = await UserModel.findOne({ email });
    if (!isExist) {
      return res.status(402).json({ error: "No User Found" });
    }

    const same = await bycrypt.compare(password, isExist.password);
    if (!same) {
      return res.status(402).json({ error: "Invalid Credentials" });
    }
    const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
    const expiryTime = oneHourLater.getTime(); // 1 hour from now
    const token = jwt.sign(
      { userId: isExist._id, expiryTime },
      process.env.KEY
    );
    const { password: _, ...userWithoutPassword } = isExist._doc;
    res.json({
      message: "Logged in successfully",
      token,
      user: userWithoutPassword,
    });

    // res.json({ message: "Logged in successfully", token, user: isExist });
  } catch (error) {
    console.log(error);
  }
};

// const completeProfile = async (req, res) => {
//   const { status, job, coverPic, profilePic, city, instaLink, fbLink } =
//     req.body;
//   let upProfile = {};

//   if (status) {
//     upProfile.status = status;
//   }

//   if (job) {
//     upProfile.job = job;
//   }

//   if (coverPic) {
//     upProfile.coverPic = coverPic;
//   }

//   if (profilePic) {
//     upProfile.profilePic = profilePic;
//   }

//   if (city) {
//     upProfile.city = city;
//   }

//   if (instaLink) {
//     upProfile.instaLink = instaLink;
//   }

//   if (fbLink) {
//     upProfile.fbLink = fbLink;
//   }

//   //   res.send("completed");

//   const complete = await UserModel.findByIdAndUpdate(
//     req.user,
//     { $set: upProfile },
//     { new: true }
//   );
//   const commts = await CommentModel.find({ userid: req.user });

//   await Promise.all(
//     commts.map((item, ind) => {
//       return CommentModel.findByIdAndUpdate(
//         item._id,
//         { $set: { profilePic } },
//         { new: true }
//       );
//     })
//   );
//   const postsall = await PostsModel.find({ userid: req.user });
//   await Promise.all(
//     postsall.map((item, ind) => {
//       return PostsModel.findByIdAndUpdate(
//         item._id,
//         { $set: { profilePic } },
//         { new: true }
//       );
//     })
//   );
//   // await CommentModel.findOneAndUpdate(
//   //   { userid: req.user },
//   //   { $set: { profilePic: profilePic } },
//   //   { new: true }
//   // );
//   // await PostsModel.find
//   res.json({ message: "Updated Profile Successfully", complete });
// };

// const getAllProfiles = async (req, res) => {
//   try {
//     const allProfiles = await UserModel.find();
//     // const friendsid = await RelationModel.find({ followerid: req.user });
//     //  const otherPeople = await Promise.all(
//     //   allProfiles.filter((item,ind)=>{
//     //     return friendsid.includes(item._id)
//     //   })
//     //  )
//     res.json({ allProfiles });
//   } catch (error) {
//     console.log(error);
//   }
// };
const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const getProfile = await UserModel.findById(id);
    res.json({ profile: getProfile });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  signup,
  login,
  //   completeProfile,
  //   getAllProfiles,
  getUserProfile,
};
