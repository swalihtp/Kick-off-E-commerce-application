import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx"
import styles from "./UpdateProduct.module.css"; // 👈 import CSS

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/products/${id}`, product)
      .then(() => {
        alert("Product updated successfully!");
        navigate("/admin/allproducts");
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Header/>
      <div className={styles.mainContainer}>
      <Sidebar />
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Update Product</h2>
          <form onSubmit={handleUpdate} className={styles.form}>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Product Name"
              className={styles.input}
            />
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Price"
              className={styles.input}
            />
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="Category"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Update
            </button>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}

export default UpdateProduct;
