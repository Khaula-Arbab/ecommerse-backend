import handleAsync from "../middleware/handleAsync.js";
import User from "../models/userModel.js";
 import HandleError from "../utils/handleError.js";
 import { sendToken } from "../utils/jwtToken.js";
 import {sendEmail} from "../utils/sendEmail.js";
import crypto from "crypto";
import {v2 as cloudinary} from "cloudinary";


// Register a user
export const registerUser = handleAsync(
  async(req, res, next) => {
    const {name, email, password} = req.body;
    if (!req.files || !req.files.avatar) {
      return next(new HandleError("Avatar file is required", 400));
    }
    
    const avatar = req.files.avatar;
  
     const myCloud = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      {
        folder: "avatars",
        width: 150,
        crop: "scale",
      }
    );
    

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    
   
     const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
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

// Get User Details
export const getUserDetails = handleAsync(
  async(req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    })
  }
)

// Update User Password

export const updatePassword = handleAsync(
  async(req, res, next) => {
    const {oldPassword, newPassword, confirmPassword} = req.body;
    const user = await User.findById(req.user.id).select("+password");
    const checkPasswordMatch = await user.verifyPassword(oldPassword);
    if(!checkPasswordMatch){
      return next(new HandleError("Old password is incorrect", 400));
    }
    if(newPassword !== confirmPassword){
      return next(new HandleError("Password does not match", 400));
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
  }
)

// Update User Profile
// export const updateUserProfile = handleAsync(
//   async(req, res, next) => {
//     const {name, email} = req.body;
//     const updateUserData = {
//       name,
//       email,
//     }
//     const user = await User.findByIdAndUpdate(req.user.id, updateUserData, {
//               new: true,
//               runValidators: true,
//     });
//     res.status(200).json({
//       success: true,
//       message: "Profile Updated Successfully",
//       user,
//     })
//   }
// )


export const updateUserProfile = handleAsync(
  async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    // If avatar is being updated
    if (req.files && req.files.avatar) {
      const user = await User.findById(req.user.id);

      // Delete old avatar from Cloudinary
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      // Upload new avatar
      const result = await cloudinary.uploader.upload(
        req.files.avatar.tempFilePath,
        {
          folder: "avatars",
          width: 150,
          crop: "scale",
        }
      );

      newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      newUserData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });
  }
);


// Get All Users -- Admin
export const getAllUsersList = handleAsync(
  async(req, res, next) => {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    })
  }
)

// Get Single User Details -- Admin
export const getSingleUserDetails = handleAsync(
  async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
      return next(new HandleError(`User does not exist with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      user,
    })
  }
)

// Admin Update User Role
export const updateUserRole = handleAsync(
  async(req, res, next) => {
    const {role} = req.body;
    const updateUserData = {
      role,
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateUserData, {
              new: true,
              runValidators: true,
    });
    if(!user){
      return next(new HandleError(`User does not exist with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      message: "User Role Updated Successfully",
      user,
    })
  }
)

// admin Delete User
export const deleteUser = handleAsync(
  async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
      return next(new HandleError(`User does not exist with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    })
  }
)