import express from 'express';
import { createProducts, getAllProducts, updateProduct, deleteProduct, getSingleProduct } from '../controller/productControuller.js';
// import { verifyUserAuth } from '../middleware/userAuth.js';
// import { roleBasedAuth } from '../middleware/userAuth.js';
 const router = express.Router();

//  Route to get all products 
 router.route('/products')
 .get(getAllProducts)
 .post( createProducts);

// Route to update, delete and get single product by id
 router.route('/product/:id')
 .put(updateProduct)
 .delete(deleteProduct)
 .get(getSingleProduct)

export default router; 