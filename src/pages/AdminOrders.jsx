import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/admin/DashboardHeader";
import DashboardSidebar from "../components/admin/DashboardSidebar";
import api from "../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("admin/orders/");
        
        setOrders(res.data.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        
      }
    };
    fetchOrders();
  }, []);

  const markDelivered = async orderId => {
    try{
      const res = await api.patch(`admin/markdelivered/`, {
      status: "delivered",
      order_id:orderId
    });

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, order_status: "delivered" } : o
      )
    );
    alert(res.data.message)
    console.log(res.data);
    
    }catch(err){
      alert(err.message)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <DashboardHeader />
        <div className="flex justify-center mt-24 text-lg text-gray-600">
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <DashboardHeader />

      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Content */}
        <main className="flex-1 p-6">
          <h1 className="mb-6 text-2xl font-semibold text-gray-900">
            All User Orders
          </h1>

          {orders.length === 0 ? (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-gray-600">No orders found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="rounded-xl bg-white border border-gray-200 shadow-sm p-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        User:{" "}
                        <span className="font-medium text-gray-900">
                          {order.email}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Date:{" "}
                        {order.created_at.slice(0, 10)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        Status:{" "}
                        <span
                          className={`capitalize ${
                            order.order_status === "delivered"
                              ? "text-green-600"
                              : order.status === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </p>

                      <p className="text-sm text-gray-700">
                        Total: ₹{order.total_price}
                      </p>

                      {order.order_status !== "delivered" && order.order_status !== "cancelled" && (
                        <button
                          onClick={() => markDelivered(order.id)}
                          className="mt-2 rounded-lg bg-black px-4 py-1.5 text-sm
                                     font-medium text-white
                                     hover:bg-gray-800 transition"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Products */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Products
                    </h4>

                    {order.items.map(p => (
                      <div
                        key={p.product_id}
                        className="flex items-center gap-4"
                      >
                        {p.product_image && (
                          <img
                            src={p.product_image}
                            alt={p.product_name}
                            className="h-14 w-14 rounded-lg border object-cover"
                          />
                        )}

                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {p.product_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {p.quantity} | Price: ₹{p.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminOrders;
