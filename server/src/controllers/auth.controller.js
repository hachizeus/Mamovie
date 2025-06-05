import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const signup = async (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    const { username, password, displayName, phoneNumber } = req.body;

    const checkUser = await userModel.findOne({ username });
    console.log("Existing user check:", checkUser ? "User exists" : "Username available");

    if (checkUser) return responseHandler.badRequest(res, "username already used");

    const user = new userModel();

    user.displayName = displayName;
    user.username = username;
    user.phoneNumber = phoneNumber;
    user.setPassword(password);

    console.log("Attempting to save user to database...");
    await user.save();
    console.log("User saved successfully with ID:", user.id);

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    console.log("User registration complete, returning response");
    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
      password: undefined,
      salt: undefined
    });
  } catch (error) {
    console.error("Error during signup:", error);
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username }).select("username password salt id displayName phoneNumber");

    if (!user) return responseHandler.badRequest(res, "User not found");

    if (!user.validPassword(password)) return responseHandler.badRequest(res, "Wrong password");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notFound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo
};