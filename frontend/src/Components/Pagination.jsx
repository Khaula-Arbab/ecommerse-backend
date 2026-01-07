import React from 'react'
import '../componentStyles/Pagination.css';
import { useSelector } from 'react-redux';
function Pagination({
    currentPage,
    onPageChange,
    activeClass = 'active',
    nextPageText = 'Next',
    prevPageText = 'Prev',
    firstPageText = 'First',
    lastPageText = 'Last',

})
   
 {
  const {totalPages, products} = useSelector((state)    => state.product)
   if(products.length === 0 || totalPages <=1) return null
  //  Get page numbers
    const getPageNumbers = () => {
      const pageNumbers = [];
      const pageWindow = 2;
      for (let i = Math.max(1, currentPage - pageWindow);
       i <= Math.min( totalPages, currentPage + pageWindow ); i++) {
        pageNumbers.push(i);
      }        
      return pageNumbers;
    }
    
   return (
       <div className='pagination'>
        {/* Previous and first buttons */}
        {
          currentPage > 1 && (
            <>
            <button onClick={() => onPageChange(1)}
              className='pagination-btn'>{firstPageText}</button>
            <button onClick={() => onPageChange(currentPage - 1)}
              className='pagination-btn'>{prevPageText}</button>  
            </>
          )
        }

        {/*  Display page numbers */}

        { getPageNumbers().map((number) => (
          <button key={number}
            onClick={() => onPageChange(number)}
            className={`pagination-btn ${number === currentPage ? activeClass : ''}`}>
            {number}
          </button>
        ))
}




         {/* Next and last buttons */}
         {
          currentPage < totalPages && (
            <>
            <button onClick={() => onPageChange(currentPage + 1)}
              className='pagination-btn'>{nextPageText}</button>
            <button onClick={() => onPageChange(totalPages)}
              className='pagination-btn'>{lastPageText}</button>  
            </>
          )
        }
         </div>
  )
}

export default Pagination