import React, { useState, useEffect } from 'react'
import "../UserStyles/Form.css"
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { register, removeSuccess } from '../Features-temp/user/userSlice'
import { removeErrors } from '../Features-temp/user/userSlice'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [avatar, setAvatar] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('./images/profile.png')
  const {name, email, password} = user
  const {success,loading,error} = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    if(error){
       toast.error(error, {position: 'top-center', autoClose:3000});
       dispatch(removeErrors());
    }
 },[dispatch, error]);
 React.useEffect(()=>{
  if(success){
     toast.success("User registered successfully", {position: 'top-center', autoClose:3000});
     dispatch(removeSuccess());
     navigate('/login')
  }
},[dispatch, success]);

  // const registerDataChange = (e) => {
  //   if(e.target.name === 'avatar'){
  //     const reader = new FileReader()
  //     reader.onload = () => {
  //       if(reader.readyState === 2){
  //         setAvatarPreview(reader.result)
  //         setAvatar(reader.result)
  //       }
  //     }
  //     reader.readAsDataURL(e.target.files[0])
  //   }else{
  //     setUser({...user, [e.target.name]: e.target.value})
  //   }
  // }

  const registerDataChange = (e) => {
    if(e.target.name === 'avatar'){
      const file = e.target.files[0]; // Get the ACTUAL File object
      
      if(file){
        // Create preview (base64 for display)
        const reader = new FileReader();
        reader.onload = () => {
          if(reader.readyState === 2){
            setAvatarPreview(reader.result);
          }
        };
        reader.readAsDataURL(file);
        
        // Store the ACTUAL File object, NOT the base64 string
        setAvatar(file); // THIS IS THE CRITICAL CHANGE!
      }
    } else {
      setUser({...user, [e.target.name]: e.target.value});
    }
  }
  const registerSubmit = (e) => {
       e.preventDefault();
       if(!name || !email || !password || !avatar){
        toast.error("Please fill out all the fields", {position: 'top-center', autoClose:3000});
        return ;
       }

       
      // const myForm = new FormData();
      // myForm.set('name', name);
      // myForm.set('email', email);
      // myForm.set('password', password);
      // myForm.set('avatar', avatar);
      // console.log(myForm.entries());
      // for(let pair of myForm.entries()){
      
      // }
      const myForm = new FormData();
      myForm.append('name', name);
  myForm.append('email', email);
  myForm.append('password', password);
  myForm.append('avatar', avatar);
  
  console.log("Sending form data:");
  // For debugging - check what's in FormData
  for(let pair of myForm.entries()){
    console.log(pair[0], pair[1]);
  }
      dispatch(register(myForm))
     
  }
  return (
     <div className="form-container container">
      <div className="form-content">
        <form  className="form"
        onSubmit={registerSubmit}
        encType='multipart/form-data'>
          <h2>Sign Up</h2>
          <div className="input-group">
            <input type="text" placeholder="Username"  name='name' value={name}
            onChange={registerDataChange}/>
          </div>
          <div className="input-group">
            <input type="email" placeholder="Email"  name='email' value={email}
            onChange={registerDataChange}/>
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password"  name='password' value={password} onChange={registerDataChange}/>
          </div>
          <div className="input-group avatar-group">
            <input type="file"  name='avatar' className='file-input'
            accept='image/*' onChange={registerDataChange}/>
           <img src={avatarPreview} alt="avatar preview" className='avatar' ></img>
          </div>

          <button type="submit" className='authBtn'>{loading ? "signing up" : "Sign Up"}</button>
          <p className="form-links">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
     </div>
  )
}

export default Register