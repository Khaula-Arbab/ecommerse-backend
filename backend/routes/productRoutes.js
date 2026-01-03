import express from 'express';
import { createProducts, getAllProducts, updateProduct, deleteProduct, getSingleProduct, getAdminProducts, createProductReview, getProductReviews, deleteReview } from '../controller/productControuller.js';
 import { verifyUserAuth, roleBasedAuth } from '../middleware/userAuth.js';

 const router = express.Router();

//  Route to get all products for users
 router.route('/products')
 .get(getAllProducts);

//  get all products for admin
router.route('/admin/products')
 .get(verifyUserAuth, roleBasedAuth("admin"), getAdminProducts);

// Route to create new product
 router.route('/admin/product/create')
 .post(verifyUserAuth, roleBasedAuth("admin"), createProducts);

// Route to update, delete and get single product by id
 router.route('/admin/product/:id')
 .put(verifyUserAuth, roleBasedAuth("admin"), updateProduct)
 .delete(verifyUserAuth, roleBasedAuth("admin"), deleteProduct)
 router.route('/product/:id')
 .get(getSingleProduct)

//  router for reviews
router.route('/review')
 .put(verifyUserAuth, createProductReview)

 router.route('/reviews')
 .get(getProductReviews).delete(verifyUserAuth,  deleteReview);
export default router; 
