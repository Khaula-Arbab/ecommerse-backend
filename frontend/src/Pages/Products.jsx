import React from "react"
import '../pageStyles/Products.css';
import PageTitle from "../Components/PageTitle";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import Product from "../Components/Product";
import { getProduct } from "../Features-temp/Products/productSlice";
import Loader from "../Components/Loader";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { removeErrors } from "../Features-temp/Products/productSlice";
import NoProduct from "../Components/NoProduct";
import Pagination from "../Components/Pagination";
import { useNavigate } from "react-router-dom";

function Products(){
  const {error, loading, products, resPerPage, totalPages, productCount} = useSelector(state => state.product)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword');
  const category = searchParams.get('category');
  const pageFormUrl = parseInt(searchParams.get('page'),10)||1;
  const [currentPage, setCurrentPage] = React.useState(pageFormUrl);
   const categories = [
    { name: "Men's Wear", slug: "menswear" },
    { name: "Women's Wear", slug: "womenwear" },
    { name: "Footwear", slug: "footwear" },
    { name: "Makeup", slug: "mackup" },
    { name: "Activewear", slug: "activewear" },
    { name: "Accessories", slug: "accessories" },
  ];


  const handleCategoryClick = (category) => () => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('category', category);
    newSearchParams.delete('page');
    navigate(`?${newSearchParams.toString()}`);
  }
  

  React.useEffect(() => {
    dispatch(getProduct({keyword, page: currentPage,category}));
  },[dispatch, keyword, currentPage, category]);

  React.useEffect(()=>{
     if(error){
        toast.error(error.message, {position: 'top-center', autoClose:3000});
        dispatch(removeErrors());
     }
  },[dispatch, error]);
  const handlePageChange = (page) => {
    if(page != currentPage){
      setCurrentPage(page);
      const newSearchParams = new URLSearchParams(location.search);
      if(page === 1){
        newSearchParams.delete('page');
      }else{
        newSearchParams.set('page', page);
      }
      navigate(`?${newSearchParams.toString()}`);
    }
  }

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
         <ul>
            {categories.map((category) => (
              <li key={category.slug} onClick={handleCategoryClick(category.slug)}>
                  {category.name}
              </li>
            ))}
         </ul>

      </div>

      <div className="products-section">
       { products.length > 0 ? (<div className="products-product-container">
          {
            products.map((product) => 
             ( <Product key={product._id} product={product} />)
            )
          }
        </div>) : <NoProduct  keyword={keyword} />}   
        <Pagination 
        currentPage={currentPage} onPageChange={handlePageChange}/>
      
      </div>
    </div>
    <Footer />
          </>)}
  </>
  )
}

export default Products;