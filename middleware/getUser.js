const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
// const KEY = "IWOULDALWAYSLOVETOBETHEBESTWHOWORSHIPSGODANDSHOWSGRATTITUDE";

const checkUser = async (req, res, next) => {
  const token = req.header("token");

  try {
    if (!token) {
      return res.status(402).json({ error: "Provide jwt token to validate" });
    }
    const data = jwt.verify(token, process.env.KEY);
    if(data.expiryTime < Date.now()) {
      return res.status(402).json({ error: "Token Expired, Login again and try again" });
    }
    if (!data) {
      return res.status(402).json({ error: "Not a valid Token" });
    }

    const userData = await UserModel.findById(data.userId);
    if (!userData) {
      return res.status(404).json({ error: "User Not Found" });
    }

    req.userId = data.userId;
    // const userData = await UserModel.findById(data.user);
    req.user = userData;
    console.log(data.user);

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = checkUser;