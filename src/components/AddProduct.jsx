import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import styles from "./AddProduct.module.css";
import Sidebar from "./Sidebar.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from 'react-router-dom'

function AddProduct() {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/products", formData);
      toastMessage()
      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        image: "",
      });
      navigate('/admin/allproducts')
      
    } catch (err) {
      console.error("Error adding product:", err);
      alert("❌ Something went wrong!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setFormData(prev=>({...prev,image:base64Image}))
    };
    reader.readAsDataURL(file);
  };

const toastMessage = () => {
    toast.success("Product Added successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  return (
    <>
      <Header />

      <div className={styles.sidebarContainer}>
        <Sidebar />

        <div className={styles.container}>
          <h1 className={styles.title}>Add New Product</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label>Image URL</label>
              <input type="file" onChange={handleImageChange} />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Add Product
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddProduct;
