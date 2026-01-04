import styles from "./DashboardCards.module.css";
import axios from "axios";
import { useState, useEffect } from "react";

export default function DashboardCards() {
  const [data, setData] = useState([
    { label: "USERS", count: 0 },
    { label: "PRODUCTS", count: 0 },
    { label: "ORDERS", count: 0 },
  ]);

  useEffect(() => {
    const dataClaim = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/users"),
          axios.get("http://localhost:5000/products"),
          axios.get("http://localhost:5000/orders"),
        ]);

        setData([
          { label: "USERS", count: usersRes.data.length },
          { label: "PRODUCTS", count: productsRes.data.length },
          { label: "ORDERS", count: ordersRes.data.length },
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    dataClaim();
  }, []);

  return (
    <div className={styles.cardGrid}>
      {data.map((item) => (
        <div key={item.label} className={styles.card}>
          <h3>{item.label}</h3>
          <p className={styles.value}>{item.count}</p>
        </div>
      ))}
    </div>
  );
}
