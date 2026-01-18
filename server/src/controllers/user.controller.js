import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const signup = async (req, res) => {
  try {
    const { username, password, displayName, phoneNumber } = req.body;

    const checkUser = await userModel.findOne({ username });

    if (checkUser) return responseHandler.badrequest(res, "username already used");

    // Create user but don't save yet - we'll save after payment
    const user = new userModel();

    user.displayName = displayName;
    user.username = username;
    user.phoneNumber = phoneNumber;
    user.setPassword(password);
    
    // Save the user with pending subscription status
    user.subscription = {
      status: 'pending',
      expiresAt: null,
      transactionId: null,
      checkoutRequestId: null
    };
    
    // Save the user to get an ID for the payment process
    await user.save();

    // Return user info without token - token will be provided after payment
    responseHandler.created(res, {
      message: "User created successfully. Please complete payment to activate account.",
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      requiresPayment: true
    });
  } catch (error) {
    console.error("Signup error:", error);
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username }).select("username password salt id displayName subscription phoneNumber");

    if (!user) return responseHandler.badrequest(res, "User not exist");

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    // Check if user has an active subscription
    if (user.subscription.status !== 'active') {
      return responseHandler.ok(res, {
        message: "Please complete your subscription payment to access the service",
        requiresPayment: true,
        userId: user.id,
        phoneNumber: user.phoneNumber
      });
    }

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
  } catch (error) {
    console.error("Signin error:", error);
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel.findById(req.user.id).select("password id salt");

    if (!user) return responseHandler.unauthorize(res);

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    user.setPassword(newPassword);

    await user.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * Verify payment and activate user account
 */
const verifyPaymentAndActivate = async (req, res) => {
  try {
    const { userId, checkoutRequestId } = req.body;
    
    // Find the user
    const user = await userModel.findById(userId);
    
    if (!user) return responseHandler.notfound(res, "User not found");
    
    // Check if payment was successful
    if (user.subscription.status === 'active') {
      // Generate token for the now active user
      const token = jsonwebtoken.sign(
        { data: user.id },
        process.env.TOKEN_SECRET,
        { expiresIn: "24h" }
      );
      
      responseHandler.ok(res, {
        message: "Account activated successfully",
        token,
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        subscription: user.subscription
      });
    } else {
      responseHandler.badrequest(res, "Payment not completed or verified");
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updatePassword,
  verifyPaymentAndActivate
};