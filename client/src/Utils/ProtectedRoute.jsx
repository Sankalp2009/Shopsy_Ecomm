
import React from 'react'
import {useSelector} from "react-redux"
import {Navigate} from "react-router"

function ProtectedRoute({children}) {

 const {access_token, IsAuth}= useSelector(state => state.auth)

 if(!access_token && !IsAuth) return <Navigate to="/signin" replace={true} />

  return children
}

export default ProtectedRoute