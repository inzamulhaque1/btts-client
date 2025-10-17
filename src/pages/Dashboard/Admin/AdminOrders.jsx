/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Search,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Edit
} from "lucide-react";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    paymentStatus: "all",
    search: "",
    page: 1,
    limit: 10
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showWiseModal, setShowWiseModal] = useState(false);
  const [wiseForm, setWiseForm] = useState({
    wiseEmail: "",
    wisePassword: "",
    wiseImage: null
  });

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await axios.get(`https://btts-server-production.up.railway.app/admin/orders?${params}`);
      setOrders(response.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get("https://btts-server-production.up.railway.app/admin/orders/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 })
    }));
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`https://btts-server-production.up.railway.app/admin/orders/${orderId}`, {
        orderStatus: newStatus
      });
      fetchOrders();
      fetchStats();
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Failed to update order status.");
    }
  };

  // Update payment status
  const updatePaymentStatus = async (orderId, newStatus, order) => {
    try {
      if (newStatus === "paid") {
        setSelectedOrder(order);
        setShowWiseModal(true);
      } else {
        await axios.put(`https://btts-server-production.up.railway.app/admin/orders/${orderId}`, {
          paymentStatus: newStatus
        });
        fetchOrders();
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to update payment:", err);
      alert("Failed to update payment status.");
    }
  };

  // Handle WISE credentials submission
// Handle WISE credentials submission
const handleWiseCredentialsSubmit = async () => {
  if (!wiseForm.wiseEmail || !wiseForm.wisePassword) {
    alert("Please fill in both WISE email and password");
    return;
  }

  try {
    console.log("Submitting WISE credentials:", {
      wiseEmail: wiseForm.wiseEmail,
      wisePassword: wiseForm.wisePassword,
      wiseImage: wiseForm.wiseImage
    });

    const response = await axios.put(`https://btts-server-production.up.railway.app/admin/orders/${selectedOrder._id}`, {
      paymentStatus: "paid",
      orderStatus: "delivered",
      wiseEmail: wiseForm.wiseEmail,
      wisePassword: wiseForm.wisePassword,
      wiseImage: wiseForm.wiseImage
    });
    
    console.log("Update response:", response.data);
    
    fetchOrders();
    fetchStats();
    setShowWiseModal(false);
    setSelectedOrder(null);
    setWiseForm({ wiseEmail: "", wisePassword: "", wiseImage: null });
    
    alert("Order updated successfully with WISE credentials!");
  } catch (err) {
    console.error("Failed to update order with WISE credentials:", err);
    console.error("Error response:", err.response?.data);
    alert("Failed to update order: " + (err.response?.data?.error || err.message));
  }
};

// Upload image to ImgBB
const uploadImage = async (file) => {
  if (!file) return null;

  try {
    console.log("Starting image upload...", file);
    
    const formData = new FormData();
    formData.append('image', file);
    
    console.log("Sending to ImgBB...");
    
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=288f2bbd3e2c4d9db5eda66b617eb1c4`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log("ImgBB response:", response.data);

    if (response.data.success) {
      const imageUrl = response.data.data.url;
      console.log("Image uploaded successfully:", imageUrl);
      return imageUrl;
    } else {
      throw new Error('Image upload failed');
    }
  } catch (error) {
    console.error("Image upload error:", error);
    console.error("Error details:", error.response?.data);
    alert("Failed to upload image: " + (error.response?.data?.error?.message || error.message));
  }
  return null;
};

// Handle image upload
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  console.log("File selected:", file);
  
  const imageUrl = await uploadImage(file);
  console.log("Upload result:", imageUrl);
  
  if (imageUrl) {
    setWiseForm(prev => ({ ...prev, wiseImage: imageUrl }));
    console.log("Wise form updated with image:", imageUrl);
  }
};

  // Delete order
  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    try {
      await axios.delete(`https://btts-server-production.up.railway.app/admin/orders/${orderId}`);
      fetchOrders();
      fetchStats();
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert("Failed to delete order.");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Status badge component
  const StatusBadge = ({ status, type = "order" }) => {
    const config = {
      order: {
        pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
        processing: { color: "bg-blue-100 text-blue-800", icon: Package },
        completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
        delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
        cancelled: { color: "bg-red-100 text-red-800", icon: XCircle }
      },
      payment: {
        pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
        paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
        failed: { color: "bg-red-100 text-red-800", icon: XCircle },
        refunded: { color: "bg-purple-100 text-purple-800", icon: AlertCircle }
      }
    };

    const statusConfig = config[type][status] || config[type].pending;
    const IconComponent = statusConfig.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
        <IconComponent className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading && !orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2 text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600 mt-1">Manage all customer orders</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${stats.totalRevenue?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Customers</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {new Set(orders.map(order => order.userId)).size}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Orders</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.recentOrders?.length || 0}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Payments</option>
              <option value="pending">Payment Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Results per page */}
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {order._id.slice(-8)}
                        </div>
                        {order.category && (
                          <div className="text-xs text-gray-400 capitalize">
                            {order.category}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${order.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="text-sm border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updatePaymentStatus(order._id, e.target.value, order)}
                        className="text-sm border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      
                      {/* Show WISE info if available */}
                      {order.wiseEmail && (
                        <div className="mt-2 text-xs text-gray-500">
                          <div className="font-medium">WISE: {order.wiseEmail}</div>
                          {order.wiseImage && (
                            <img 
                              src={order.wiseImage} 
                              alt="WISE proof" 
                              className="h-6 w-6 object-cover rounded mt-1 cursor-pointer"
                              onClick={() => window.open(order.wiseImage, '_blank')}
                            />
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/services/${order.productId}`)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Service"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {orders.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          )}

          {/* Loading State */}
          {loading && orders.length > 0 && (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mr-2" />
              <span className="text-sm text-gray-600">Updating orders...</span>
            </div>
          )}
        </div>

        {/* Pagination */}
        {orders.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {orders.length} orders
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('page', filters.page - 1)}
                disabled={filters.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => handleFilterChange('page', filters.page + 1)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* WISE Credentials Modal */}
        {showWiseModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add WISE Credentials
                </h2>
                <button
                  onClick={() => setShowWiseModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Order Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.title}</p>
                  <p className="text-sm text-gray-600">Customer: {selectedOrder.userName}</p>
                  <p className="text-sm text-gray-600">Price: ${selectedOrder.price}</p>
                </div>

                {/* WISE Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WISE Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={wiseForm.wiseEmail}
                    onChange={(e) => setWiseForm(prev => ({
                      ...prev,
                      wiseEmail: e.target.value
                    }))}
                    placeholder="Enter WISE email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* WISE Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WISE Password *
                  </label>
                  <input
                    type="text"
                    required
                    value={wiseForm.wisePassword}
                    onChange={(e) => setWiseForm(prev => ({
                      ...prev,
                      wisePassword: e.target.value
                    }))}
                    placeholder="Enter WISE password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Proof Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {wiseForm.wiseImage && (
                    <div className="mt-2">
                      <img
                        src={wiseForm.wiseImage}
                        alt="Preview"
                        className="h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Security Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Security Notice</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        These credentials will be securely delivered to the customer. 
                        Make sure the information is accurate before submitting.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowWiseModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWiseCredentialsSubmit}
                    disabled={!wiseForm.wiseEmail || !wiseForm.wisePassword}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve & Deliver
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;