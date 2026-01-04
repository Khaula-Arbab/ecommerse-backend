import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home.jsx';
import ProductDetails from './Pages/ProductDetails.jsx';
import Products from './Pages/Products.jsx';

function App(){
  return(
   <Router>
     <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/product/:id' element={<ProductDetails />}/>
        <Route path='/products' element={<Products />}/>
     </Routes>
   </Router>
  )
}
export default App;