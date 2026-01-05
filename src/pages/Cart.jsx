import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import {
  fetchCart,
  setCart,
  updateCartOnServer,
} from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, status, error } = useSelector((state) => state.cart);
  const [total, setTotal] = useState(0);

  // Load cart on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Calculate total
  useEffect(() => {
    const totalValue = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    setTotal(totalValue);
  }, [items]);

  // Update cart (Redux + Server)
  const updateCart = (updatedCart) => {
    dispatch(setCart(updatedCart));
    dispatch(updateCartOnServer(updatedCart));
  };

  const increaseQty = (product) => {
    if (product.qty < 5) {
      updateCart(
        items.map((item) =>
          item.productId === product.productId
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    }
  };

  const decreaseQty = (product) => {
    if (product.qty > 1) {
      updateCart(
        items.map((item) =>
          item.productId === product.productId
            ? { ...item, qty: item.qty - 1 }
            : item
        )
      );
    }
  };

  const removeCartItem = (product) => {
    updateCart(
      items.filter(
        (item) => item.productId !== product.productId
      )
    );
  };

  return (
    <>
      <Navbar />

      <div className="mx-auto my-10 max-w-[900px] rounded-xl bg-white p-5 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
        
        {/* Title */}
        <h2 className="mb-5 text-center text-[1.8rem] font-bold text-[#333]">
          Your Shopping Cart
        </h2>

        {/* Status */}
        {status === "loading" && (
          <p className="text-center text-gray-600">
            Loading your cart...
          </p>
        )}

        {status === "failed" && (
          <p className="text-center text-red-600">
            {error}
          </p>
        )}

        {/* Empty Cart */}
        {items.length === 0 && status === "succeeded" ? (
          <p className="my-8 text-center text-[1.2rem] text-[#777]">
            Your cart is empty
          </p>
        ) : (
          <>
            {/* Cart Items */}
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-wrap items-center gap-5 border-b border-[#eee] py-4 md:flex-nowrap"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-[120px] w-full rounded-lg border border-[#ddd] bg-[#f9f9f9] object-contain md:w-[120px]"
                />

                {/* Details */}
                <div className="flex flex-1 flex-col gap-2.5">
                  
                  {/* Name & Price */}
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <p className="text-[1.1rem] font-semibold text-[#222]">
                      {item.name}
                    </p>
                    <p className="text-[1rem] font-bold text-[#28a745]">
                      ₹{item.price}
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between gap-3">
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => increaseQty(item)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-white bg-black text-[1.1rem] text-white transition hover:border-black"
                      >
                        +
                      </button>

                      <span className="w-6 text-center text-[1rem] font-semibold text-[#333]">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => decreaseQty(item)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-white bg-black text-[1.1rem] text-white transition hover:border-black"
                      >
                        -
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeCartItem(item)}
                      className="rounded-md bg-black px-2.5 py-1.5 text-white transition hover:border-2 hover:border-black hover:bg-white hover:text-black"
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="mt-8 rounded-lg bg-[#f7f7f7] p-5 text-[1rem] text-[#444]">
              <h3 className="mb-4 text-[1.4rem] font-semibold text-[#111]">
                PRICE DETAILS
              </h3>

              <p className="my-2 flex justify-between">
                <span>Total Products</span>
                <span>{items.length}</span>
              </p>

              <p className="my-2 flex justify-between">
                <span>Discount</span>
                <span>₹0</span>
              </p>

              <p className="my-2 flex justify-between text-[1.2rem] font-bold text-[#28a745]">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </p>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-5 w-full rounded-lg bg-black p-3 text-[1rem] font-semibold text-white transition hover:border-2 hover:border-black hover:bg-white hover:text-black"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;
