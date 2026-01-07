import "../UserStyles/Form.css"
import React from "react";
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import { updateProfile } from '../Features-temp/user/userSlice';
import { removeErrors, removeSuccess } from '../Features-temp/user/userSlice';


function UpdateProfile(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/profile.png");
  const {user, error, success, message, loading} = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileImageUpdate = (e) => {
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
    } 
  }

  

  const updateSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
      myForm.append('name', name);
  myForm.append('email', email);
  myForm.append('avatar', avatar);
  dispatch(updateProfile(myForm));
  }
  useEffect(()=>{
    if(error){
       toast.error(error.message, {position: 'top-center', autoClose:3000});
       dispatch(removeErrors());
    }
 },[dispatch, error]);

 React.useEffect(()=>{
  if(success){
     toast.success(message, {position: 'top-center', autoClose:3000});
     dispatch(removeSuccess());
     navigate('/profile')
  }
},[dispatch, success]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }
  }, [user]);

  return(
    <>
    <Navbar />
    <div className="container update-container">
      <div className="form-content">
        <form  className="form"
           encType='multipart/form-data'
           onSubmit={updateSubmit}>
            
          <h2>Update Profile</h2>
          <div className="input-group avatar-group">
            <input className='file-input'
            type='file'
            onChange={profileImageUpdate}
            accept="image/*"
            name="avatar"></input> 
            <img src={avatarPreview} alt="User Profile" className="avatar"></img>
          </div>

          <div className="input-group">
            <input type="text" placeholder="Name"
            value={name}
            name="name"
            onChange = {(e) => setName(e.target.value)}></input>
          </div>

          <div className="input-group">
            <input type="email" placeholder="Email"
            value={email}
            name="email"
            onChange = {(e) => setEmail(e.target.value)}></input>
          </div>
          <button type="submit"
          className="authBtn">Update</button>
        </form>
      </div>
    </div>
    <Footer />
    </>
  )
}
export default UpdateProfile;