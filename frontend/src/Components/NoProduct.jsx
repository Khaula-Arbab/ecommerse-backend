import React from 'react';
import '../componentStyles/NoProducts.css';

function NoProduct({keyword}) {
  return (
    <div className='no-products-content'>
      <div className="no-products-icon">
        ⚠️
      </div>
      <h3 className="no-products-title">No Products Found</h3>
      <p className="no-products-message">
       {
        keyword ? `We could not find any products matching "${keyword}". Please try a different keyword.` : "No products found."
       }
      </p>
    </div>
  )
}

export default NoProduct;