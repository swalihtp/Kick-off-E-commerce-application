import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { fetchCart, addToCart } from "../redux/cartSlice";
import {
  fetchWishlist,
  toggleWishlistLocal,
  updateWishlistOnServer,
} from "../redux/wishlistSlice";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import FootballJerseyBanner from "../Banners/FootballJerseyBanner";
import styles from "./Football.module.css";

function Football() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, status } = useSelector((state) => state.products);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [dispatch]);

  const footballProducts = items.filter(
    (item) => item.category?.toLowerCase() === "football"
  );

  const isInCart = (id) =>
    cartItems.some((item) => item.productId === id);

  const isInWishlist = (id) =>
    wishlistItems.some((item) => item.id === id);

  return (
    <>
      <Navbar />
      <FootballJerseyBanner />

      <div className={styles.container}>
        <div className={styles.grid}>
          {footballProducts.map((item) => (
            <div
              key={item.id}
              className={styles.card}
              onClick={() => navigate(`/productDetails/${item.id}`)}
            >
              <img src={item.image} alt={item.name} />

              <p>{item.name}</p>
              <p>₹{item.price}</p>

              {isInCart(item.id) ? (
                <button onClick={() => navigate("/cart")}>
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(addToCart(item));
                  }}
                >
                  Add to Cart
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(toggleWishlistLocal(item));
                  dispatch(updateWishlistOnServer(wishlistItems));
                }}
              >
                {isInWishlist(item.id) ? "❤️" : "🤍"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default Football;
