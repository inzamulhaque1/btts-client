import React, { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Phone, Shield, User, Edit3, Save, X, Calendar, UserCheck } from "lucide-react";
import { useAuth } from "../../provider/AuthProvider";

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    mobile: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!currentUser?.uid) {
      console.log("No UID yet");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://btts-server-production.up.railway.app/users/${currentUser.uid}`
        );
        console.log("Fetched user data:", res.data);
        setUserData(res.data);
        setFormData({
          displayName: res.data.displayName || '',
          mobile: res.data.mobile || ''
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentUser]);

  const handleEdit = () => {
    setEditing(true);
    setMessage("");
    setError("");
  };

  const handleCancel = () => {
    setEditing(false);
    if (userData) {
      setFormData({
        displayName: userData.displayName || '',
        mobile: userData.mobile || ''
      });
    }
    setMessage("");
    setError("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await axios.put(
        `https://btts-server-production.up.railway.app/users/${currentUser.uid}`, 
        formData,
        { timeout: 10000 }
      );
      
      if (response.data.success) {
        setUserData(response.data.user);
        setEditing(false);
        setMessage('Profile updated successfully! 🎉');
        setTimeout(() => setMessage(''), 5000);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'from-red-500 to-pink-500';
      case 'moderator': return 'from-purple-500 to-indigo-500';
      default: return 'from-teal-500 to-cyan-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center max-w-md mx-4">
          <User className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Profile</h3>
          <p className="text-slate-400 mb-4">{error || "No user data found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            User Profile
          </h1>
          <p className="text-slate-400">Manage your account information</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-xl backdrop-blur-sm border bg-red-500/20 border-red-400/50 text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 rounded-xl backdrop-blur-sm border bg-green-500/20 border-green-400/50 text-green-300">
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-teal-500/30 shadow-2xl shadow-teal-500/20 overflow-hidden">
          {/* Card Header */}
          <div className="p-6 border-b border-teal-500/20 bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-teal-400" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-white">
                    {userData.displayName || 'No Name Set'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRoleBadgeColor(userData.userRole)} bg-clip-text text-transparent border border-current`}>
                      {userData.userRole?.toUpperCase()}
                    </span>
                    <UserCheck className="w-4 h-4 text-teal-400" />
                  </div>
                </div>
              </div>
              
              {!editing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-teal-500/30"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-xl transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 lg:p-8">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-400" />
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  <div className="group">
                    <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                      <User className="w-4 h-4 mr-2 text-teal-400" />
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-800/30 border border-slate-600 rounded-xl text-white">
                        {userData.displayName || 'Not set'}
                      </div>
                    )}
                  </div>

                  <div className="group">
                    <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                      <Phone className="w-4 h-4 mr-2 text-teal-400" />
                      Mobile Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all duration-300"
                        placeholder="Enter your mobile number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-800/30 border border-slate-600 rounded-xl text-white">
                        {userData.mobile || 'Not set'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-400" />
                  Account Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                      <Mail className="w-4 h-4 mr-2 text-teal-400" />
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-slate-800/30 border border-slate-600 rounded-xl text-white">
                      {userData.email}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                      <UserCheck className="w-4 h-4 mr-2 text-teal-400" />
                      User ID
                    </label>
                    <div className="px-4 py-3 bg-slate-800/30 border border-slate-600 rounded-xl text-white font-mono text-sm break-all">
                      {userData.uid}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-teal-400" />
                      Member Since
                    </label>
                    <div className="px-4 py-3 bg-slate-800/30 border border-slate-600 rounded-xl text-white">
                      {formatDate(userData.createdAt)}
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

export default Profile;