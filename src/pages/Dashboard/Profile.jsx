import React, { useEffect, useState } from "react";
import { Mail, Phone, Shield, User, Calendar, UserCheck, Sparkles, Award, MapPin } from "lucide-react";
import { useAuth } from "../../provider/AuthProvider";

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser?.uid) {
      console.log("No UID yet");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://btts-server-production.up.railway.app/users/${currentUser.uid}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        // console.log("Fetched user data:", data);
        setUserData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentUser]);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-rose-500 to-pink-600';
      case 'moderator': return 'bg-gradient-to-r from-violet-500 to-purple-600';
      default: return 'bg-gradient-to-r from-emerald-500 to-teal-600';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return Shield;
      case 'moderator': return Award;
      default: return Sparkles;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Profile</h3>
          <p className="text-sm text-slate-400">{error || "No user data found"}</p>
        </div>
      </div>
    );
  }

  const RoleIcon = getRoleIcon(userData.userRole);

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      {/* Background gradient effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>
      
      <div className="relative max-w-6xl mx-auto">
        {/* Greeting Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {getGreeting()}, {userData.displayName?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-sm text-slate-400">Welcome back to your dashboard</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card - Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border-2 border-teal-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <User className="w-12 h-12 text-teal-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <UserCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <h2 className="text-lg font-bold text-white mt-4 text-center">
                  {userData.displayName || 'User'}
                </h2>
                
                {/* Role Badge */}
                <div className={`mt-3 px-4 py-1.5 rounded-full ${getRoleBadgeColor(userData.userRole)} flex items-center gap-2 shadow-lg`}>
                  <RoleIcon className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wide">
                    {userData.userRole}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Status</span>
                  <span className="flex items-center gap-2 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Member Since</span>
                  <span className="text-white">{formatDate(userData.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Information Cards - Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-teal-400" />
                </div>
                <h3 className="text-base font-semibold text-white">Personal Information</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                    <User className="w-3.5 h-3.5" />
                    Full Name
                  </label>
                  <div className="px-4 py-3 bg-slate-800/50 rounded-xl text-sm text-white border border-slate-700/50 group-hover:border-teal-500/30 transition-colors duration-200">
                    {userData.displayName || 'Not provided'}
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                    <Phone className="w-3.5 h-3.5" />
                    Phone Number
                  </label>
                  <div className="px-4 py-3 bg-slate-800/50 rounded-xl text-sm text-white border border-slate-700/50 group-hover:border-teal-500/30 transition-colors duration-200">
                    {userData.mobile || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-teal-400" />
                </div>
                <h3 className="text-base font-semibold text-white">Account Details</h3>
              </div>
              
              <div className="space-y-4">
                <div className="group">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                    <Mail className="w-3.5 h-3.5" />
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-slate-800/50 rounded-xl text-sm text-white border border-slate-700/50 group-hover:border-teal-500/30 transition-colors duration-200 break-all">
                    {userData.email}
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                    <UserCheck className="w-3.5 h-3.5" />
                    User ID
                  </label>
                  <div className="px-4 py-3 bg-slate-800/50 rounded-xl text-xs text-slate-400 font-mono border border-slate-700/50 group-hover:border-teal-500/30 transition-colors duration-200 break-all">
                    {userData.uid}
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Registration Date
                  </label>
                  <div className="px-4 py-3 bg-slate-800/50 rounded-xl text-sm text-white border border-slate-700/50 group-hover:border-teal-500/30 transition-colors duration-200">
                    {new Date(userData.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
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