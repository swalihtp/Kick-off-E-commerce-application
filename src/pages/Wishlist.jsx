import { useEffect } from "react";
import Navbar from "../components/Navbar";
import styles from "./Wishlist.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  toggleWishlistLocal,
  updateWishlistOnServer,
} from "../redux/wishlistSlice";
import { updateCartOnServer, setCart } from "../redux/cartSlice";
import axios from "axios";

function Wishlist() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.wishlist);
  const userEmail = localStorage.getItem("userEmail");

  // 🟢 Fetch wishlist on mount
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // 🛒 Add product to cart
  const addToCart = async (product) => {
    const res = await axios.get(`http://localhost:5000/users?email=${userEmail}`);
    const user = res.data[0];
    if (!user) return;

    const existingCart = user.cart || [];
    const existingItem = existingCart.find((item) => item.productId === product.id);

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

    // Update both Redux + server for cart
    dispatch(setCart(updatedCart));
    dispatch(updateCartOnServer(updatedCart));
  };

  // ❤️ Toggle wishlist (Redux + server)
  const toggleWishlist = (product) => {
    // Optimistic UI update
    dispatch(toggleWishlistLocal(product));

    // Sync with backend
    const updatedWishlist = items.some((i) => i.id === product.id)
      ? items.filter((i) => i.id !== product.id)
      : [...items, product];

    dispatch(updateWishlistOnServer(updatedWishlist));
  };

  return (
    <>
      <Navbar />
      <div className={styles.wishlistContainer}>
        <h2 className={styles.title}>My Wishlist ❤️</h2>

        {status === "loading" && <p>Loading wishlist...</p>}
        {status === "failed" && <p>Failed to load wishlist</p>}

        {items.length === 0 ? (
          <p className={styles.empty}>Your wishlist is empty.</p>
        ) : (
          <div className={styles.grid}>
            {items.map((item) => (
              <div key={item.id} className={styles.card}>
                <img src={item.image} alt={item.name} className={styles.image} />
                <div className={styles.info}>
                  <h3 className={styles.name}>{item.name}</h3>
                  <p className={styles.price}>₹{item.price}</p>
                  <div className={styles.actions}>
                    <button
                      className={styles.cartBtn}
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart 🛒
                    </button>
                    <button
                      className={`${styles.wishlistBtn} ${
                        items.some((w) => w.id === item.id)
                          ? styles.active
                          : ""
                      }`}
                      onClick={() => toggleWishlist(item)}
                    >
                      <img
                        src={
                          items.some((w) => w.id === item.id)
                            ? "/icons/icons8-heart-50-filled.png"
                            : "/icons/icons8-heart-50 (5).png"
                        }
                        alt="wishlist-icon"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist;
