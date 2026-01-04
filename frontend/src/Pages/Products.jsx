import React from "react"
import '../pageStyles/Products.css';
import PageTitle from "../Components/PageTitle";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import Product from "../Components/Product";
import { getProduct } from "../Features/Products/productSlice";
import Loader from "../Components/Loader";

function Products(){
  const {error, loading, products} = useSelector(state => state.product)
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getProduct());
  },[dispatch]);

  React.useEffect(()=>{
     if(error){
        toast.error(error.message, {position: 'top-center', autoClose:3000});
        dispatch(removeErrors());
     }
  },[dispatch, error]);

  return(
  <>
          {loading ? (<Loader />):( <>
    <PageTitle title="All Products - NovaMart"/>
    <Navbar />
    <div className="products-layout">
      <div className="filter-section">
        <h3 className="filter-heading">
          CATEGORIES
        </h3>
        {/* Render categories */}
      </div>

      <div className="products-section">
        <div className="products-product-container">
          {
            products.map((product) => 
             ( <Product key={product._id} product={product} />)
            )
          }
        </div>
      
      </div>
    </div>
    <Footer />
          </>)}
  </>
  )
}

export default Products;