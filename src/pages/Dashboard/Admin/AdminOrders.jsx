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
  AlertCircle
} from "lucide-react";
import { usePrivateRoute } from "../../../components/usePrivateRoute";

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
  const [duplicateCheck, setDuplicateCheck] = useState({
    emailExists: false,
    passwordExists: false,
    exactMatch: false
  });
  usePrivateRoute(["admin"]);

  // API configuration
  const API_CONFIG = {
    baseURL: "https://btts-server-production.up.railway.app",
    headers: {
      'x-api-key': 'admin123456'
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await axios.get(`${API_CONFIG.baseURL}/admin/orders?${params}`, {
        headers: API_CONFIG.headers
      });
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
      const response = await axios.get(`${API_CONFIG.baseURL}/admin/orders/stats`, {
        headers: API_CONFIG.headers
      });
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [filters]);

  // Check for duplicate WISE credentials
  const checkDuplicateWiseCredentials = (email, password) => {
    if (!email && !password) {
      setDuplicateCheck({ emailExists: false, passwordExists: false, exactMatch: false });
      return;
    }

    const existingOrders = orders.filter(order => 
      order.paymentStatus === 'paid' && 
      (order.wiseEmail || order.wisePassword)
    );

    const emailExists = existingOrders.some(order => 
      order.wiseEmail?.toLowerCase() === email?.toLowerCase()
    );

    const passwordExists = existingOrders.some(order => 
      order.wisePassword === password
    );

    const exactMatch = existingOrders.some(order => 
      order.wiseEmail?.toLowerCase() === email?.toLowerCase() && 
      order.wisePassword === password
    );

    setDuplicateCheck({
      emailExists,
      passwordExists,
      exactMatch
    });
  };

  // Handle WISE form changes with duplicate checking
  const handleWiseFormChange = (field, value) => {
    setWiseForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Check for duplicates when both fields have values
    if (field === 'wiseEmail') {
      checkDuplicateWiseCredentials(value, wiseForm.wisePassword);
    } else if (field === 'wisePassword') {
      checkDuplicateWiseCredentials(wiseForm.wiseEmail, value);
    }
  };

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
      await axios.put(`${API_CONFIG.baseURL}/admin/orders/${orderId}`, {
        orderStatus: newStatus
      }, {
        headers: API_CONFIG.headers
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
        setWiseForm({ wiseEmail: "", wisePassword: "", wiseImage: null });
        setDuplicateCheck({ emailExists: false, passwordExists: false, exactMatch: false });
        setShowWiseModal(true);
      } else {
        await axios.put(`${API_CONFIG.baseURL}/admin/orders/${orderId}`, {
          paymentStatus: newStatus
        }, {
          headers: API_CONFIG.headers
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
  const handleWiseCredentialsSubmit = async () => {
    if (!wiseForm.wiseEmail || !wiseForm.wisePassword) {
      alert("Please fill in both WISE email and password");
      return;
    }

    // Check for exact duplicate before submitting
    checkDuplicateWiseCredentials(wiseForm.wiseEmail, wiseForm.wisePassword);
    
    if (duplicateCheck.exactMatch) {
      const confirmOverride = window.confirm(
        "⚠️ WARNING: These exact WISE credentials already exist in another order!\n\n" +
        "Email: " + wiseForm.wiseEmail + "\n" +
        "Password: " + wiseForm.wisePassword + "\n\n" +
        "Are you sure you want to use the same credentials again?"
      );
      
      if (!confirmOverride) {
        return;
      }
    }

    try {
      console.log("Submitting WISE credentials:", {
        wiseEmail: wiseForm.wiseEmail,
        wisePassword: wiseForm.wisePassword,
        wiseImage: wiseForm.wiseImage
      });

      const response = await axios.put(`${API_CONFIG.baseURL}/admin/orders/${selectedOrder._id}`, {
        paymentStatus: "paid",
        orderStatus: "delivered",
        wiseEmail: wiseForm.wiseEmail,
        wisePassword: wiseForm.wisePassword,
        wiseImage: wiseForm.wiseImage
      }, {
        headers: API_CONFIG.headers
      });
      
      console.log("Update response:", response.data);
      
      fetchOrders();
      fetchStats();
      setShowWiseModal(false);
      setSelectedOrder(null);
      setWiseForm({ wiseEmail: "", wisePassword: "", wiseImage: null });
      setDuplicateCheck({ emailExists: false, passwordExists: false, exactMatch: false });
      
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
      await axios.delete(`${API_CONFIG.baseURL}/admin/orders/${orderId}`, {
        headers: API_CONFIG.headers
      });
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

  // Get duplicate warning message
  const getDuplicateWarning = () => {
    if (duplicateCheck.exactMatch) {
      return {
        type: "error",
        message: "⚠️ These exact credentials already exist in another order!",
        details: "Email and password combination is identical to an existing order."
      };
    } else if (duplicateCheck.emailExists && duplicateCheck.passwordExists) {
      return {
        type: "warning",
        message: "⚠️ Both email and password exist in different orders",
        details: "This email exists in one order and this password exists in another."
      };
    } else if (duplicateCheck.emailExists) {
      return {
        type: "warning",
        message: "⚠️ This email already exists in another order",
        details: "Consider using a different email address."
      };
    } else if (duplicateCheck.passwordExists) {
      return {
        type: "warning",
        message: "⚠️ This password already exists in another order",
        details: "Consider using a different password."
      };
    }
    return null;
  };

  const duplicateWarning = getDuplicateWarning();

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
                          ID: {order._id?.slice(-8) || 'N/A'}
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
                          {order.userName || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.userEmail || 'No email'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${order.price || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.orderStatus || 'pending'}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        value={order.paymentStatus || 'pending'}
                        onChange={(e) => updatePaymentStatus(order._id, e.target.value, order)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      
                      {/* Show WISE info if available */}
                      {order.wiseEmail && (
                        <div className="mt-2 text-xs text-gray-500">
                          <div className="font-medium">WISE Email: {order.wiseEmail}</div>
                          <div className="font-medium">WISE Pass: {order.wisePassword}</div>
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
                      {order.createdAt ? formatDate(order.createdAt) : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
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
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Add WISE Credentials
        </h2>
        <button
          onClick={() => {
            setShowWiseModal(false);
            setDuplicateCheck({ emailExists: false, passwordExists: false, exactMatch: false });
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Scrollable Content - Flexible */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 space-y-4">
          {/* Order Info */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">Order Details</h3>
            <div className="space-y-1 text-xs sm:text-sm text-gray-600">
              <p className="break-words">{selectedOrder.title}</p>
              <p>Customer: {selectedOrder.userName}</p>
              <p>Price: ${selectedOrder.price}</p>
            </div>
          </div>

          {/* Duplicate Warning */}
          {duplicateWarning && (
            <div className={`border rounded-lg p-3 ${
              duplicateWarning.type === 'error' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start gap-2">
                <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  duplicateWarning.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    duplicateWarning.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    {duplicateWarning.message}
                  </p>
                  <p className={`text-xs mt-1 ${
                    duplicateWarning.type === 'error' ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {duplicateWarning.details}
                  </p>
                  {duplicateCheck.exactMatch && (
                    <p className="text-xs text-red-700 mt-1 font-semibold">
                      This will create duplicate credentials!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* WISE Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WISE Email *
            </label>
            <input
              type="email"
              required
              value={wiseForm.wiseEmail}
              onChange={(e) => handleWiseFormChange('wiseEmail', e.target.value)}
              placeholder="Enter WISE email"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {duplicateCheck.emailExists && (
              <p className="text-xs text-yellow-600 mt-1">
                This email is already used in another order
              </p>
            )}
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
              onChange={(e) => handleWiseFormChange('wisePassword', e.target.value)}
              placeholder="Enter WISE password"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {duplicateCheck.passwordExists && (
              <p className="text-xs text-yellow-600 mt-1">
                This password is already used in another order
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Proof Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {wiseForm.wiseImage && (
              <div className="mt-3 flex flex-col items-center">
                <div className="relative">
                  <img
                    src={wiseForm.wiseImage}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    onClick={() => setWiseForm(prev => ({ ...prev, wiseImage: null }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Click the X to remove image
                </p>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Security Notice</p>
                <p className="text-xs text-blue-700 mt-1">
                  These credentials will be securely delivered to the customer. 
                  Make sure the information is accurate before submitting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="border-t border-gray-200 bg-white p-4 sm:p-6 flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setShowWiseModal(false);
              setDuplicateCheck({ emailExists: false, passwordExists: false, exactMatch: false });
            }}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleWiseCredentialsSubmit}
            disabled={!wiseForm.wiseEmail || !wiseForm.wisePassword}
            className={`flex-1 px-4 py-3 rounded-lg text-white transition-colors font-semibold flex items-center justify-center gap-2 text-sm ${
              duplicateCheck.exactMatch 
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400' 
                : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
            } disabled:cursor-not-allowed`}
          >
            <CheckCircle className="w-4 h-4" />
            {duplicateCheck.exactMatch ? 'Override & Deliver' : 'Approve & Deliver'}
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