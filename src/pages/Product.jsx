import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import styles from "./Product.module.css";


function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate=useNavigate()

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) {
    // Loading state
    return (
      <>
        <Header />
        <div className={styles.bodyContainer}>
          <Sidebar />
          <p style={{ padding: "20px" }}>Loading product...</p>
        </div>
      </>
    );
  }
    const deleteProduct = async (product) => {
    axios.delete(`http://localhost:5000/products/${product.id}`);
    navigate('/admin/allproducts')
  };

  return (
    <>
      <Header />
      <div className={styles.bodyContainer}>
        <Sidebar />
        <div className={styles.productContainer}>
          {/* Product Image at top */}
          <div className={styles.productImage}>
            <img src={product.image} alt={product.name} />
          </div>

          {/* Product Info: name + buttons in a row */}
          <div className={styles.productInfo}>
            <p className={styles.productName}>{product.name}</p>
            <div className={styles.buttonGroup}>
              <button onClick={()=>navigate(`/admin/updateproduct/${product.id}`)}>Edit</button>
              <button onClick={()=>deleteProduct(product)}>Delete</button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className={styles.reviewsSection}>
            <h2>Reviews</h2>
            {product.reviews?.length > 0 ? (
              product.reviews.map((item, index) => (
                <div key={index} className={styles.reviewItem}>
                  <h3>{item.userName}</h3>
                  <p>{item.review}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;
