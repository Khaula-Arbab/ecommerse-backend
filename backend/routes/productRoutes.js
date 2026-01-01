import express from 'express';
import { createProducts, getAllProducts, updateProduct, deleteProduct, getSingleProduct } from '../controller/productControuller.js';
 import { verifyUserAuth, roleBasedAuth } from '../middleware/userAuth.js';

 const router = express.Router();

//  Route to get all products 
 router.route('/products')
 .get(verifyUserAuth, getAllProducts)
 .post(verifyUserAuth, roleBasedAuth("admin"), createProducts);

// Route to update, delete and get single product by id
 router.route('/product/:id')
 .put(verifyUserAuth, roleBasedAuth("admin"), updateProduct)
 .delete(verifyUserAuth, roleBasedAuth("admin"), deleteProduct)
 .get(verifyUserAuth,getSingleProduct)

export default router; 
