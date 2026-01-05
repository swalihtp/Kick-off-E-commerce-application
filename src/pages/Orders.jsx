import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Orders() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/orders?userId=${userId}`
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const cancelOrder = async (order) => {
    try {
      await axios.delete(`http://localhost:5000/orders/${order.id}`);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));

      for (const product of order.products) {
        const { data: productInfo } = await axios.get(
          `http://localhost:5000/products/${product.productId}`
        );

        await axios.patch(
          `http://localhost:5000/products/${product.productId}`,
          {
            stock: productInfo.stock + product.quantity,
          }
        );
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  const postReview = async (productId, reviewText) => {
    if (!reviewText || reviewText.trim() === "") {
      alert("Review cannot be empty!");
      return;
    }

    try {
      const { data: product } = await axios.get(
        `http://localhost:5000/products/${productId}`
      );

      const newReview = {
        userId: user.id,
        userName: user.name,
        review: reviewText,
      };

      const updatedReviews = product.reviews
        ? [...product.reviews, newReview]
        : [newReview];

      await axios.patch(
        `http://localhost:5000/products/${productId}`,
        { reviews: updatedReviews }
      );

      setReviews((prev) => ({ ...prev, [productId]: "" }));
      alert("Review posted successfully!");
    } catch (err) {
      console.error("Error posting review:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="mt-20 text-center text-gray-600">
          Loading orders...
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="mx-auto mt-10 max-w-5xl px-4">
        <h1 className="mb-8 text-2xl font-bold text-gray-800">
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600">
            No orders found.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border bg-white p-6 shadow-sm"
              >
                {/* Order header */}
                <div className="mb-4 flex flex-wrap justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-semibold capitalize ${
                          order.status === "delivered"
                            ? "text-green-600"
                            : order.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-sm">
                      Total: <b>₹{order.total}</b>
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h4 className="mb-3 font-semibold">Products</h4>

                  <ul className="space-y-4">
                    {order.products.map((p) => (
                      <li
                        key={p.productId}
                        className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-start"
                      >
                        {p.productImage && (
                          <img
                            src={p.productImage}
                            alt={p.productName}
                            className="h-24 w-24 rounded-md object-cover"
                          />
                        )}

                        <div className="flex-1">
                          <p className="font-medium">
                            {p.productName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {p.quantity} | ₹{p.price}
                          </p>

                          {/* Review */}
                          {order.status === "delivered" && (
                            <div className="mt-3">
                              <textarea
                                className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Write your review..."
                                value={reviews[p.productId] || ""}
                                onChange={(e) =>
                                  setReviews((prev) => ({
                                    ...prev,
                                    [p.productId]: e.target.value,
                                  }))
                                }
                              />

                              <button
                                className="mt-2 rounded-md bg-green-600 px-4 py-2 text-sm text-white transition hover:bg-green-700"
                                onClick={() =>
                                  postReview(
                                    p.productId,
                                    reviews[p.productId]
                                  )
                                }
                              >
                                Post Review
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cancel button */}
                {order.status === "pending" && (
                  <button
                    onClick={() => cancelOrder(order)}
                    className="mt-6 rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;
