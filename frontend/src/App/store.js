import { configureStore} from "@reduxjs/toolkit";
import productReducer from "../Features/Products/productSlice";

export const store = configureStore({
  reducer:{
    product: productReducer,
  }
})