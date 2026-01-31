import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/admin/DashboardHeader";
import DashboardSidebar from "../components/admin/DashboardSidebar";
import api from "../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);

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

  const markDelivered = async (orderId) => {
    if (!window.confirm("Are you sure you want to mark this order as delivered?")) {
      return;
    }
    
    try {
      setUpdatingOrder(orderId);
      const res = await api.patch(`admin/markdelivered/`, {
        status: "delivered",
        order_id: orderId
      });

      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? { ...o, order_status: "delivered" } : o
        )
      );

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-black text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slideIn';
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>${res.data.message || "Order marked as delivered"}</span>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to update order");
    } finally {
      setUpdatingOrder(null);
    }
  };

  // Add animation style
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .animate-slideIn {
        animation: slideIn 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Filter orders based on status and search
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toString().includes(searchQuery) ||
      order.items?.some(item => 
        item.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesStatus = 
      filterStatus === "all" || 
      order.order_status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total_price) || 0), 0);
  const pendingOrders = orders.filter(order => order.order_status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-gray-500 text-sm mt-1">View and manage all customer orders</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className="text-lg font-bold text-gray-900">{totalOrders}</p>
                  </div>
                  <div className="px-3 py-2 bg-green-50 rounded-lg text-center">
                    <p className="text-xs text-green-500">Revenue</p>
                    <p className="text-lg font-bold text-gray-900">₹{totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="px-3 py-2 bg-yellow-50 rounded-lg text-center">
                    <p className="text-xs text-yellow-500">Pending</p>
                    <p className="text-lg font-bold text-gray-900">{pendingOrders}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter & Search Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Orders
                </label>
                <div className="relative">
                  <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by email, order ID, or product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white
                             focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                             text-gray-700 shadow-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                           text-gray-700 shadow-sm"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white
                           text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading orders...</p>
              </div>
            </div>
          ) : filteredOrders.length > 0 ? (
            /* Orders List */
            <div className="flex flex-col gap-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Order ID: <span className="font-medium text-gray-900">#{order.id}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              User: <span className="font-medium text-gray-900">{order.email}</span>
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                            {order.order_status?.toUpperCase() || "UNKNOWN"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Date: {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{parseFloat(order.total_price || 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        
                        {order.order_status !== "delivered" && order.order_status !== "cancelled" && (
                          <button
                            onClick={() => markDelivered(order.id)}
                            disabled={updatingOrder === order.id}
                            className="mt-3 px-5 py-2.5 rounded-xl bg-black text-white font-medium
                                     hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed
                                     transition-all duration-200 flex items-center justify-center mx-auto md:mx-0"
                          >
                            {updatingOrder === order.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Updating...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Mark Delivered
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Products ({order.items?.length || 0})
                    </h4>

                    <div className="space-y-4">
                      {order.items?.map((item) => (
                        <div
                          key={item.product_id || item.id}
                          className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                        >
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                              }}
                            />
                          )}

                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.product_name}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-1">
                              <p className="text-sm text-gray-600">
                                Quantity: <span className="font-medium">{item.quantity}</span>
                              </p>
                              <p className="text-sm text-gray-600">
                                Price: <span className="font-medium">₹{parseFloat(item.price || 0).toFixed(2)}</span>
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                Subtotal: ₹{parseFloat((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Info */}
                    {order.shipping_address && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Shipping Address
                        </h5>
                        <p className="text-sm text-gray-600">{order.shipping_address}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || filterStatus !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "No orders have been placed yet"}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                  }}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium
                            hover:bg-gray-50 transition-all duration-200 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminOrders;