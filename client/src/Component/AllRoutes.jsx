import React from "react";
import Home from "../Pages/Home.jsx";
import Login from "../Pages/Auth/Login.jsx";
import Register from "../Pages/Auth/Register.jsx";
import Product from "../Pages/Customer/Product.jsx";
import ProductDetail from "../Pages/Customer/ProductDetail.jsx";
import Checkout from "../Pages/Customer/Checkout.jsx";
import Profile from "../Pages/Customer/Profile.jsx";
import ProtectedRoute from "../Utils/ProtectedRoute.jsx";
import AdminRoute from "../Utils/AdminRoute.jsx";
import Cart from "../Pages/Customer/Cart.jsx";
import Order from '../Pages/Customer/Order.jsx'
import Admin from "../Pages/Admin.jsx";
import { Routes, Route } from "react-router";
import {useSelector} from "react-redux";
import {Navigate} from "react-router";

function AllRoutes() {

  const { user, IsAuth } = useSelector((state) => state.auth);

  return (
    <>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Auth Route Public*/}
         <Route
          path="/signin"
          element={
            IsAuth ? (
              user?.role === "admin" || user?.role === "Admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route path="/signup" element={<Register />} />

        {/* Product Route Public */}
        <Route
          path="/product"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />

        <Route
          path="/me"
          element={
            <>
              <Profile />
            </>
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        {/* Cart Routes */}
        <Route path="/cart" element={<ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }/>
        
        {/* Order page User */}
          <Route path='/order' element={<ProtectedRoute>
              <Order />
            </ProtectedRoute>} />

        {/* Checkout  */}
        <Route path="/checkout"  element={<ProtectedRoute>
              <Checkout />
            </ProtectedRoute>}/>

        {/* Admin  */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default AllRoutes;