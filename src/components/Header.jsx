import styles from "./Header.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Header() {
  const userEmail = localStorage.getItem("userEmail");
  const [user, setUser] = useState({});

  useEffect(() => {
    if (userEmail) {
      axios
        .get(`http://localhost:5000/users?email=${userEmail}`)
        .then((res) => {
          if (res.data.length > 0) setUser(res.data[0]);
        })
        .catch((err) => console.error(err));
    }
  }, [userEmail]);

  return (
    <header className={styles.header}>
      {/* Logo / Title */}
      <div className={styles.logo}>
        <span>Kick-Off</span>
      </div>

      {/* Profile */}
      <div className={styles.profile}>
        <div className={styles.avatar}>
          {user.image ? (
            <img src={user.image} alt={user.name || "User"} />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}
        </div>
        <span className={styles.name}>{user.name || "Guest"}</span>
      </div>
    </header>
  );
}
