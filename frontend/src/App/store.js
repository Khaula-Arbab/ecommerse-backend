import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../Features-temp/Products/productSlice";
import cartReducer from "../Features-temp/cart/cartSlice";
import userReducer from "../Features-temp/user/userSlice";
export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    user: userReducer,
  },
});
