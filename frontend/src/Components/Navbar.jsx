import React from "react";
import { useState } from "react";
import '../componentStyles/Navbar.css';
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import '../pageStyles/Search.css';

function Navbar(){
  const [ismenuOpen, setMenuOpen] = useState(false);
  const[isSearchOpen, setIsSearchOpen] = useState(false);
  const[searchQuery, setSearchQuery] = useState("");
  const toggleSearch = ()=>setIsSearchOpen(!isSearchOpen)
  const toggleMenu = () => setMenuOpen(!ismenuOpen);
  const {isAuthenticated} = useSelector(state => state.user); // Replace with actual authentication logic
  const {cartItems} = useSelector(state => state.cart)
  const navigate = useNavigate();
  const handleSearchSubmit = (e) =>{
     e.preventDefault();
     if(searchQuery.trim()){
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
     }else{
      navigate('/products')
     }
     setSearchQuery('')
  }
  return(
    <nav className="navbar">
      <div className="navbar-container">
        {/* Navbar logo */}
             <div className='navbar-logo' >
          <Link to="/" 
          onClick={()=>setMenuOpen(false)}>NovaMart</Link>
             </div>
        {/* Navbar links */}
             <div className={`navbar-links ${ismenuOpen? "active": ""}`}>
          <ul>
            <li>
              <Link to="/" onClick={()=>setMenuOpen(false)}>Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
             </div>
             {/*navbar icons  */}
              <div className="navbar-icons">
                <div className="search-container">
                  <form className={`search-form ${isSearchOpen ? 'active' : ''}` }
                  onSubmit={handleSearchSubmit}>
                    <input type="text"
                     placeholder="Search..."
                      className="search-input"
                      value ={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}/>
                    <button type="button"
                     className="search-icon"
                     onClick={toggleSearch}>
                       <SearchIcon focusable="false"/>
                    </button>
                  </form>
                </div>
                  {/* cart-container */}
                <div className="cart-container">
              <Link to='/cart'>
                <ShoppingCartIcon  className="icon"/>
                <span className="cart-badge">{cartItems.length}</span>
              </Link>
                </div>
                {!isAuthenticated && <Link to='/register' className="register-link">
                  <PersonAddIcon  className="icon"/>
                </Link>}
                <div className="navbar-hamburger" onClick={toggleMenu}>
                  {ismenuOpen? <CloseIcon className="icon"/>:
                  <MenuIcon className="icon"/>} 
                </div>
              </div>
      </div>
    </nav>
  )
}
export default Navbar;