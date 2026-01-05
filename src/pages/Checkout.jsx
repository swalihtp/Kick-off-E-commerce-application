import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Checkout() {
  const userEmail = localStorage.getItem("userEmail");
  const [cartItems, setCartItems] = useState([]);

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
      if (!user) return;

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
        total: cartItems.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        ),
        status: "pending",
        paymentStatus: "unpaid",
        createdAt: new Date().toLocaleDateString(),
      };

      await axios.post(`http://localhost:5000/orders`, newOrderData);
      await axios.patch(`http://localhost:5000/users/${user.id}`, { cart: [] });
      setCartItems([]);

      for (const item of cartItems) {
        const productRes = await axios.get(
          `http://localhost:5000/products/${item.productId}`
        );
        await axios.patch(
          `http://localhost:5000/products/${item.productId}`,
          { stock: productRes.data.stock - item.qty }
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

      {/* Container */}
      <div className="mx-auto my-10 flex max-w-[1200px] flex-wrap gap-8 p-5">
        
        {/* LEFT – FORM */}
        <div className="flex-1 basis-[500px] rounded-xl bg-white p-5 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
          <h2 className="mb-5 text-xl font-semibold text-[#333]">
            Checkout
          </h2>

          <form>
            {/* Name */}
            <div className="mb-4 flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="flex-1 rounded-md border border-[#ddd] p-2.5 text-sm"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="flex-1 rounded-md border border-[#ddd] p-2.5 text-sm"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="PIN code"
                className="w-full rounded-md border border-[#ddd] p-2.5 text-sm"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Address Line 1"
                className="w-full rounded-md border border-[#ddd] p-2.5 text-sm"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Address Line 2"
                className="w-full rounded-md border border-[#ddd] p-2.5 text-sm"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="City"
                className="w-full rounded-md border border-[#ddd] p-2.5 text-sm"
              />
            </div>

            <div className="mb-6 flex flex-wrap gap-4">
              <select className="flex-1 rounded-md border border-[#ddd] p-2.5 text-sm">
                <option value="">Select State</option>
                <option>Kerala</option>
                <option>Goa</option>
                <option>Karnataka</option>
              </select>

              <select className="flex-1 rounded-md border border-[#ddd] p-2.5 text-sm">
                <option value="">Select Country</option>
                <option>India</option>
              </select>
            </div>

            {/* Contact */}
            <h3 className="mb-3 font-semibold text-[#333]">
              Contact Info
            </h3>

            <div className="mb-6 flex flex-wrap gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-md border border-[#ddd] p-2.5 text-sm"
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="flex-1 rounded-md border border-[#ddd] p-2.5 text-sm"
              />
            </div>

            {/* Payment */}
            <h3 className="mb-3 font-semibold text-[#333]">
              Payment Method
            </h3>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="flex-1 rounded-md bg-black p-3 font-medium text-white transition hover:border-2 hover:border-black hover:bg-white hover:text-black"
              >
                UPI
              </button>
              <button
                type="button"
                className="flex-1 rounded-md bg-black p-3 font-medium text-white transition hover:border-2 hover:border-black hover:bg-white hover:text-black"
              >
                Cash on Delivery
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT – ORDER SUMMARY */}
        <div className="h-fit flex-1 basis-[350px] rounded-xl bg-white p-5 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
          <h2 className="mb-5 text-xl font-semibold text-[#333]">
            Your Order
          </h2>

          <div className="max-h-[400px] overflow-y-auto">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="mb-4 flex items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[60px] w-[60px] rounded-md border border-[#ddd] object-cover"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm">Qty: {item.qty}</p>
                    <p className="text-sm">
                      ₹{item.price * item.qty}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>

          <hr className="my-4" />

          <h3 className="text-lg font-semibold">
            Total: ₹{totalPrice}
          </h3>

          <button
            onClick={placeOrder}
            className="mt-4 w-full rounded-lg bg-black p-3 text-lg font-semibold text-white transition hover:border-2 hover:border-black hover:bg-white hover:text-black"
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}

export default Checkout;
