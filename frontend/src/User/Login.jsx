import React from 'react';
import { useState, useEffect } from 'react';
import '../UserStyles/Form.css'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../Features-temp/user/userSlice';
import { toast } from 'react-toastify';
import { removeErrors, removeSuccess } from '../Features-temp/user/userSlice';

import { useNavigate } from 'react-router-dom';


function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const {success,loading,error, isAuthenticated} = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login({email: loginEmail, password: loginPassword}));

  } 
  useEffect(()=>{
    if(error){
       toast.error(error, {position: 'top-center', autoClose:3000});
       dispatch(removeErrors());
    }
 },[dispatch, error]);
useEffect(()=>{
  if(success){
     toast.success("User registered successfully", {position: 'top-center', autoClose:3000});
     dispatch(removeSuccess());
    
  }
},[dispatch, success]);


  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);
 
  
  return (
    <div className="form-container container">
      <div className="form-content">
        <form  className="form"
        onSubmit={loginSubmit}>
          <div className="input-group">
            <input type="text" placeholder="Email" 
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}/>
          </div>

          <div className="input-group">
            <input type="password" placeholder="Password" 
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}/>
          </div>

          <button type="submit" className='authBtn'>Sign In</button>
          <p className="form-links">
            Forgot Your Password? <Link to="/password/forgot">Reset Password</Link>
          </p>
          <p className="form-links">
            Don't have an account? <Link to="/register">Sign Up Here</Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default Login