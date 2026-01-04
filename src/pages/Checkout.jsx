import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Checkout.module.css";
import Navbar from "../components/Navbar.jsx";

function Checkout() {
  const userEmail = localStorage.getItem("userEmail");
  const [cartItems, setCartItems] = useState([]);
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/users?email=${userEmail}`
        );
        if (res.data.length > 0) {
          setCartItems(res.data[0].cart || []);
        }
      } catch (err) {
        console.error("Error fetching cart:", err.message);
      }
    };
    fetchCart();
  }, [userEmail]);

  const placeOrder = async () => {
    try {
      const userRes = await axios.get(
        `http://localhost:5000/users?email=${userEmail}`
      );
      const user = userRes.data[0];

      if (!user) return console.error("User not found!");

      const newOrderData = {
        userId: user.id,
        userName: user.name,
        products: cartItems.map((item) => ({
          productImage: item.image,
          productName: item.name,
          productId: item.productId,
          quantity: item.qty,
          price: item.price,
        })),
        total: cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
        status: "pending",
        paymentStatus: "unpaid",
        createdAt: new Date().toLocaleDateString(),
      };

      const res = await axios.post(
        `http://localhost:5000/orders`,
        newOrderData
      );

      await axios.patch(`http://localhost:5000/users/${user.id}`, { cart: [] });
      setCartItems([]);

      for (let i = 0; i < cartItems.length; i++) {
        const productRes = await axios.get(
          `http://localhost:5000/products/${cartItems[i].productId}`
        );
        const currentStock = productRes.data.stock;
        const newStock = currentStock - cartItems[i].qty;

        await axios.patch(
          `http://localhost:5000/products/${cartItems[i].productId}`,
          { stock: newStock }
        );
      }
    } catch (err) {
      console.error("Error placing order:", err);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  return (
    <>
      <Navbar />

      <div className={styles.checkoutContainer}>
        <div className={styles.formSection}>
          <h2>Checkout</h2>
          <form>
            <div className={styles.row}>
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="Last Name" />
            </div>
            <div className={styles.row}>
              <input type="text" placeholder="PIN code" />
            </div>
            <div className={styles.row}>
              <input type="text" placeholder="Address Line 1" />
            </div>
            <div className={styles.row}>
              <input type="text" placeholder="Address Line 2" />
            </div>
            <div className={styles.row}>
              <input type="text" placeholder="City" />
            </div>
            <div className={styles.row}>
              <select name="state">
                <option value="">Select State</option>
                <option>Kerala</option>
                <option>Goa</option>
                <option>Karnataka</option>
              </select>
              <select name="country">
                <option value="">Select Country</option>
                <option>India</option>
              </select>
            </div>

            <h3>Contact Info</h3>
            <div className={styles.row}>
              <input type="email" placeholder="Enter your email address" />
              <input type="text" placeholder="Phone Number" />
            </div>

            <h3>Payment Method</h3>
            <div className={styles.paymentOptions}>
              <input type="checkbox" />
              <label htmlFor="paymentoptions">UPI</label>
              <input type="checkbox" />
              <label htmlFor="paymentoptions">Cash on delivery</label>
            </div>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className={styles.orderSection}>
          <h2>Your Order</h2>
          <div className={styles.orderList}>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.productId} className={styles.orderItem}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p className={styles.itemName}>{item.name}</p>
                    <p>Qty: {item.qty}</p>
                    <p>₹{item.price * item.qty}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
          <hr />
          <h3>Total: ₹{totalPrice}</h3>
          <button className={styles.placeOrderBtn} onClick={placeOrder}>
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}

export default Checkout;
