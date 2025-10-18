/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Shield, 
  Star, 
  Calendar,
  CreditCard,
  Truck,
  User,
  Zap,
  Globe,
  Lock,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { useAuth } from "../../provider/AuthProvider";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/register");
    }
  }, [currentUser, navigate]);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://btts-server-production.up.railway.app/services/${id}`);
        setService(response.data);
      } catch (err) {
        setError("Failed to load service details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      navigate("/register");
      return;
    }

    try {
      setPlacingOrder(true);
      
      const orderData = {
        productId: service._id,
        title: service.title,
        description: service.description,
        category: service.category,
        image: service.image,
        price: service.price,
        deliveryTime: service.deliveryTime,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email,
        paymentStatus: "pending",
        orderStatus: "pending",
        orderDate: new Date().toISOString()
      };

      const response = await axios.post("https://btts-server-production.up.railway.app/orders", orderData);
      
      if (response.data.success) {
        alert("Order placed successfully!");
        navigate("/my-orders");
      }
    } catch (err) {
      console.error("Order placement error:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const paymentIcons = {
    binance: "₿",
    remitly: "R",
    ach: "A",
    wise: "W",
    payoneer: "P",
    xoom: "X",
    paypal: "PP",
    stripe: "S",
    bank: "🏦"
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-slate-700 border-t-teal-400 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-teal-400/20 blur-xl animate-pulse"></div>
          </div>
          <p className="text-slate-300 mt-4 text-base sm:text-lg font-semibold">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-red-500/30 backdrop-blur-sm text-center max-w-md w-full">
          <p className="text-red-400 mb-4 sm:mb-6 text-base sm:text-lg font-semibold">{error || "Service not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/40 rounded-lg sm:rounded-xl text-teal-300 hover:border-teal-400/60 transition-all duration-300 hover:scale-105 font-bold cursor-pointer text-sm sm:text-base w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
          50% { box-shadow: 0 0 40px rgba(20, 184, 166, 0.6); }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-48 h-48 sm:w-96 sm:h-96 bg-teal-500/10 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-48 h-48 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/5 rounded-full blur-2xl sm:blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-teal-500/30 hover:border-teal-400/60 transition-all duration-300 hover:scale-105 cursor-pointer w-full sm:w-auto justify-center sm:justify-start"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 group-hover:text-teal-300 transition-colors flex-shrink-0" />
          <span className="text-teal-300 font-semibold text-sm sm:text-base">Back to Services</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="group relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-teal-500/30 group-hover:border-teal-400/60 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-500">
                {/* Top Accent Line */}
                <div className="h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"></div>

                {/* Image */}
                {service.image && (
                  <div className="h-48 xs:h-56 sm:h-64 md:h-80 lg:h-96 overflow-hidden bg-slate-900/50">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-contain p-4 sm:p-6 md:p-8 hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3 sm:mb-4 break-words">
                        {service.title}
                      </h1>
                      <p className="text-slate-300 text-base sm:text-lg leading-relaxed break-words">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {service.popular && (
                        <span className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/40 text-yellow-300 font-bold backdrop-blur-sm text-xs sm:text-sm">
                          <Star className="w-3 h-3  fill-yellow-400 flex-shrink-0" />
                          POPULAR
                        </span>
                      )}
                      <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/40 text-blue-300 font-bold capitalize backdrop-blur-sm text-xs sm:text-sm">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Key Features */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 flex-shrink-0" />
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-teal-500/30 transition-all group/feature">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 flex-shrink-0 group-hover/feature:text-teal-300" />
                            <span className="text-slate-200 font-semibold text-sm sm:text-base break-words">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {service.deliveryTime && (
                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-400/40">
                        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-teal-500/20 flex-shrink-0">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">Delivery Time</p>
                          <p className="font-bold text-teal-300 text-sm sm:text-base md:text-lg capitalize break-words">{service.deliveryTime}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/40">
                      <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-cyan-500/20 flex-shrink-0">
                        <Globe className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">Category</p>
                        <p className="font-bold text-cyan-300 text-sm sm:text-base md:text-lg capitalize break-words">{service.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  {service.paymentMethods && service.paymentMethods.length > 0 && (
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 flex-shrink-0" />
                        Accepted Payment Methods
                      </h3>
                      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 sm:gap-3">
                        {service.paymentMethods.map((method, idx) => (
                          <div key={idx} className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/30 transition-all group/payment">
                            <span className="text-xl sm:text-2xl font-bold text-teal-400 group-hover/payment:text-teal-300 flex-shrink-0">
                              {paymentIcons[method] || "💳"}
                            </span>
                            <span className="text-slate-200 font-bold capitalize text-xs sm:text-sm break-words">{method}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 sm:top-6 lg:top-8 space-y-4 sm:space-y-6">
              {/* Price Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-teal-400/40 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-sm">
                  <div className="h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"></div>
                  
                  <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                    {/* Price */}
                    <div className="text-center p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-400/40">
                      <div className="flex items-center justify-center gap-1 sm:gap-2 text-slate-400 mb-2 sm:mb-3">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Starting From</span>
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 sm:mb-3">
                        ${service.price}
                      </div>
                      {service.deliveryTime && (
                        <div className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-slate-800/50">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 flex-shrink-0" />
                          <span className="text-slate-200 font-bold capitalize text-xs sm:text-sm">{service.deliveryTime} delivery</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 sm:space-y-3">
                      <button 
                        onClick={handlePlaceOrder}
                        disabled={placingOrder}
                        className="group/btn w-full relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-red-500 border-2 border-white hover:border-teal-400/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden cursor-pointer animate-pulse-glow"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/20 to-transparent opacity-0 group-hover/btn:opacity-100 animate-shimmer"></div>
                        <span className="relative text-white font-bold text-base sm:text-lg flex items-center justify-center gap-1 sm:gap-2">
                          {placingOrder ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                              <span className="text-sm sm:text-base">Placing Order...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
                              <span className="text-sm sm:text-base">Place Order Now</span>
                            </>
                          )}
                        </span>
                      </button>
                      
                      <button className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-slate-800/50 border-2 border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 font-bold text-slate-300 hover:text-cyan-300 cursor-pointer text-sm sm:text-base">
                        Contact Provider
                      </button>
                    </div>

                    {/* Security Features */}
                    <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-slate-700/50">
                      <h4 className="font-bold text-teal-300 flex items-center gap-1 sm:gap-2 text-base sm:text-lg">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
                        100% Secure Service
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-slate-800/30">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300 font-semibold text-xs sm:text-sm">Money-back guarantee</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-slate-800/30">
                          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300 font-semibold text-xs sm:text-sm">Secure payment processing</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-slate-800/30">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300 font-semibold text-xs sm:text-sm">Quality assurance</span>
                        </div>
                      </div>
                    </div>

                    {/* Service ID */}
                    <div className="pt-3 sm:pt-4 border-t border-slate-700/50">
                      <p className="text-xs text-slate-500 text-center font-mono break-all">
                        ID: {service._id?.slice(-12)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-cyan-500/30 group-hover:border-cyan-400/60 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-500">
                  <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                  
                  <div className="p-4 sm:p-6">
                    <h4 className="font-bold text-cyan-300 mb-4 sm:mb-6 flex items-center gap-1 sm:gap-2 text-base sm:text-lg">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
                      Service Information
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-slate-800/30">
                        <span className="text-slate-400 font-semibold text-xs sm:text-sm">Category:</span>
                        <span className="font-bold text-cyan-300 capitalize text-xs sm:text-sm">{service.category}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-slate-800/30">
                        <span className="text-slate-400 font-semibold text-xs sm:text-sm">Status:</span>
                        <span className="font-bold text-green-400 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></div>
                          Available
                        </span>
                      </div>
                      {service.deliveryTime && (
                        <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-slate-800/30">
                          <span className="text-slate-400 font-semibold text-xs sm:text-sm">Delivery:</span>
                          <span className="font-bold text-teal-300 capitalize text-xs sm:text-sm">{service.deliveryTime}</span>
                        </div>
                      )}
                      {service.popular && (
                        <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-slate-800/30">
                          <span className="text-slate-400 font-semibold text-xs sm:text-sm">Demand:</span>
                          <span className="font-bold text-yellow-400 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            High
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;