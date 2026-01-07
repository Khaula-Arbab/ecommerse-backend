
import  React from 'react'
import { useSelector } from 'react-redux';
import Loader from './Loader';
import { Navigate } from 'react-router-dom';

function ProtectedRoutes({element}){
  const {loading, isAuthenticated} = useSelector(state => state.user)
  if(loading)
    return <Loader />
    if(!isAuthenticated)
      return <Navigate to ='/login' ></Navigate>
  return element

  
}
export default ProtectedRoutes;