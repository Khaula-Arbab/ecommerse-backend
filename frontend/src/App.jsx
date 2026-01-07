import React, { useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home.jsx';
import ProductDetails from './Pages/ProductDetails.jsx';
import Products from './Pages/Products.jsx';
import Cart from './CartComponent/Cart.jsx';
import Register from './User/Register.jsx';
import Login from './User/Login.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from './Features-temp/user/userSlice.js';
import UserDashboard from './User/UserDashboard.jsx';

function App(){
  const {isAuthenticated, user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
     if(isAuthenticated){
      dispatch(loadUser())
     }
  },[ dispatch]);
  return(
   <Router>
     <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/product/:id' element={<ProductDetails />}/>
        <Route path='/products' element={<Products />}/>
        <Route path='/products/:keyword' element={<Products />}/>
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      
     </Routes>
     {isAuthenticated && <UserDashboard  user={user}/>}
   </Router>
  )
}
export default App;