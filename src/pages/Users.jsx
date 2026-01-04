import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import styles from "./Users.module.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const updateStatus = async (userId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        status: newStatus,
      });

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser?.id === userId) {
        const updatedUser = { ...currentUser, status: newStatus };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  const clickUser = async (user) => {
    setSelectedUserId(selectedUserId === user.id ? null : user.id);

    try {
      const res = await axios.get(
        `http://localhost:5000/orders?userId=${user.id}`
      );

      const allProducts = res.data.flatMap((order) => order.products);

      setOrders(allProducts);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    }
  };

  return (
    <div className={styles.dashboardLayout}>
      <Header />

      <div className={styles.body}>
        <Sidebar />

        <main className={styles.mainContent}>
          <h2>Users List</h2>
          <div className={styles.usersList}>
            {users.map((user) => {
              const status = user.status || "active";
              return (
                <div
                  key={user.id}
                  className={styles.userCard}
                  onClick={() => clickUser(user)}
                >
                  <div className={styles.userInfoRow}>
                    <strong>Name:</strong> {user.name}
                  </div>
                  <div className={styles.userInfoRow}>
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div className={styles.userInfoRow}>
                    <strong>Status:</strong> {status}
                  </div>

                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.blockBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(user.id, "blocked");
                      }}
                      disabled={status === "blocked"}
                    >
                      Block
                    </button>
                    <button
                      className={styles.activateBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(user.id, "active");
                      }}
                      disabled={status === "active"}
                    >
                      Activate
                    </button>
                  </div>

                  {selectedUserId === user.id && (
                    <div className={styles.userContainer}>
                      <div className={styles.userHeader}>
                        <img src={user.image} alt={user.name} />
                        <div className={styles.userInfo}>
                          <p>
                            <b>ID:</b> {user.id}
                          </p>
                          <p>
                            <b>Name:</b> {user.name}
                          </p>
                          <p>
                            <b>Email:</b> {user.email}
                          </p>
                          <p className={styles.userStatus}>{status}</p>
                        </div>
                      </div>

                      {user.cart?.length > 0 && (
                        <div className={styles.cartContainer}>
                          <h3 className={styles.cartTitle}>Cart Items</h3>
                          {user.cart.map((item, index) => (
                            <div className={styles.cartItem} key={index}>
                              <img src={item.image} alt={item.name} />
                              <p>{item.name}</p>
                              <p>₹{item.price}</p>
                              <p>Qty: {item.qty}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {orders.length > 0 && (
                        <div className={styles.ordersContainer}>
                          <h3>Orders</h3>
                          {orders.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                              <img
                                src={item.productImage}
                                alt={item.productName}
                              />
                              <p>{item.productName}</p>
                              <p>₹{item.price}</p>
                              <p>Qty: {item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Users;
