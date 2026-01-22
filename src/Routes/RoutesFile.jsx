import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AuthWrapper from '../context/AuthWrapper'

// User Pages
import Home from '../pages/Home'
import Cart from '../pages/Cart'
import ProductDetails from '../pages/productDetails'
import Football from '../pages/Football'
import Cricket from '../pages/cricket'
import Volleyball from '../pages/VolleyBall'
import Gym from '../pages/Gym'
import Checkout from '../pages/Checkout'
import Wishlist from '../pages/Wishlist'

// Admin Pages

import Users from '../pages/Users'
import AddProduct from '../components/AddProduct'
import UpdateProduct from '../components/UpdateProduct'
import TestingDashboard from '../pages/Dashboard'
import Products from '../components/Products'

// Public Pages
import Login from '../pages/Login'
import RegistrationForm from '../pages/RegistrationForm'
import Orders from '../pages/Orders'
import AdminOrders from '../pages/AdminOrders'
import Admins from '../pages/Admin'
import UserDetails from '../pages/userDetails'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import VerifyEmail from '../pages/VerifyEmail'
import UserProfile from '../pages/UserProfile'

function RoutesFile () {
  return (
    <AuthWrapper>
      <Routes>
        {/* Public */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<RegistrationForm />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:uid/:token' element={<ResetPassword />} />
        <Route path='/verify-email/:uid/:token' element={<VerifyEmail />} />

        {/* User Routes */}
        <Route element={<ProtectedRoute role='user' />}>
          <Route path='/' element={<Home />} />
          <Route path='cart' element={<Cart />} />
          <Route path='productDetails/:id' element={<ProductDetails />} />
          <Route path='football' element={<Football />} />
          <Route path='cricket' element={<Cricket />} />
          <Route path='volleyball' element={<Volleyball />} />
          <Route path='gym' element={<Gym />} />
          <Route path='checkout' element={<Checkout />} />
          <Route path='wishlist' element={<Wishlist />} />
          <Route path='profile' element={<UserProfile />} />
          <Route path='orders' element={<Orders />} />
        </Route>

        {/* Admin Routes */}
        <Route path='/admin' element={<ProtectedRoute role='admin' />}>
          <Route index element={<TestingDashboard />} />
          <Route path='users' element={<Users />} />
          <Route path='products' element={<Products />} />
          <Route path='addproduct' element={<AddProduct />} />
          <Route path='updateproduct/:id' element={<UpdateProduct />} />
          <Route path='orders' element={<AdminOrders />} />
          <Route path='admins' element={<Admins />} />
          <Route path='userdetails/:id' element={<UserDetails />} />
        </Route>
      </Routes>
    </AuthWrapper>
  )
}

export default RoutesFile
