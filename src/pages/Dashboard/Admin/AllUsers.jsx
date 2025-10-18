import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Search,
  Filter,
  RefreshCw,
  User,
  Shield,
  UserCheck,
  Edit3,
  MoreVertical,
  Loader,
  Trash2,
} from "lucide-react";
import { usePrivateRoute } from "../../../components/usePrivateRoute";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingUser, setUpdatingUser] = useState(null);
  usePrivateRoute(["admin"]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://btts-server-production.up.railway.app/users",
        {
          headers: {
            "x-api-key": "admin123456", // Use your actual admin API key
          },
        }
      );
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);

      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        Swal.fire({
          title: "Access Denied!",
          text: "You do not have permission to access this data.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#ef4444",
          background: "#1e293b",
          color: "white",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch users data",
          icon: "error",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#ef4444",
          background: "#1e293b",
          color: "white",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and role filter
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.uid?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.userRole === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  // Update user role
  const updateUserRole = async (uid, newRole) => {
    try {
      setUpdatingUser(uid);

      const result = await Swal.fire({
        title: "Update User Role?",
        html: `Are you sure you want to change this user's role to <strong>${newRole}</strong>?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Update!",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#0d9488",
        cancelButtonColor: "#ef4444",
        background: "#1e293b",
        color: "white",
      });

      if (result.isConfirmed) {
        // ADD API KEY HEADER HERE
        await axios.put(
          `https://btts-server-production.up.railway.app/users/${uid}/role`,
          {
            userRole: newRole,
          },
          {
            headers: {
              "x-api-key": "admin123456", // Add this line
            },
          }
        );

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.uid === uid ? { ...user, userRole: newRole } : user
          )
        );

        Swal.fire({
          title: "Success!",
          text: `User role updated to ${newRole}`,
          icon: "success",
          confirmButtonColor: "#0d9488",
          background: "#1e293b",
          color: "white",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);

      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        Swal.fire({
          title: "Permission Denied!",
          text: "You need admin privileges to update user roles.",
          icon: "error",
          confirmButtonColor: "#ef4444",
          background: "#1e293b",
          color: "white",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to update user role",
          icon: "error",
          confirmButtonColor: "#ef4444",
          background: "#1e293b",
          color: "white",
        });
      }
    } finally {
      setUpdatingUser(null);
    }
  };
  // Delete user
  const deleteUser = async (uid, userName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      html: `You are about to delete user: <strong>${
        userName || "Unknown User"
      }</strong><br>This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#1e293b",
      color: "white",
    });

    if (result.isConfirmed) {
      try {
        // You'll need to add this endpoint to your server
        await axios.delete(
          `https://btts-server-production.up.railway.app/users/${uid}`,
          {
            headers: {
              "x-api-key": "admin123456",
            },
          }
        );

        // Remove user from local state
        setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid));
        setFilteredUsers((prevUsers) =>
          prevUsers.filter((user) => user.uid !== uid)
        );

        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#0d9488",
          background: "#1e293b",
          color: "white",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error deleting user:", error);

        if (error.response?.status === 401 || error.response?.status === 403) {
          Swal.fire({
            title: "Permission Denied!",
            text: "You need admin privileges to delete users.",
            icon: "error",
            confirmButtonColor: "#ef4444",
            background: "#1e293b",
            color: "white",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete user",
            icon: "error",
            confirmButtonColor: "#ef4444",
            background: "#1e293b",
            color: "white",
          });
        }
      }
    }
  };
  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-300 border-purple-500/50";
      case "moderator":
        return "bg-blue-500/20 text-blue-300 border-blue-500/50";
      case "user":
        return "bg-teal-500/20 text-teal-300 border-teal-500/50";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/50";
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "moderator":
        return <UserCheck className="w-4 h-4" />;
      case "user":
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300 text-lg">Loading users data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-slate-400">
            Manage and update user roles and permissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="p-3 bg-teal-500/20 rounded-full">
                <User className="w-6 h-6 text-teal-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Admins</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter((u) => u.userRole === "admin").length}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Moderators</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter((u) => u.userRole === "moderator").length}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <UserCheck className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Regular Users</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter((u) => u.userRole === "user").length}
                </p>
              </div>
              <div className="p-3 bg-slate-500/20 rounded-full">
                <User className="w-6 h-6 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or UID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-slate-400">
                        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No users found</p>
                        <p className="text-sm">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.uid}
                      className="hover:bg-slate-700/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                            <span className="font-bold text-slate-900 text-sm">
                              {user.displayName?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {user.displayName || "Unknown User"}
                            </p>
                            <p className="text-sm text-slate-400">
                              {user.email}
                            </p>
                            <p className="text-xs text-slate-500 font-mono">
                              {user.uid}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                            user.userRole
                          )}`}
                        >
                          {getRoleIcon(user.userRole)}
                          {user.userRole?.charAt(0).toUpperCase() +
                            user.userRole?.slice(1) || "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {user.createdAt
                          ? formatDate(user.createdAt)
                          : "Unknown"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/50">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {/* Role Change Dropdown */}
                          <div className="relative">
                            <select
                              value={user.userRole}
                              onChange={(e) =>
                                updateUserRole(user.uid, e.target.value)
                              }
                              disabled={updatingUser === user.uid}
                              className="appearance-none bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="user">User</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                            </select>
                            {updatingUser === user.uid && (
                              <Loader className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-500 animate-spin" />
                            )}
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              deleteUser(user.uid, user.displayName)
                            }
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                            title="Delete User"
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
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>

      {/* SweetAlert2 Dark Theme CSS */}
      <style jsx global>{`
        .sweet-alert-dark {
          background: #1e293b !important;
        }
        .sweet-alert-dark .swal2-title {
          color: white !important;
        }
        .sweet-alert-dark .swal2-html-container {
          color: #cbd5e1 !important;
        }
      `}</style>
    </div>
  );
};

export default AllUsers;
