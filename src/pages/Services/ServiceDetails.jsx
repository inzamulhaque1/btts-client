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
  User
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
        const response = await axios.get(`https://btts-server.vercel.app/services/${id}`);
        setService(response.data);
      } catch (err) {
        setError("Failed to load service details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Place Order Function
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
        userId: currentUser.uid, // or currentUser._id depending on your auth structure
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email,
        paymentStatus: "pending",
        orderStatus: "pending",
        orderDate: new Date().toISOString()
      };

      const response = await axios.post("https://btts-server.vercel.app/orders", orderData);
      
      if (response.data.success) {
        // Redirect to orders page or show success message
        alert("Order placed successfully!");
        navigate("/my-orders"); // Create this route if needed
      }
    } catch (err) {
      console.error("Order placement error:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  // Payment method icons mapping
  const paymentIcons = {
    binance: "₿",
    wise: "W",
    xoom: "X",
    paypal: "P",
    stripe: "S",
    bank: "🏦"
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2 text-sm">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-red-600 mb-4 text-sm">{error || "Service not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              {/* Image */}
              {service.image && (
                <div className="h-80 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Header with Title and Badges */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
                    <p className="text-gray-600 mt-3 text-lg leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.popular && (
                      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        <Star className="w-4 h-4" />
                        POPULAR
                      </span>
                    )}
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize">
                      {service.category}
                    </span>
                  </div>
                </div>

                {/* Key Features */}
                {service.features && service.features.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 text-xl flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Key Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Delivery Time */}
                  {service.deliveryTime && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Delivery Time</p>
                        <p className="font-semibold text-gray-900">{service.deliveryTime}</p>
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <Truck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Service Category</p>
                      <p className="font-semibold text-gray-900 capitalize">{service.category}</p>
                    </div>
                  </div>

                  {/* Created Date */}
                  {service.createdAt && (
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Listed Since</p>
                        <p className="font-semibold text-gray-900">{formatDate(service.createdAt)}</p>
                      </div>
                    </div>
                  )}

                  {/* Last Updated */}
                  {service.updatedAt && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Last Updated</p>
                        <p className="font-semibold text-gray-900">{formatDate(service.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Methods */}
                {service.paymentMethods && service.paymentMethods.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 text-xl flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                      Accepted Payment Methods
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {service.paymentMethods.map((method, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                          <span className="text-lg font-semibold">
                            {paymentIcons[method] || "💳"}
                          </span>
                          <span className="text-gray-700 font-medium capitalize">{method}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Pricing & Action */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 sticky top-8">
              <div className="p-6 space-y-6">
                {/* Price Card */}
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-sm font-medium">Starting From</span>
                  </div>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    ${service.price}
                  </div>
                  {service.deliveryTime && (
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{service.deliveryTime} delivery</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-md"
                  >
                    {placingOrder ? "Placing Order..." : "Place Order"}
                  </button>
                  <button className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                    Contact Provider
                  </button>
                </div>

                {/* Security Features */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Secure Service
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Quality assurance</span>
                    </div>
                  </div>
                </div>

                {/* Service ID */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Service ID: {service._id}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                Service Information
              </h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium capitalize">{service.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-green-600">Available</span>
                </div>
                {service.deliveryTime && (
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="font-medium">{service.deliveryTime}</span>
                  </div>
                )}
                {service.popular && (
                  <div className="flex justify-between">
                    <span>Demand:</span>
                    <span className="font-medium text-yellow-600">High</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;