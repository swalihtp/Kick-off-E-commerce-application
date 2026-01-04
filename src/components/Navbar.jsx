import { useEffect, useState, useContext } from "react";
import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../redux/cartSlice";

function Navbar() {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // 🔹 Fetch products for search suggestions
  useEffect(() => {
    axios
      .get(`http://localhost:5000/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  // 🔹 Fetch cart once when Navbar loads
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <>
      <nav className={styles.navbar}>
        {/* Left links */}
        <div className={styles.leftLinks}>
          <Link className={styles.link} to="/">
            Kick-Off
          </Link>
          <Link className={styles.link} to="/football">
            Football
          </Link>
          <Link className={styles.link} to="/cricket">
            Cricket
          </Link>
          <Link className={styles.link} to="/volleyball">
            Volleyball
          </Link>
          <Link className={styles.link} to="/gym">
            Gym
          </Link>
        </div>

        {/* Right icons */}
        <div className={styles.rightIcons}>
          {/* 🔍 Search */}
          <div
            className={styles.searchContainer}
            onClick={() => setIsSearchOpen(true)}
          >
            <img
              className={styles.searchIcon}
              src="/icons/icons8-search-50.png"
              alt="search-icon"
            />
            <span>SEARCH</span>
          </div>

          {/* Wishlist */}
          <div
            className={styles.iconContainer}
            onClick={() => navigate("/wishlist")}
          >
            <img
              className={styles.icon}
              src="/icons/icons8-heart-50.png"
              alt="wishlist-icon"
            />
          </div>

          {/* Cart */}
          <div
            className={styles.iconContainer}
            onClick={() => navigate("/cart")}
          >
            <img
              className={styles.icon}
              src="/icons/icons8-cart-50.png"
              alt="cart-icon"
            />
            {items.length > 0 && (
              <span style={{ color: "red", marginLeft: "5px" }}>
                {items.length}
              </span>
            )}
          </div>

          {/* User Dropdown */}
          <div className={styles.userMenu}>
            <img
              className={styles.userIcon}
              src="/icons/icons8-user-50.png"
              alt="user-icon"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className={styles.dropdown}>
                <p onClick={() => navigate("/profile")}>Profile</p>
                {!user ? (
                  <p
                    onClick={() => {
                      navigate("/login");
                      login();
                    }}
                  >
                    Login
                  </p>
                ) : (
                  <p
                    onClick={() => {
                      navigate("/login");
                      logout();
                    }}
                  >
                    Logout
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🔍 Search Overlay */}
      {isSearchOpen && (
        <div className={styles.searchOverlay}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
              className={styles.searchInput}
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className={styles.closeBtn}
            >
              ✕
            </button>
          </div>

          <div className={styles.searchResults}>
            {products
              .filter((item) =>
                item.name.toLowerCase().includes(searchInput.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item.id}
                  className={styles.searchItem}
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    setIsSearchOpen(false);
                  }}
                >
                  <p>{item.name}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
