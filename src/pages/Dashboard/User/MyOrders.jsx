/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Package,
  User,
  Eye,
  EyeOff,
  Download,
  Shield
} from "lucide-react";
import { useAuth } from "../../../provider/AuthProvider";

const MyOrders = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState({});

  useEffect(() => {
    if (!currentUser) {
      navigate("/register");
      return;
    }
    fetchUserOrders();
  }, [currentUser, navigate]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = currentUser.uid || currentUser._id || currentUser.id;
      const response = await axios.get(`https://btts-server-production.up.railway.app/orders/user/${userId}`);
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      processing: { color: "bg-blue-100 text-blue-800", icon: Package },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        <IconComponent className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Get payment status badge
  const getPaymentBadge = (status) => {
    const paymentConfig = {
      paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      failed: { color: "bg-red-100 text-red-800", icon: XCircle },
      refunded: { color: "bg-purple-100 text-purple-800", icon: AlertCircle }
    };

    const config = paymentConfig[status] || paymentConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        <IconComponent className="w-4 h-4" />
        Payment: {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Toggle password visibility
  const togglePasswordVisibility = (orderId) => {
    setShowPassword(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2 text-sm">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-1">
                {orders.length} order{orders.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          
          <button
            onClick={fetchUserOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            Refresh Orders
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate("/services")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {order.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2">
                            {order.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:items-end gap-2">
                          <div className="text-2xl font-bold text-green-600">
                            ${order.price}
                          </div>
                          {order.deliveryTime && (
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <Clock className="w-4 h-4" />
                              {order.deliveryTime}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Meta */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            Ordered: {formatDate(order.orderDate || order.createdAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 capitalize">
                            Category: {order.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            Order ID: {order._id.slice(-8)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            Product ID: {order.productId?.slice(-8) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
                    {getStatusBadge(order.orderStatus)}
                    {getPaymentBadge(order.paymentStatus)}
                    
                    {order.image && (
                      <div className="ml-auto">
                        <img
                          src={order.image}
                          alt={order.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>



{/* WISE Credentials Section - Show only for delivered orders with credentials */}
{order.orderStatus === 'delivered' && order.wiseEmail && (
  <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
    <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2 text-lg">
      <CheckCircle className="w-6 h-6" />
      Your WISE Account Details
    </h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* WISE Email */}
      <div>
        <label className="block text-sm font-medium text-green-700 mb-2">
          WISE Email Address
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 p-3 bg-white border border-green-300 rounded-lg text-sm font-medium">
            {order.wiseEmail}
          </div>
          <button
            onClick={() => copyToClipboard(order.wiseEmail)}
            className="px-3 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Copy to clipboard"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* WISE Password */}
      <div>
        <label className="block text-sm font-medium text-green-700 mb-2">
          WISE Password
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 p-3 bg-white border border-green-300 rounded-lg text-sm font-mono flex items-center">
            {showPassword[order._id] ? order.wisePassword : '•'.repeat(12)}
          </div>
          <button
            onClick={() => togglePasswordVisibility(order._id)}
            className="px-3 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title={showPassword[order._id] ? "Hide password" : "Show password"}
          >
            {showPassword[order._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => copyToClipboard(order.wisePassword)}
            className="px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Copy to clipboard"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    {/* Proof Image with better error handling */}
    {order.wiseImage && (
      <div className="mt-4">
        <label className="block text-sm font-medium text-green-700 mb-2">
          Account Proof
        </label>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500">Image URL: {order.wiseImage}</span>
          <button
            onClick={() => window.open(order.wiseImage, '_blank')}
            className="text-blue-600 text-xs hover:text-blue-700"
          >
            Open in new tab
          </button>
        </div>
        <img
          src={order.wiseImage}
          alt="WISE Account Proof"
          className="h-40 object-cover rounded-lg border border-green-300 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => window.open(order.wiseImage, '_blank')}
          onError={(e) => {
            console.error('Image failed to load:', order.wiseImage);
            e.target.style.display = 'none';
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'p-2 bg-red-100 text-red-700 rounded text-sm';
            errorDiv.textContent = 'Image failed to load. Click the URL above to view it.';
            e.target.parentNode.appendChild(errorDiv);
          }}
          onLoad={(e) => {
            console.log('Image loaded successfully:', order.wiseImage);
          }}
        />
      </div>
    )}
    
    {/* Show message if no image */}
    {!order.wiseImage && (
      <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
        <p className="text-sm text-yellow-700">
          No proof image provided for this account.
        </p>
      </div>
    )}
    
    {/* Security Notice */}
    <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-800 mb-1">
            Security Instructions
          </p>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• Change your password immediately after first login</li>
            <li>• Enable two-factor authentication for extra security</li>
            <li>• Do not share these credentials with anyone</li>
            <li>• Contact support if you encounter any issues</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
)}
                </div>

                {/* Action Buttons */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate(`/services/${order.productId}`)}
                      className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                      View Service
                    </button>
                    <button
                      onClick={() => {/* Add track order functionality */}}
                      className="px-4 py-2 text-gray-600 hover:text-gray-700 font-semibold text-sm"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() => {/* Add support functionality */}}
                      className="px-4 py-2 text-gray-600 hover:text-gray-700 font-semibold text-sm"
                    >
                      Get Help
                    </button>
                    
                    {order.paymentStatus === 'pending' && (
                      <button
                        onClick={() => {/* Add payment functionality */}}
                        className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                      >
                        Complete Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;