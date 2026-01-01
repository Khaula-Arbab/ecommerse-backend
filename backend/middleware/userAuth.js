import handleAsync from "./handleAsync.js";
 import HandleError from "../utils/handleError.js";
 import User from "../models/userModel.js";
 import jwt from "jsonwebtoken";

// Verify user authentication
export const verifyUserAuth = handleAsync(async(req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return next(new HandleError("Authentication is missing. Please login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
}) 

// user Authorization
export const roleBasedAuth = (...roles) => {
    return(req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new HandleError(`Role - ${req.user.role} is not allowed to access this resource`, 403));
        }
       next();
    } 
}  