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

// Get single order
export const getSingleOrder = handleAsync(
  async(req, res, next) => {
     const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
     );

     if(!order){
      return next(new HandleError("Order not found with this id", 404));
     }

     res.status(200).json({
      success: true,
      order,
     });
  }
)

// Get all my orders
export const getAllMyOrders = handleAsync(
  async(req, res, next) => {
     const orders = await Order.find({ user: req.user._id });
     if(orders.length === 0){
      return next(new HandleError("You have no orders yet", 404));
     }
     res.status(200).json({
      success: true,
      orders,
     });
  }
)

// Get all orders -- Admin
export const getAllOrders = handleAsync(
  async(req, res, next) => {
     const orders = await Order.find();

     let totalAmount = 0;
     orders.forEach((order) => {
      totalAmount += order.totalPrice;
     });

     res.status(200).json({
      success: true,
      totalAmount,
      orders,
     });
  }
)

// Update order status -- Admin
export const updateOrderStatus = handleAsync(
  async(req, res, next) => {
      const order = await Order.findById(req.params.id);
  
      if(!order){
        return next(new HandleError("Order not found with this id", 404));
      }
  
      if(order.orderStatus === "Delivered"){ 
        return next(new HandleError("This order is already delivered", 400));
      }
  
      order.orderItems.forEach(async(item) => {
        await updateStock(item.product, item.quantity);
      });
      await Promise.all(order.orderItems.map((item) => {
           updateQuantity(item.product, item.quantity);         
      }),
    )
  
      order.orderStatus = req.body.status;
  
      if(order.orderStatus === "Delivered"){
        order.deliveredAt = Date.now();
      }
  
      await order.save({ validateBeforeSave: false });
  
      res.status(200).json({
        success: true,
      });
  })
  async function updateQuantity(id, quantity){
    const product = await Product.findById(id);
    if(product){
      return next(new HandleError("Product not found", 400));
    }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }

  // Delete order -- Admin
  export const deleteOrder = handleAsync(
    async(req, res, next) => {
        const order = await Order.findById(req.params.id);
    
        if(!order){
          return next(new HandleError("Order not found with this id", 404));
        }
        if(order.orderStatus !== "Delivered"){
          return next(new HandleError("Only delivered orders can be deleted", 400));
        }
    
        await order.deleteOne({_id: req.params.id});
    
        res.status(200).json({
          success: true,
          message: "Order deleted successfully",
        });
    })