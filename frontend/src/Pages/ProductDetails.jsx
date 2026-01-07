import React from 'react';
import "../pageStyles/ProductDetails.css";
import PageTitle from '../Components/PageTitle.jsx';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Rating from '../Components/Rating.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProductDetails, removeErrors} from '../Features-temp/Products/productSlice.js';
import { toast } from 'react-toastify';
import Loader from '../Components/Loader.jsx';
import { removeMessage, addItemsToCart } from '../Features-temp/cart/cartSlice.js';

function ProductDetails(){
  const  [userRating, setUserRating] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const increaseQuantity = () => {
    if(quantity >= product.stock){
       toast.error("Cannot exceed available stock", {position: 'top-center', autoClose:3000});
       dispatch(removeErrors());
       return;
    }
    setQuantity(quantity + 1);
  }
  const decreaseQuantity = () => {
    if(quantity <= 1){
      toast.error("Cannot be less than 1 ", {position: 'top-center', autoClose:3000});
      dispatch(removeErrors());
      return;
    }
    setQuantity(quantity - 1);  
  }

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  }
  const {loading, error, product}= useSelector(state => state.product);
  const {loading: cartLoading, error: cartError, success, message} = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const {id} = useParams();
  React.useEffect(() => {
    if(id){
       dispatch(getProductDetails(id));
    }
    return () => {
      dispatch(removeErrors())
    }
  }, [dispatch, id]);
  

  React.useEffect(()=>{
    if(error){
       toast.error(error.message, {position: 'top-center', autoClose:3000});
       dispatch(removeErrors());
    }
    if(cartError){
      toast.error(cartError, {position: 'top-center', autoClose:3000});
     
   }
 },[dispatch, error, cartError]);

 React.useEffect(()=>{
  if(success){
     toast.success(message, {position: 'top-center', autoClose:3000});
     dispatch(removeMessage());
  }
 
},[dispatch, message, success]);


 if(loading){
    return 
         <>
          <Navbar />
          <Loader />
          <Footer />
         </>
       }
       if(error || !product){
        return(
          <>
          <PageTitle  title="Product Details"/>
          <Navbar />
         
          <Footer />
          </>
        )
       }
       const addToCart = () => {
          dispatch(addItemsToCart({id: product._id, quantity}));
       }
  return(
      <>
      <PageTitle  title={`${product.name} - Details`}/>
      <Navbar />
      <div className="product-details-container">

         <div className="product-detail-container">

            <div className="product-image-container">
                  <img src={product.image[0].url.replace('./', '/')} alt={product.name} className='product-detail-image'/>
          </div>

           <div className="product-info">
              <h2>{product.name}</h2>
              <p className="product-description">
                {product.description}
              </p>
              <p className="product-price"><strong>{product.price}</strong>/-</p>
              <div className="product-rating">
                   <Rating 
                    value = {product.ratings}
                    disabled = {true}/>
                  <span className="productCardSpan">
                  {`(${product.numOfReviews} ${product.numOfReviews === 1 ? "Review" : "Reviews"})`}
                 </span>
              </div>

              <div className="stock-status">
                  <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                {product.stock > 0 ?  `In Stock (${product.stock} available) `: 'Out of Stock'}
                  </span>
              </div>

          {  product.stock > 0 && ( <> <div className="quantity-controls">
                <span className="quantity-label">Quantity:</span>
                <button className="quantity-button" 
                onClick={decreaseQuantity}>-</button>
                <input type="text" className="quantity-value" value={quantity} readOnly/>
                <button className="quantity-button" onClick={increaseQuantity}>+</button>
              </div>
            <button className="add-to-cart-btn"
             onClick={addToCart}
             disabled={cartLoading}>{cartLoading? 'Adding' : 'Add to Cart'}</button>
            </>)}


            <form className="review-form">
              <h3>Submit Your Review</h3>
              
                <Rating 
                  value={0}
                  disabled={false}
                  onRatingChange={handleRatingChange}/>
                <textarea 
                  className="review-input" 
                  placeholder="Write your review here...">
                </textarea>
              <button type="submit" className="submit-review-btn">Submit Review</button>
            </form>
          </div>
        </div>
      </div>

      <div className="reviews-container">
        <h3>Customer Reviews</h3>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="reviews-section">

         { product.reviews.map((review, index) => (
          <div className="review-item" key={index}>
            <div className="review-header">
              <Rating 
                value={review.rating}
                disabled={true}/>
            </div>
            <p className="review-comment">{review.comment}</p>
            <p className="reviewier-name">
              By {review.name}
            </p>
          </div>))}

        </div>) :
        (<p className="no-reviews">No reviews yet. Be the first to review this product!</p>)
        }

      </div>
      <Footer />
      </> 
  )
}

export default ProductDetails;