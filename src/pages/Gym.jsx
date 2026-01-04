import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { fetchCart, addToCart } from "../redux/cartSlice";
import {
  fetchWishlist,
  toggleWishlistLocal,
  updateWishlistOnServer,
} from "../redux/wishlistSlice";

import styles from "./Gym.module.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Gym() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, status } = useSelector((state) => state.products);
  const { items: cart } = useSelector((state) => state.cart);
  const { items: wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [dispatch, status]);

  const gymProducts = products.filter(
    (item) => item.category?.toLowerCase() === "gym"
  );

  const isInCart = (id) => cart.some((item) => item.productId === id);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleWishlist = (e, product) => {
    e.stopPropagation();
    dispatch(toggleWishlistLocal(product));
    dispatch(updateWishlistOnServer());
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.grid}>
          {gymProducts.map((item) => (
            <div
              key={item.id}
              className={styles.card}
              onClick={() => navigate(`/productDetails/${item.id}`)}
            >
              <img src={item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>₹{item.price}</p>

              <div className={styles.btnContainer}>
                {isInCart(item.id) ? (
                  <button onClick={() => navigate("/cart")}>Go to Cart</button>
                ) : (
                  <button onClick={(e) => handleAddToCart(e, item)}>
                    Add to Cart
                  </button>
                )}

                <button
                  className={
                    wishlist.some((w) => w.id === item.id)
                      ? styles.active
                      : ""
                  }
                  onClick={(e) => handleWishlist(e, item)}
                >
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Gym;
