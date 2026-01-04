import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from "./ProductSection.module.css";
import { useNavigate } from "react-router-dom";

function ProductSection() {
  const [products, setProducts] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchingProducts();
  }, []);

  const fetchingProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchProductsByCategory = async (e) => {
    const category = e.target.value;
    setSelectCategory(category);
    try {
      if (category === "") {
        fetchingProducts();
      } else {
        const res = await axios.get(
          `http://localhost:5000/products?category=${category}`
        );
        setProducts(res.data);
      }
    } catch (err) {
      console.error("Error fetching category products:", err);
    }
  };

  const deleteProduct = async (product) => {
    await axios.delete(`http://localhost:5000/products/${product.id}`);
    setProducts(products.filter((item) => product.id !== item.id));
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* Fixed Header */}
      <Header />

      <div className={styles.body}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className={styles.container}>
          <h1 className={styles.title}>Products</h1>

          {/* Actions */}
          <div className={styles.actions}>
            <select value={selectCategory} onChange={fetchProductsByCategory}>
              <option value="">View by Category</option>
              <option value="Football">Football</option>
              <option value="Cricket">Cricket</option>
              <option value="Volleyball">Volleyball</option>
              <option value="Gym">Gym</option>
            </select>

            <button
              className={styles.actionBtn}
              onClick={() => navigate("/admin/addproduct")}
            >
              + Add Product
            </button>
          </div>

          {/* Product List */}
          <div className={styles.productList}>
            {products.length > 0 ? (
              products.map((product) => (
                <div className={styles.productRow} key={product.id}>
                  <div
                    className={styles.productInfo}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                    />
                    <h3>{product.name}</h3>
                    <p className={styles.desc}>
                      {product.description || "No description available"}
                    </p>
                    <span className={styles.category}>
                      {product.category || "Uncategorized"}
                    </span>
                  </div>

                  <div className={styles.productActions}>
                    <button
                      className={`${styles.btn} ${styles.edit}`}
                      onClick={() =>
                        navigate(`/admin/updateproduct/${product.id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.btn} ${styles.delete}`}
                      onClick={() => deleteProduct(product)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noData}>No products found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSection;
