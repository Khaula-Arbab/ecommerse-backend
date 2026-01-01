import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsync from "../middleware/handleAsync.js";
import APIFunctionality from "../utils/apiFunctionality.js";

// Create Product -- Admin
export const createProducts = handleAsync(
    async(req, res, next) => {
        console.log(req.body);
        const product =  await Product.create(req.body);
        res.status(201).json({
            success: true,
            product,
        })
    }
) 

// Get All Products
export const getAllProducts = handleAsync(async(req, res, next) => {
    const resPerPage = 3;
    const apiFeatures = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter()
    //Getting Filtered query before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productsCount = await filteredQuery.countDocuments();

    // Calculting total pages based on filtered count 
     const totalPages = Math.ceil(productsCount / resPerPage);
     const page = Number(req.query.page) || 1;
     if(page > totalPages && productsCount > 0){
        return next(new HandleError("Page not found", 404));
     }

    // Applying Pagination
    apiFeatures.pagination(resPerPage);
     
    const products = await apiFeatures.query;
    if(!products || products.length === 0){
        return next(new HandleError("No products found", 404));
    }
    res.status(200).json({
        success: true,
        products,
        productsCount,
        resPerPage,
        totalPages,
        currentPage: page,
    })
})

// Update Product -- Admin
export const updateProduct = handleAsync(async(req, res, next) => {
   
    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{
          new: true,
          runValidators: true,
  
      });
      if(!product){
          return next(new HandleError("Product not found", 404));
      }
      res.status(200).json({
          success: true,
          product,
      })
  })

// DELETE Product -- Admin
export const deleteProduct = handleAsync(async(req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
     if(!product){
         return next(new HandleError("Product not found", 404));
     }
     res.status(200).json({
         success: true,
         message: "Product Deleted Successfully",
     })
 
 })

// ASSECING SINGLE PRODUCT DETAILS
export const getSingleProduct = handleAsync( async(req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product,
    })
})
