import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import handleAsync from "../middleware/handleAsync.js";
import User from "../models/userModel.js";
 import HandleError from "../utils/handleError.js";

// Create new order
export const createNewOrder = handleAsync(
  async(req, res, next) => {
     const {
      orderItems,
      shippingInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
     } = req.body;

     const order = await Order.create({
      orderItems,
      shippingInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: req.user._id,
     });

     res.status(201).json({
      success: true,
      order,
     });
  }
)