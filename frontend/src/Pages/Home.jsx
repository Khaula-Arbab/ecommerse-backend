import React from 'react';
import Footer from '../Components/Footer.jsx'; 
import '../pageStyles/Home.css'; 
import Navbar from '../Components/Navbar.jsx';
import ImageSlider from '../Components/imageSlider.jsx';
import Product from '../Components/Product.jsx';
import PageTitle from '../Components/PageTitle.jsx';

function Home(){
  const products=[
    1,2,3,4,5,6,7,8,9,10
  ]
  return(
    <>
    <PageTitle  title="Home-NovaMart"/>
    <Navbar />
    <ImageSlider />
    <div className="home-container">
       <h2 className="home-heading">Trending Now</h2>
       <div className="home-product-container">
        {products.map((product, index) => (
          <Product 
          product = {product} key={index}/>
        ))}
       </div>
    </div>
    <Footer />
    </>
  )
}
export default Home;
