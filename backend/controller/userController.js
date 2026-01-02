import handleAsync from "../middleware/handleAsync.js";
import User from "../models/userModel.js";
 import HandleError from "../utils/handleError.js";
 import { sendToken } from "../utils/jwtToken.js";
 import {sendEmail} from "../utils/sendEmail.js";
import crypto from "crypto";


// Register a user
export const registerUser = handleAsync(
  async(req, res, next) => {
     const {name, email, password} = req.body;
     const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: "this is a sample id",
            url: "profilepicurl",
        },
      
     })
  
       sendToken(user, 201, res);
      
  }
)

// Login user
export const loginUser = handleAsync(
  async(req, res, next) => {
    const {email, password} = req.body;
    
    if(!email || !password){
      return next(new HandleError("Email and Password cannot be empty", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){ 
      return next(new HandleError("Invalid email or password", 401));
    }
    const isPasswordValid = await user.verifyPassword(password); 
      if(!isPasswordValid){
         return next(new HandleError("Invalid email or password", 401));
      }
      sendToken(user, 200, res);
  }
)

// Logout user
export const logoutUser = handleAsync(
  async(req, res, next) => {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    })
  }
) 

// forgot Password
export const requestPasswordReset = handleAsync(
  async(req,res, next) => {
    
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
       return next(new HandleError("User not found with this email", 400));
    }
    let resetToken;
    try{
       resetToken =  user.getResetPasswordToken()
       await user.save({validateBeforeSave: false});
    }catch(error){
        return next(new HandleError("Could not save reset token, please try again later.", 500));
    }
    const resetPasswordUrl = `http://localhost/api/v1/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetPasswordUrl}.\n\n This link will expire in 15 minutes. \n\n If you have not requested this email, then please ignore it.`;
    try{
      //  send email
       await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
       }); 
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
        })
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new HandleError("Email could not be sent, please try again later.", 500));
    }
  }
)


//  Reset Password
export const resetPassword = handleAsync(
  async(req, res, next) => {
    console.log("BODY:", req.body);
    console.log("PARAMS:", req.params.token); // Debugging line to check request body
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    console.log(req.params.token);
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt: Date.now()},
    });
    if(!user){
      return next(new HandleError("Reset Password Token is invalid or has been expired", 400));
    }
    const {password, confirmPassword} = req.body;
    if(password !== confirmPassword){
      return next(new HandleError("Password does not match", 400));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
  }
)