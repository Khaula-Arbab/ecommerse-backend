import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [3, "Name should have more than 3 characters"],
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password:{
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password should be greater than 6 characters"],
        select: false,
    },
    avatar:{
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        }
    },
    role:{
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date, 
},
{timestamps: true})
// password hashing

     userSchema.pre("save", async function () {
        if (!this.isModified("password")) return;
      
        this.password = await bcryptjs.hash(this.password, 10);
      });
      
  

// JWT token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    }
    )
} 

// Compare password
userSchema.methods.verifyPassword = async function(userEnteredPassword){
    return await bcryptjs.compare(String(userEnteredPassword), this.password);
}

// Generating password reset token
userSchema.methods.getResetPasswordToken = function(){
    // generating token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    return resetToken;
}  

export default mongoose.model("User", userSchema);