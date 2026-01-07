import React from 'react';
import { toast } from 'react-toastify';
 import { addItemsToCart, removeErrors, removeItemFromCart, removeMessage } from '../Features-temp/cart/cartSlice';
 import { useDispatch, useSelector } from 'react-redux';

 

function CartItem({item}){

  const [quantity,setQuantity] = React.useState(item.quantity);
  const dispatch = useDispatch();
  const {success, error, loading, cartItems, message} = useSelector((state) => state.cart);
 

  const increaseQuantity = () => {
    if(quantity >= item.stock){
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
  const handleUpdate = () => {
    if(loading) return;
    // Dispatch update action here
    if(quantity !== item.quantity){
      dispatch(addItemsToCart({id: item.product, quantity}));
    }
  }

  const handleRemove = ()=>{
    if(loading) return
    dispatch(removeItemFromCart(item.product))
    if(success){
      toast.success("Item removed from cart successfully", {position: 'top-center', autoClose:3000, toastId:'cart-update'});
      dispatch(removeMessage());
   }
  }

  React.useEffect(()=>{
    if(error){
       toast.error(error.message, {position: 'top-center', autoClose:3000});
       dispatch(removeErrors());
    }
 },[dispatch, error]);

 React.useEffect(()=>{
  if(success){
     toast.success(message, {position: 'top-center', autoClose:3000, toastId:'cart-update'});
     dispatch(removeMessage());
  }
 
},[dispatch, message, success]);

  return(
    <>
      <div className="cart-item">
<div className="item-info">
  <img src={item.image} alt={item.name} className="item-image" />
  <div className="item-details">
   <h3 className='item-name'>{item.name}</h3>
    <p className="item-price"><strong>Price: </strong>{item.price}/-</p>
    <p className="item-quantity">
      <strong>Quantity: </strong>{item.quantity.toFixed(2)}
    </p>
  </div>
</div>

<div className="quantity-controls">
  <button className="quantity-button decrease-btn"
    onClick={decreaseQuantity}>-</button>
  <input type="text" className="quantity-input" value={quantity} readOnly />
  <button className="quantity-button increase-btn"
  onClick={increaseQuantity}>+</button>
</div>

 <div className="item-total">
  <span className="item-total-price">{(item.price*item.quantity).toFixed(2)}/-</span>
 </div>

  <div className="item-actions">
    <button className="update-item-btn"
    onClick={handleUpdate} disabled={loading || quantity === item.quantity}>
      {loading ? "Updating" : 'Update'}</button>
    <button className="remove-item-btn"
    onClick={handleRemove}
     disabled={loading}
    >Remove</button> 
  </div>
</div>
    </>
  )
}

export default CartItem;

