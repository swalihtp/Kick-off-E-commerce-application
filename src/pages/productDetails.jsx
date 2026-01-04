import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./productDetails.module.css";
import Navbar from "../components/Navbar";

function ProductDetails() {
  const { id } = useParams();
  const userEmail = localStorage.getItem("userEmail");
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Product fetch error:", err));
  }, [id]);

  const addToCart = async (product) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/users?email=${userEmail}`
      );
      if (res.data.length === 0) return;

      const user = res.data[0];
      const userId = user.id;
      const existingCart = user.cart || [];

      const existingItem = existingCart.find(
        (item) => item.productId === product.id
      );

      const updatedCart = existingItem
        ? existingCart.map((item) =>
            item.productId === product.id
              ? { ...item, qty: item.qty + 1 }
              : item
          )
        : [
            ...existingCart,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              qty: 1,
            },
          ];

      await axios.patch(`http://localhost:5000/users/${userId}`, {
        cart: updatedCart,
      });
    } catch (err) {
      console.error("Cart update failed:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.productDetails}>
        <div className={styles.productImage}>
          <img src={product.image} alt={product.name} />
        </div>
        <div className={styles.productInfo}>
          <h2 className={styles.productName}>{product.name}</h2>
          <p className={styles.productDescription}>{product.description}</p>
          <p className={styles.productPrice}>₹{product.price}</p>
          <p className={styles.stock}>
            Stock: <span>{product.stock}</span>
          </p>
          <div className={styles.btnContainer}>
            <button
              className={styles.addToCartBtn}
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
            <button className={styles.buyNowBtn}>Buy Now</button>         
          </div>
        </div>
      </div>
      <div className={styles.reviewsSection}>
        <h3>Rating and Reviews</h3>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((item) => (
            <div key={item.id} className={styles.reviewCard}>
              <h4 className={styles.rating}>⭐ {item.rating}</h4>
              <p className={styles.comment}>
                <b className={styles.userName}>{item.userName}:</b> {item.review}
              </p>
            </div>
          ))
        ) : (
          <p className={styles.noReviews}>No reviews yet.</p>
        )}
      </div>
    </>
  );
}

export default ProductDetails;
