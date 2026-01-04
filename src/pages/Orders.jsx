import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Orders.module.css";
import Navbar from "../components/Navbar";

function Orders() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/orders?userId=${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

const cancelOrder = async (order) => {
  try {
    await axios.delete(`http://localhost:5000/orders/${order.id}`);
    setOrders((prevOrders) => prevOrders.filter((o) => o.id !== order.id));
    for (let product of order.products) {
      const { data: productInfo } = await axios.get(
        `http://localhost:5000/products/${product.productId}`
      );

      const newStock = productInfo.stock + product.quantity;

      await axios.patch(`http://localhost:5000/products/${product.productId}`, {
        stock: newStock,
      });
    }

  } catch (err) {
    console.error("Error cancelling order:", err);
  }
};


  const postReview = async (productId, reviewText) => {
    if (!reviewText || reviewText.trim() == "") {
      alert("Review cannot be empty!");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/products/${productId}`);
      const product = res.data;

      const newReview = {
        userId: user.id,
        userName: user.name,
        review: reviewText
      };

      const updatedReviews = product.reviews ? [...product.reviews, newReview] : [newReview];

      await axios.patch(`http://localhost:5000/products/${productId}`, {
        reviews: updatedReviews
      });

      setReviews((prev) => ({ ...prev, [`${productId}`]: "" }));

      alert("Review posted successfully!");
    } catch (err) {
      console.error("Error posting review:", err);
    }
  };

  if (loading) return <p className={styles.loading}>Loading orders...</p>;

  return (
    <>
      <Navbar />
      <div className={styles.ordersContainer}>
        <h1 className={styles.ordersTitle}>Your Orders</h1>
        <div className={styles.ordersList}>
          {orders.length === 0 ? (
            <p className={styles.noOrders}>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div className={styles.orderCard} key={order.id}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <p>
                      Status:{" "}
                      <span className={`${styles.status} ${styles[order.status]}`}>
                        {order.status}
                      </span>
                    </p>
                    <p>Total: <b>₹{order.total}</b></p>
                    <p>Date: {order.createdAt}</p>
                  </div>
                </div>

                {/* Products list */}
                <div className={styles.orderProducts}>
                  <h4>Products:</h4>
                  <ul>
                    {order.products.map((p) => (
                      <li key={p.productId} className={styles.productItem}>
                        {p.productImage && (
                          <img
                            src={p.productImage}
                            alt={p.productName}
                            className={styles.productImage}
                          />
                        )}
                        <span className={styles.productName}>{p.productName}</span>
                        <span> | Qty: {p.quantity} | Price: ₹{p.price}</span>

                        {/* Show review input if delivered */}
                        {order.status === "delivered" && (
                          <div className={styles.reviewSection}>
                            <p>Write a review:</p>
                            <textarea
                              value={reviews[p.productId] || ""}
                              onChange={(e) =>
                                setReviews((prev) => ({
                                  ...prev,
                                  [p.productId]: e.target.value
                                }))
                              }
                            />
                            <button
                              onClick={() =>
                                postReview(p.productId, reviews[p.productId])
                              }
                            >
                              Post
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cancel order button if pending */}
                {order.status === "pending" && (
                  <button
                    className={styles.cancelBtn}
                    onClick={() => cancelOrder(order)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Orders;
