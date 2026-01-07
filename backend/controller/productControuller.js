import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsync from "../middleware/handleAsync.js";
import APIFunctionality from "../utils/apiFunctionality.js";

// Create Product -- Admin
export const createProducts = handleAsync(
    async(req, res, next) => {
        req.body.user = req.user.id;
       
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

// Get All Products for Admin
export const getAdminProducts = handleAsync(async(req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    })
})

// creating and updating product reviews
export const createProductReview = handleAsync(async(req, res, next) => {
    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);
    if(!product){
        return next(new HandleError("Product not found", 404));
    }

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user.id.toString()
    );

    if(isReviewed){
        product.reviews.forEach((rev) => {
            if(rev.user.toString() === req.user.id.toString()){
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
        
    }
    product.numOfReviews = product.reviews.length;
     // calculating average ratings
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = product.reviews.length > 0 ? avg / product.reviews.length : 0;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        product,
    });
})


// getting all reviews of a product
export const getProductReviews = handleAsync(async(req, res, next) => {
     const product = await Product.findById(req.query.id);
        if(!product){
            return next(new HandleError("Product not found", 404));
        }
        res.status(200).json({
            success: true,
            reviews: product.reviews,
        });

})

// Delete Review
 export const deleteReview = handleAsync(async(req, res, next) => {  
     const product = await Product.findById(req.query.productId);
        if(!product){
            return next(new HandleError("Product not found", 404));
        }
        const reviews = product.reviews.filter(
            (rev) => rev._id.toString() !== req.query.id.toString()
        );
        let avg = 0;
        reviews.forEach((rev) => {
            avg += rev.rating;
        });
        const ratings = reviews.length > 0 ? avg / reviews.length : 0;
        const numOfReviews = reviews.length;
        await Product.findByIdAndUpdate(req.query.productId, {
            reviews,
            ratings,
            numOfReviews,
        }, {
            new: true,
            runValidators: true,
            // useFindAndModify: false,
        });
        res.status(200).json({
            success: true,
        });
 }) 