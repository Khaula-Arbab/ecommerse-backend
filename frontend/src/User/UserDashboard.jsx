import React from 'react'
import '../UserStyles/UserDashboard.css'
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout, removeSuccess } from '../Features-temp/user/userSlice'
import { toast } from 'react-toastify'

function UserDashboard({user}) {
  const navigate=useNavigate();
  const [menuVisible, setMenuVisible] = React.useState(false);
const options=[
  {name:"Oders", funcName:orders},
  {name:"Profile", funcName:profile},
  {name:"Logout", funcName:logoutUser},
]
const dispatch = useDispatch();
if(user.role === 'admin'){
  options.unshift({name:"Admin Dashboard", funcName:dashboard})
}

function orders(){
  navigate('/orders/user')
}
function profile(){
  navigate('/profile')
}
function logoutUser(){
  dispatch(logout())
  .unwrap()
  .then(()=> {
    toast.success("Logout successful", {position: 'top-center', autoClose:3000});
    dispatch(removeSuccess());
    navigate('/login')
  })
  .catch((error) => {
    toast.error(error, {position: 'top-center', autoClose:3000});
  });

}
function dashboard(){
  navigate('/admin/dashboard')
}
function toggleMenu() {
  setMenuVisible(!menuVisible);
}
  return (
    <>
    <div className={ `overlay ${menuVisible ? 'show' : ''}`}> </div>
    <div  className='dashboard-container'>
      <div className="profile-header" onClick={toggleMenu}>
      <img src={user.avatar.url?user.avatar.url:'/images/profile.png'} alt='Profile-picture'
      className='profile-avatar'></img>
      <span className="profile-name">{user.name || "User"}</span>
      </div>
     {menuVisible && (<div className="menu-options">
        {options.map((option) => (
          <button className="menu-option-btn" key={option.name} onClick={option.funcName}>
            {option.name}
          </button>
        ))}
      </div>)}
      
    </div>

  </>
  )
}

export default UserDashboard