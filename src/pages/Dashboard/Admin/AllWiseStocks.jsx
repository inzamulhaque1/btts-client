/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Plus, Trash2, Eye, RefreshCw, Loader, Shield, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllWiseStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStocks: 0,
    availableStocks: 0,
    soldStocks: 0,
    suspendedStocks: 0,
    disabledStocks: 0,
    activeStocks: 0,
    usedStocks: 0
  });

  const statusOptions = [
    { value: "all", label: "All Status", color: "bg-gray-100 text-gray-800" },
    { value: "available", label: "Available", color: "bg-green-100 text-green-800" },
    { value: "sold", label: "Sold", color: "bg-yellow-100 text-yellow-800" },
    { value: "suspended", label: "Suspended", color: "bg-red-100 text-red-800" },
    { value: "disabled", label: "Disabled", color: "bg-red-100 text-red-800" },
    { value: "active", label: "Active", color: "bg-teal-100 text-teal-800" },
    { value: "used", label: "Used", color: "bg-purple-100 text-purple-800" }
  ];

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://btts-server-production.up.railway.app/wise-stocks",
        {
          headers: {
            "x-api-key": "admin123456",
          },
        }
      );
      setStocks(response.data);
      setFilteredStocks(response.data);
    } catch (error) {
      console.error("Error fetching Wise stocks:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch Wise stocks",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
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
    }
  };

  const getUserName = (userId) => {
    if (!userId) return "-";
    const user = users.find(u => u.uid === userId || u._id === userId);
    return user ? user.displayName || user.email : "Unknown User";
  };

  const calculateStats = (stocksData) => {
    return {
      totalStocks: stocksData.length,
      availableStocks: stocksData.filter(s => s.status === "available").length,
      soldStocks: stocksData.filter(s => s.status === "sold").length,
      suspendedStocks: stocksData.filter(s => s.status === "suspended").length,
      disabledStocks: stocksData.filter(s => s.status === "disabled").length,
      activeStocks: stocksData.filter(s => s.status === "active").length,
      usedStocks: stocksData.filter(s => s.status === "used").length
    };
  };

  // Filter stocks based on search and status
  useEffect(() => {
    let filtered = stocks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(stock =>
        stock.wiseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.wiseEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getUserName(stock.soldTo)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(stock => stock.status === statusFilter);
    }

    setFilteredStocks(filtered);
    setStats(calculateStats(filtered));
  }, [searchTerm, statusFilter, stocks, users]);

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  const deleteStock = async (stockId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://btts-server-production.up.railway.app/wise-stocks/${stockId}`,
          {
            headers: {
              "x-api-key": "admin123456",
            },
          }
        );

        Swal.fire({
          title: "Deleted!",
          text: "Wise stock has been deleted.",
          icon: "success",
          confirmButtonColor: "#0d9488",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchStocks();
      } catch (error) {
        console.error("Error deleting Wise stock:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete Wise stock",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchStocks(), fetchUsers()]);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Wise stocks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Wise Stocks Management
            </h1>
            <p className="text-gray-600">Manage your Wise account inventory</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/add-wise-stocks")}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Wise Stock
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-gray-600 text-xs mb-1">Total</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.totalStocks}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-gray-600 text-xs mb-1">Available</p>
              <p className="text-xl font-bold text-green-600">
                {stats.availableStocks}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-gray-600 text-xs mb-1">Sold</p>
              <p className="text-xl font-bold text-blue-600">
                {stats.soldStocks}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-gray-600 text-xs mb-1">Active</p>
              <p className="text-xl font-bold text-teal-600">
                {stats.activeStocks}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-gray-600 text-xs mb-1">Suspended</p>
              <p className="text-xl font-bold text-yellow-600">
                {stats.suspendedStocks}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-gray-600 text-xs mb-1">Disabled</p>
              <p className="text-xl font-bold text-red-600">
                {stats.disabledStocks}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-gray-600 text-xs mb-1">Used</p>
              <p className="text-xl font-bold text-purple-600">
                {stats.usedStocks}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or sold to..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                fetchStocks();
                fetchUsers();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-300 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stocks Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Wise Account
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Added By
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Sold To
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date Added
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStocks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No Wise stocks found</p>
                        <p className="text-sm">
                          {searchTerm || statusFilter !== "all" 
                            ? "Try adjusting your search or filter criteria" 
                            : "Add your first Wise stock to get started"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map((stock) => (
                    <tr
                      key={stock._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {stock.wiseName}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {stock.wiseEmail}
                          </p>
                          <p className="text-gray-500 text-xs font-mono mt-1">
                            Pass: {stock.wisePassword}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium">
                          {stock.userName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm">
                          {stock.status === 'sold' ? getUserName(stock.soldTo) : "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            stock.status
                          )}`}
                        >
                          {getStatusLabel(stock.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        {new Date(stock.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/wise-stocks/${stock._id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteStock(stock._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                            title="Delete Stock"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">
            Showing {filteredStocks.length} of {stocks.length} stocks
            {searchTerm && ` • Search: "${searchTerm}"`}
            {statusFilter !== "all" && ` • Filter: ${getStatusLabel(statusFilter)}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllWiseStocks;