import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


export const getProduct = createAsyncThunk('product/getProduct', async({keyword, page=1, category}, {rejectWithValue}) => {
   try{

      let link = '/api/v1/products?page='+page;
      if(category){
         link += `&category=${category}`
      }
     if(keyword){
        link += `&keyword=${keyword}`
     }
      const {data} = await axios.get(link);
      return data;
   }catch(error){
      return rejectWithValue(error.response?.data || "An error occurred");
   }
});

export const getProductDetails = createAsyncThunk('product/getProductDetails', async(id, {rejectWithValue}) => {
   try{
      const link = `/api/v1/product/${id}`;
      const {data} = await axios.get(link);
      return data;
   }catch(error){
      return rejectWithValue(error.response?.data || "An error occurred");
   }
});
const productSlice = createSlice({
   name: "product",
   initialState:{
      products:[],
      productCount:0,
      loading:false,
      error:null,
      product:null,
      resPerPage:3,
      totalPages:0

   },
   reducers:{
    removeErrors:(state) => {
      state.error = null;
    }
   }, 
   extraReducers:(builder) => {
      builder.addCase(getProduct.pending, (state) => {
         state.loading = true;
         state.error = null;
      });
      builder.addCase(getProduct.fulfilled, (state, action) => {
         state.loading = false;
         state.products = action.payload.products;
         state.productCount = action.payload.productCount;
         state.error = null;
         state.resPerPage = action.payload.resPerPage;
         state.totalPages = action.payload.totalPages
      });
      builder.addCase(getProduct.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload || "Failed to fetch products";
         state.products = [];
      });


      // get product details
      builder.addCase(getProductDetails.pending, (state) => {
         state.loading = true;
         state.error = null;
      });
      builder.addCase(getProductDetails.fulfilled, (state, action) => {
         state.loading = false;
         state.product = action.payload.product;
         state.error = null;
      });
      builder.addCase(getProductDetails.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload || "Failed to fetch products";
      });

   }

})

export const {removeErrors} = productSlice.actions;

export default productSlice.reducer;