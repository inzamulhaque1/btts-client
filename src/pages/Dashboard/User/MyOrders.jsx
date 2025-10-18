/* eslint-disable react-hooks/exhaustive-deps */
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
  Shield,
  Sparkles,
  BadgeCheck,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  CreditCard,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "../../../provider/AuthProvider";

const MyOrders = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [refreshing, setRefreshing] = useState(false);

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
      setRefreshing(true);
      setError(null);

      const userId = currentUser.uid || currentUser._id || currentUser.id;
      const response = await axios.get(
        `https://btts-server-production.up.railway.app/orders/user/${userId}`
      );
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load your orders. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate expected delivery time
  const getExpectedDelivery = (orderDate, deliveryTime) => {
    if (!orderDate || !deliveryTime) return "Not specified";

    const orderDateObj = new Date(orderDate);
    let hoursToAdd = 0;

    if (deliveryTime.includes("instant") || deliveryTime.includes("Instant")) {
      return "Immediate";
    } else if (deliveryTime.includes("hour")) {
      hoursToAdd = parseInt(deliveryTime) || 1;
    } else if (deliveryTime.includes("day")) {
      hoursToAdd = (parseInt(deliveryTime) || 1) * 24;
    }

    const expectedDate = new Date(
      orderDateObj.getTime() + hoursToAdd * 60 * 60 * 1000
    );
    return expectedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
    });
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30",
        icon: Clock,
        label: "Awaiting Processing",
      },
      processing: {
        color: "bg-blue-500/20 text-blue-600 border border-blue-500/30",
        icon: Package,
        label: "In Progress",
      },
      completed: {
        color: "bg-green-500/20 text-green-600 border border-green-500/30",
        icon: CheckCircle,
        label: "Completed",
      },
      delivered: {
        color: "bg-teal-500/20 text-teal-600 border border-teal-500/30",
        icon: BadgeCheck,
        label: "Delivered",
      },
      cancelled: {
        color: "bg-red-500/20 text-red-600 border border-red-500/30",
        icon: XCircle,
        label: "Cancelled",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl ${config.color} backdrop-blur-sm cursor-default text-xs sm:text-sm`}
      >
        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="font-semibold whitespace-nowrap">{config.label}</span>
      </div>
    );
  };

  // Get payment status badge
  const getPaymentBadge = (status) => {
    const paymentConfig = {
      paid: {
        color:
          "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30",
        icon: CheckCircle,
        label: "Paid",
      },
      pending: {
        color: "bg-amber-500/20 text-amber-600 border border-amber-500/30",
        icon: Clock,
        label: "Payment Pending",
      },
      failed: {
        color: "bg-rose-500/20 text-rose-600 border border-rose-500/30",
        icon: XCircle,
        label: "Payment Failed",
      },
      refunded: {
        color: "bg-purple-500/20 text-purple-600 border border-purple-500/30",
        icon: TrendingUp,
        label: "Refunded",
      },
    };

    const config = paymentConfig[status] || paymentConfig.pending;
    const IconComponent = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl ${config.color} backdrop-blur-sm cursor-default text-xs sm:text-sm`}
      >
        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="font-semibold whitespace-nowrap">{config.label}</span>
      </div>
    );
  };

  // Toggle password visibility
  const togglePasswordVisibility = (orderId) => {
    setShowPassword((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You can add a toast notification here instead of alert
      console.log("Copied to clipboard!");
    });
  };

  const handleWhatsAppRedirect = () => {
    const whatsappUrl = "https://wa.me/8801732551463";
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading your orders...</p>
          <p className="text-slate-500 text-sm mt-2">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-0">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 group-hover:text-teal-300 transition-colors" />
              <span className="text-slate-300 group-hover:text-white font-medium text-sm sm:text-base hidden xs:block">
                Back
              </span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/30 backdrop-blur-sm flex-shrink-0">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-teal-400" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                  My Orders
                </h1>
                <p className="text-slate-400 mt-1 sm:mt-2 flex items-center gap-2 text-xs sm:text-sm">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400 flex-shrink-0" />
                  <span className="truncate">
                    {orders.length} order{orders.length !== 1 ? "s" : ""} found
                    • {currentUser?.email}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchUserOrders}
            disabled={refreshing}
            className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base w-full lg:w-auto justify-center"
          >
            <RefreshCw
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span>Refresh Orders</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-red-300 font-semibold text-sm sm:text-base">
                  Error Loading Orders
                </p>
                <p className="text-red-400 text-xs sm:text-sm mt-1 truncate">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 text-center">
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm max-w-md w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/50 flex items-center justify-center">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-300 mb-2 sm:mb-3">
                No Orders Yet
              </h3>
              <p className="text-slate-500 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                You haven't placed any orders yet. Explore our services to get
                started with your first order.
              </p>
              <button
                onClick={() => navigate("/services")}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-teal-500/25 cursor-pointer text-sm sm:text-base"
              >
                Browse Services
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm hover:border-teal-500/30 transition-all duration-500 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-teal-500/10"
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative p-4 sm:p-6 lg:p-8">
                  {/* Order Header */}
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 leading-tight break-words">
                            {order.title}
                          </h3>
                          <p className="text-slate-400 leading-relaxed text-sm sm:text-base break-words">
                            {order.description}
                          </p>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-3">
                          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                            ${order.price}
                          </div>
                          {order.deliveryTime && (
                            <div className="flex items-center gap-2 text-slate-400">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400 flex-shrink-0" />
                              <span className="text-xs sm:text-sm font-medium capitalize">
                                {order.deliveryTime} Delivery
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Meta Grid */}
                      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800/50 border border-slate-700/50">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">Order Date</p>
                            <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                              {formatDate(order.orderDate || order.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800/50 border border-slate-700/50">
                          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">Category</p>
                            <p className="text-xs sm:text-sm text-slate-300 font-medium capitalize truncate">
                              {order.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800/50 border border-slate-700/50">
                          <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">Ordered By</p>
                            <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                              {order.userName || "Customer"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-800/50 border border-slate-700/50">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">
                              Contact Email
                            </p>
                            <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                              {order.userEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Image - Responsive sizing */}
                    {order.image && (
                      <div className="flex-shrink-0 xl:ml-4 lg:ml-6 flex justify-center sm:justify-start">
                        <div className="relative group/image">
                          <img
                            src={order.image}
                            alt={order.title}
                            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-xl sm:rounded-2xl object-cover border-2 border-slate-600/50 group-hover/image:border-teal-500/50 transition-all duration-300 shadow-lg"
                          />
                          <div className="absolute inset-0 bg-teal-500/0 group-hover/image:bg-teal-500/10 rounded-xl sm:rounded-2xl transition-all duration-300"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status & Progress */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-700/50">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {getStatusBadge(order.orderStatus)}
                      {getPaymentBadge(order.paymentStatus)}
                    </div>

                    {/* Order Progress Info */}
                    <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          Expected:{" "}
                          {getExpectedDelivery(
                            order.orderDate,
                            order.deliveryTime
                          )}
                        </span>
                      </div>
                      <div className="text-slate-300 font-mono text-xs">
                        ID: #{order._id.slice(-8)}
                      </div>
                    </div>
                  </div>

                  {/* WISE Credentials Section - Show when delivered */}
                  {order.orderStatus === "delivered" && order.wiseEmail && (
                    <div className="mt-6 sm:mt-8 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 backdrop-blur-sm">
                      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                          <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-lg sm:text-xl font-bold text-white">
                            Your WISE Account Details
                          </h4>
                          <p className="text-emerald-400 text-xs sm:text-sm">
                            Account delivered successfully
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* WISE Email */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-emerald-400 mb-2 sm:mb-3">
                            Email Address
                          </label>
                          <div className="flex gap-2 sm:gap-3">
                            <div className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-900/50 border border-emerald-500/20 text-white font-medium text-sm break-all">
                              {order.wiseEmail}
                            </div>
                            <button
                              onClick={() => copyToClipboard(order.wiseEmail)}
                              className="px-3 py-3 sm:px-4 sm:py-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 cursor-pointer flex-shrink-0"
                              title="Copy to clipboard"
                            >
                              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </button>
                          </div>
                        </div>

                        {/* WISE Password */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-emerald-400 mb-2 sm:mb-3">
                            Password
                          </label>
                          <div className="flex gap-2 sm:gap-3">
                            <div className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-900/50 border border-emerald-500/20 font-mono text-white flex items-center text-sm break-all">
                              {showPassword[order._id]
                                ? order.wisePassword
                                : "•".repeat(12)}
                            </div>
                            <button
                              onClick={() =>
                                togglePasswordVisibility(order._id)
                              }
                              className="px-3 py-3 sm:px-4 sm:py-4 bg-amber-600 hover:bg-amber-500 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25 cursor-pointer flex-shrink-0"
                              title={
                                showPassword[order._id]
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showPassword[order._id] ? (
                                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              ) : (
                                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                copyToClipboard(order.wisePassword)
                              }
                              className="px-3 py-3 sm:px-4 sm:py-4 bg-blue-600 hover:bg-blue-500 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 cursor-pointer flex-shrink-0"
                              title="Copy to clipboard"
                            >
                              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Proof Image */}
                      {order.wiseImage && (
                        <div className="mt-4 sm:mt-6">
                          <label className="block text-xs sm:text-sm font-semibold text-emerald-400 mb-2 sm:mb-3">
                            Google Authenticator
                          </label>
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              window.open(
                                order.wiseImage,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          >
                            <img
                              src={order.wiseImage}
                              alt="WISE Account Proof"
                              className=""
                              onError={(e) => {
                                e.target.style.display = "none";
                                const errorDiv = document.createElement("div");
                                errorDiv.className =
                                  "p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl text-red-400 text-xs sm:text-sm text-center";
                                errorDiv.textContent =
                                  "Image failed to load. Contact support for proof.";
                                e.target.parentNode.appendChild(errorDiv);
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Security Notice */}
                      <div className="mt-4 sm:mt-6 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl bg-slate-900/50 border border-slate-700/50">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-teal-400 mt-0.5 sm:mt-1 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-teal-400 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                              Security Instructions
                            </p>
                            <ul className="text-slate-400 text-xs sm:text-sm space-y-1 sm:space-y-2">
                              <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></div>
                                <span>
                                  Change your password immediately after first
                                  login
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></div>
                                <span>
                                  Enable two-factor authentication for extra
                                  security
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></div>
                                <span>
                                  Do not share these credentials with anyone
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></div>
                                <span>
                                  Contact support if you encounter any issues
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Action - Only show for pending payments */}
                {order.paymentStatus === "pending" && (
                  <div className="border-t border-slate-700/50 bg-slate-800/30 relative z-10">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-white font-semibold text-sm sm:text-base">
                              Payment Required
                            </p>
                            <p className="text-slate-400 text-xs sm:text-sm">
                              Complete your payment to start processing
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleWhatsAppRedirect}
                          className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg sm:hover:shadow-2xl hover:shadow-amber-500/25 cursor-pointer text-sm sm:text-base w-full sm:w-auto text-center relative z-20"
                        >
                          Complete Payment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;