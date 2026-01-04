import styles from "./Sidebar.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { logout } = useContext(AuthContext);

  return (
    <div className={styles.navContainer}>
      <div className={styles.links}>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/allproducts">Product</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/adminorders">Orders</Link>
        <Link to="/admin/banner">Banner</Link>

      </div>
      <div className={styles.logout}>
        <Link onClick={logout}>Logout</Link>
      </div>
    </div>
  );
}
