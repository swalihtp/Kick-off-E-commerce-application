import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import {
  fetchCart,
  setCart,
  updateCartOnServer,
} from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, status, error } = useSelector((state) => state.cart);
  const [total, setTotal] = useState(0);

  // 🟢 Load cart when the page opens
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // 🧮 Calculate total whenever items change
  useEffect(() => {
    const totalValue = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    setTotal(totalValue);
  }, [items]);

  // 🔁 Update cart in Redux + Server
  const updateCart = (updatedCart) => {
    dispatch(setCart(updatedCart)); // optimistic update
    dispatch(updateCartOnServer(updatedCart)); // sync with backend
  };

  const increaseQty = (product) => {
    if (product.qty < 5) {
      const updatedCart = items.map((item) =>
        item.productId === product.productId
          ? { ...item, qty: item.qty + 1 }
          : item
      );
      updateCart(updatedCart);
    }
  };

  const decreaseQty = (product) => {
    if (product.qty > 1) {
      const updatedCart = items.map((item) =>
        item.productId === product.productId
          ? { ...item, qty: item.qty - 1 }
          : item
      );
      updateCart(updatedCart);
    }
  };

  const removeCartItem = (product) => {
    const updatedCart = items.filter((item) => item.productId !== product.productId);
    updateCart(updatedCart);
  };

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h2 className="cart-title">Your Shopping Cart</h2>

        {status === "loading" && <p>Loading your cart...</p>}
        {status === "failed" && <p className="error">❌ {error}</p>}

        {items.length === 0 && status === "succeeded" ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          items.map((item,id) => (
            <div className="cart-item" key={id}>
              <img src={item.image} alt={item.name} className="cart-image" />
              <div className="cart-details">
                <div className="name-price">
                  <p className="cart-name">{item.name}</p>
                  <p className="cart-price">₹{item.price}</p>
                </div>

                <div className="cart-qty">
                  <div>
                    <button className="qty-btn" onClick={() => increaseQty(item)}>
                      +
                    </button>
                    <span className="qty-value">{item.qty}</span>
                    <button className="qty-btn" onClick={() => decreaseQty(item)}>
                      -
                    </button>
                  </div>
                  <div>
                    <button className="rmv-btn" onClick={() => removeCartItem(item)}>
                      Remove Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {items.length > 0 && (
          <div className="cart-summary">
            <h3>PRICE DETAILS</h3>
            <p>
              <span>Total Products</span> <span>{items.length}</span>
            </p>
            <p>
              <span>Discount</span> <span>₹0</span>
            </p>
            <p className="total-amount">
              <span>Total Amount</span> <span>₹{total}</span>
            </p>
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
