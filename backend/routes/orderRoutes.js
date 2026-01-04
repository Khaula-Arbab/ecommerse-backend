import express from 'express';
 import { verifyUserAuth, roleBasedAuth } from '../middleware/userAuth.js';
  import { createNewOrder, deleteOrder, getAllMyOrders, getAllOrders, getSingleOrder, updateOrderStatus } from '../controller/orderController.js';

 const router = express.Router();

 router.route('/new/order').post(verifyUserAuth, createNewOrder);
 router.route('/admin/order/:id').get(verifyUserAuth,  roleBasedAuth("admin"), getSingleOrder).put(verifyUserAuth,  roleBasedAuth("admin"), updateOrderStatus)
 .delete(verifyUserAuth,  roleBasedAuth("admin"), deleteOrder);
 router.route('/admin/orders').get(verifyUserAuth,  roleBasedAuth("admin"), getAllOrders);
 router.route('/orders/user').get(verifyUserAuth, getAllMyOrders);

 export default router;