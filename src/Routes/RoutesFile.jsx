import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthWrapper from "../context/AuthWrapper";
// User Pages
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import ProductDetails from "../pages/productDetails";
import Football from "../pages/Football";
import Cricket from "../pages/cricket";
import Volleyball from "../pages/VolleyBall";
import Gym from "../pages/Gym";
import Checkout from "../pages/Checkout";
import Search from "../components/Search";
import Wishlist from "../pages/Wishlist";
import Profile from "../components/Profile";

// Admin Pages
import AdminHome from "../pages/AdminDashboard";
import Dashboard from "../components/DashboardCards";
import Users from "../pages/Users";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Chart from "../Charts/ProductsCategoryChart";
import ProductSection from "../components/ProductSection";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import DeleteProduct from "../components/DeleteProduct";
import BannerEditor from "../components/BannerEditor";

// Public Pages
import Login from "../pages/Login";
import RegistrationForm from "../pages/RegistrationForm";
import Orders from "../pages/Orders";
import AdminOrders from "../pages/AdminOrders";
import Product from "../pages/Product";
import Blockedpage from "../pages/Blockedpage";

function RoutesFile() {
  return (
    <AuthWrapper>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/blockedpage" element={<Blockedpage/>}/>

        {/* User Routes */}
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/" element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="productDetails/:id" element={<ProductDetails />} />
          <Route path="football" element={<Football />} />
          <Route path="cricket" element={<Cricket />} />
          <Route path="volleyball" element={<Volleyball />} />
          <Route path="gym" element={<Gym />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="searchbar" element={<Search />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin" />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<Users />} />
          <Route path="allproducts" element={<ProductSection />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="updateproduct/:id" element={<UpdateProduct />} />
          <Route path="deleteproduct/:id" element={<DeleteProduct />} />
          <Route path="adminorders" element={<AdminOrders />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="banner" element={<BannerEditor />} />
        </Route>
      </Routes>
    </AuthWrapper>
  );
}

export default RoutesFile;
