import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { fetchCart, addToCart } from "../redux/cartSlice";
import {
  fetchWishlist,
  toggleWishlistLocal,
  updateWishlistOnServer,
} from "../redux/wishlistSlice";
import styles from "./cricket.module.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Cricket() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: products, status, error } = useSelector(
    (state) => state.products
  );
  const { items: cart } = useSelector((state) => state.cart);
  const { items: wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [dispatch]);

  const cricketProducts = products.filter(
    (item) => item.category?.toLowerCase() === "cricket"
  );

  const isInCart = (id) =>
    cart.some((item) => item.productId === id);

  const isInWishlist = (id) =>
    wishlist.some((item) => item.id === id);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.grid}>
          {cricketProducts.map((item) => (
            <div
              key={item.id}
              className={styles.card}
              onClick={() => navigate(`/productDetails/${item.id}`)}
            >
              <div className={styles.imageWrapper}>
                <img src={item.image} alt={item.name} />
              </div>

              <div className={styles.details}>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.price}>₹{item.price}</p>
              </div>

              <div className={styles.btnContainer}>
                {isInCart(item.id) ? (
                  <button
                    className={styles.goToCartBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/cart");
                    }}
                  >
                    Go to Cart
                  </button>
                ) : (
                  <button
                    className={styles.addToCartBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(addToCart(item));
                    }}
                  >
                    Add to Cart
                  </button>
                )}

                <button
                  className={`${styles.wishlistBtn} ${
                    isInWishlist(item.id) ? styles.active : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(toggleWishlistLocal(item));
                    dispatch(updateWishlistOnServer(wishlist));
                  }}
                >
                  <img
                    src={
                      isInWishlist(item.id)
                        ? "/icons/icons8-heart-50-filled.png"
                        : "/icons/icons8-heart-50 (5).png"
                    }
                    alt="wishlist-icon"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Cricket;
