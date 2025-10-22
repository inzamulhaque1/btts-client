/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Shield,
  User,
  Mail,
  Calendar,
  Image,
  Loader,
  Edit,
  Save,
  X,
} from "lucide-react";

const WiseStockDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    soldTo: "",
    notes: "",
  });

  const statusOptions = [
    {
      value: "available",
      label: "Available",
      color: "bg-green-100 text-green-800",
    },
    { value: "sold", label: "Sold", color: "bg-blue-100 text-blue-800" },
    {
      value: "suspended",
      label: "Suspended",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "disabled", label: "Disabled", color: "bg-red-100 text-red-800" },
    { value: "active", label: "Active", color: "bg-teal-100 text-teal-800" },
  ];

  const fetchStockDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://btts-server-production.up.railway.app/wise-stocks/${id}`,
        {
          headers: {
            "x-api-key": "admin123456",
          },
        }
      );
      setStock(response.data);
      setFormData({
        status: response.data.status || "available",
        soldTo: response.data.soldTo || "",
        notes: response.data.notes || "",
      });
    } catch (error) {
      console.error("Error fetching stock details:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch stock details",
        icon: "error",
        confirmButtonColor: "#ef4444",
      }).then(() => {
        navigate("/dashboard/all-wise-stocks");
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await axios.get(
        "https://btts-server-production.up.railway.app/users",
        {
          headers: {
            "x-api-key": "admin123456",
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load users list",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const openStatusModal = () => {
    setShowStatusModal(true);
    fetchUsers();
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setFormData({
      status: stock?.status || "available",
      soldTo: stock?.soldTo || "",
      notes: stock?.notes || "",
    });
  };

  const updateStockStatus = async () => {
    if (!formData.status) {
      Swal.fire({
        title: "Error!",
        text: "Please select a status",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // If status is sold, require soldTo field
    if (formData.status === "sold" && !formData.soldTo) {
      Swal.fire({
        title: "Error!",
        text: "Please select a user when marking as sold",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setUpdating(true);

      const updateData = {
        status: formData.status,
        ...(formData.status === "sold" && { soldTo: formData.soldTo }),
        ...(formData.notes && { notes: formData.notes }),
        updatedAt: new Date(),
      };

      const response = await axios.put(
        `https://btts-server-production.up.railway.app/wise-stocks/${id}`,
        updateData,
        {
          headers: {
            "x-api-key": "admin123456",
          },
        }
      );

      setStock(response.data.stock);
      setShowStatusModal(false);

      Swal.fire({
        title: "Success!",
        text: "Stock status updated successfully",
        icon: "success",
        confirmButtonColor: "#0d9488",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating stock status:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update stock status",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setFormData((prev) => ({
      ...prev,
      status: newStatus,
      // Clear soldTo if status is not sold
      ...(newStatus !== "sold" && { soldTo: "" }),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status
    );
    return statusOption ? statusOption.color : "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status
    );
    return statusOption ? statusOption.label : status;
  };

  const getSoldToUserName = (userId) => {
    const user = users.find((u) => u.uid === userId || u._id === userId);
    return user ? user.displayName || user.email : "Unknown User";
  };

  useEffect(() => {
    if (id) {
      fetchStockDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading stock details...</p>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Stock not found</p>
          <button
            onClick={() => navigate("/dashboard/all-wise-stocks")}
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Back to Stocks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard/all-wise-stocks")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Stocks</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Wise Stock Details
              </h1>
              <p className="text-gray-600">
                Complete information about this Wise account
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wise Account Information */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Wise Account Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Holder Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {stock.wiseName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name
                    </label>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {stock.serviceName}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900 font-medium">
                      {stock.wiseEmail}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                      {stock.wisePassword}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          stock.status
                        )}`}
                      >
                        {getStatusLabel(stock.status)}
                        {stock.soldTo && (
                          <span className="ml-1 text-xs opacity-75">
                            (to {getSoldToUserName(stock.soldTo)})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Added
                    </label>
                    <p className="text-gray-900 flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(stock.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {stock.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">
                      {stock.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Images Section - Keep the same as before */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Image className="w-5 h-5 text-blue-600" />
                  Account Images
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stock.authImage && (
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Authentication Image
                      </label>
                      <img
                        src={stock.authImage}
                        alt="Authentication"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik05NiA2NEM4Mi43NDUyIDY0IDcyIDc0Ljc0NTIgNzIgODhDNTIgODIuNzQ1MiA4Mi43NDUyIDY0IDk2IDY0WiIgZmlsbD0iIzhERENERiIvPgo8Y2lyY2xlIGN4PSI5NiIgY3k9Ijk2IiByPSIyNCIgZmlsbD0iIzlDQTNCQiIvPgo8cGF0aCBkPSJNMTQ0IDE0NEg0OEM0My41ODIzIDE0NCA0MCAxNDAuNDE8IDQwIDEzNlY1NkM0MCA1MS41ODIzIDQzLjU4MjMgNDggNDggNDhIMTQ0QzE0OC40MTggNDggMTUyIDUxLjU4MjMgMTUyIDU2VjEzNkMxNTIgMTQwLjQxOCAxNDguNDE4IDE0NCAxNDQgMTQ0WiIgZmlsbD0iIzlDQTNCQiIvPgo8L3N2Zz4=";
                        }}
                      />
                      <a
                        href={stock.authImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Full Size
                      </a>
                    </div>
                  )}

                  {stock.docImg1 && (
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document 1
                      </label>
                      <img
                        src={stock.docImg1}
                        alt="Document 1"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik05NiA2NEM4Mi43NDUyIDY0IDcyIDc0Ljc0NTIgNzIgODhDNTIgODIuNzQ1MiA4Mi43NDUyIDY0IDk2IDY0WiIgZpbGw9IiM4RERDREYiLz4KPGNpcmNsZSBjeD0iOTYiIGN5PSI5NiIgcj0iMjQiIGZpbGw9IiM5Q0EzQkIiLz4KPHBhdGggZD0iTTE0NCAxNDRINDhDNDMuNTgyMyAxNDQgNDAgMTQwLjQxOCA0MCAxMzZWNTZDNDAgNTEuNTgyMyA0My41ODIzIDQ4IDQ4IDQ4SDE0NEMxNDguNDE4IDQ4IDE1MiA1MS41ODIzIDE1MiA1NlYxMzZDMTUyIDE0MC40MTggMTQ4LjQxOCAxNDQgMTQ0IDE0NFoiIGZpbGw9IiM5Q0EzQkIiLz4KPC9zdmc+";
                        }}
                      />
                      <a
                        href={stock.docImg1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Full Size
                      </a>
                    </div>
                  )}

                  {stock.docImg2 && (
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document 2
                      </label>
                      <img
                        src={stock.docImg2}
                        alt="Document 2"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik05NiA2NEM4Mi43NDUyIDY0IDcyIDc0Ljc0NTIgNzIgODhDNTIgODIuNzQ1MiA4Mi43NDUyIDY0IDk2IDY0WiIgZmlsbD0iIzhERENERiIvPgo8Y2lyY2xlIGN4PSI5NiIgY3k9Ijk2IiByPSIyNCIgZmlsbD0iIzlDQTNCQiIvPgo8cGF0aCBkPSJNMTQ0IDE0NEg0OEM0My41ODIzIDE0NCA0MCAxNDAuNDE4IDQwIDEzNlY1NkM0MCA1MS41ODIzIDQzLjU4MjMgNDggNDggNDhIMTQ0QzE0OC40MTggNDggMTUyIDUxLjU4MjMgMTUyIDU2VjEzNkMxNTIgMTQwLjQxOCAxNDguNDE4IDE0NCAxNDQgMTQ0WiIgZmlsbD0iIzlDQTNCQiIvPgo8L3N2Zz4=";
                        }}
                      />
                      <a
                        href={stock.docImg2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Full Size
                      </a>
                    </div>
                  )}
                </div>

                {!stock.authImage && !stock.docImg1 && !stock.docImg2 && (
                  <div className="text-center py-8">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      No images available for this stock
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Added By
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-1">
                    <User className="w-4 h-4 text-gray-400" />
                    {stock.userName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {stock.userEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={() => navigate("/dashboard/all-wise-stocks")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Stocks
                </button>
                <button
                  onClick={openStatusModal}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Update Stock Status
              </h2>
              <button
                onClick={closeStatusModal}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status To
                </label>
                <select
                  value={formData.status}
                  onChange={handleStatusChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.status === "sold" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sold To User
                  </label>
                  {loadingUsers ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader className="w-4 h-4 animate-spin" />
                      Loading users...
                    </div>
                  ) : (
                    <select
                      name="soldTo"
                      value={formData.soldTo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option
                          key={user.uid || user._id}
                          value={user.uid || user._id}
                        >
                          {user.displayName || user.email} ({user.userRole})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Add any additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeStatusModal}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateStockStatus}
                disabled={updating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-teal-400 transition-colors"
              >
                {updating ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WiseStockDetails;
