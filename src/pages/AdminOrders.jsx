import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminOrders.module.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders");
        setOrders(res.data.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

  }, []);

  const markDelivered = async (orderId) => {
    await axios.patch(`http://localhost:5000/orders/${orderId}`, {
      status: "delivered",
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "delivered" } : o))
    );
  };

  if (loading) return <p className={styles.loading}>Loading orders...</p>;

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <main className={styles.content}>
          <h1 className={styles.title}>All User Orders</h1>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <p>
                    User: <b>{order.userName}</b>
                  </p>
                  <p>
                    Status:{" "}
                    <span className={styles[order.status]}>{order.status}</span>
                  </p>
                  <p>Total: ₹{order.total}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  {order.status !== "delivered" && (
                    <button
                      className={styles.deliverBtn}
                      onClick={() => markDelivered(order.id)}
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>

                <div className={styles.productsList}>
                  <h4>Products:</h4>
                  {order.products.map((p) => (
                    <div key={p.productId} className={styles.productItem}>
                      {p.productImage && (
                        <img
                          src={p.productImage}
                          alt={p.productName}
                          className={styles.productImage}
                        />
                      )}
                      <span>{p.productName}</span>
                      <span>
                        {" "}
                        | Qty: {p.quantity} | Price: ₹{p.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminOrders;
