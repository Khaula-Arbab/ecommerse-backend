import express from 'express';
 import { verifyUserAuth, roleBasedAuth } from '../middleware/userAuth.js';
  import { createNewOrder } from '../controller/orderController.js';

 const router = express.Router();

 router.route('/new/order').post(verifyUserAuth, createNewOrder);

 export default router;