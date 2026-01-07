import express from "express";
import { registerUser, loginUser, logoutUser, requestPasswordReset, resetPassword, getUserDetails, updatePassword, updateUserProfile, getAllUsersList, getSingleUserDetails, updateUserRole, deleteUser } from "../controller/userController.js";
import { roleBasedAuth, verifyUserAuth } from "../middleware/userAuth.js";
//  import { upload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/password/forgot").post(requestPasswordReset);
router.route("/reset/:token").post(resetPassword);
router.route('/profile').get(verifyUserAuth, getUserDetails);
router.route('/password/update').post(verifyUserAuth, updatePassword);
router.route('/profile/update').post(verifyUserAuth, updateUserProfile);
router.route('/admin/users').get(verifyUserAuth, roleBasedAuth("admin"),getAllUsersList);
router.route('/admin/user/:id').get(verifyUserAuth, roleBasedAuth("admin"),getSingleUserDetails)
.put(verifyUserAuth, roleBasedAuth("admin"), updateUserRole)
.delete(verifyUserAuth, roleBasedAuth("admin"), deleteUser);
export default router; 