import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../provider/AuthProvider";
import { Eye, EyeOff, User, Mail, Lock, Phone, UserPlus } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signup, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !mobile) {
      return setError("Please fill in all fields");
    }
    if (password.length < 6) {
      return setError("Password should be at least 6 characters");
    }

    try {
      setError("");
      setLoading(true);

      // Create Firebase user
      const { user } = await signup(email, password);

      // Update Firebase profile
      await updateUserProfile({ 
        displayName: name 
      });

      // Save user to MongoDB with userRole = "user"
      const res = await fetch("https://btts-server-production.up.railway.app/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: name,
          mobile: mobile,
          userRole: "user",
          createdAt: new Date(),
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // If MongoDB save fails, delete the Firebase user to keep both systems in sync
        await user.delete();
        throw new Error(data.message || "Failed to save user to database");
      }

      navigate(from, { replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative pt-16 lg:pt-0">
      {/* Animated Background */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-glow"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md mx-4 lg:max-w-4xl">
        <div className="flex flex-col lg:flex-row bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl border border-teal-500/30 shadow-2xl shadow-teal-500/20 overflow-hidden">
          
          {/* Mobile & Tablet: Top Section - Branding */}
          <div className="lg:hidden p-8 text-center border-b border-teal-500/20 bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30">
                <UserPlus className="w-8 h-8 text-teal-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              TheTrustSeller
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Create Account</p>
          </div>

          {/* Desktop: Left Side - Branding */}
          <div className="hidden lg:flex lg:w-2/5 p-12 flex-col justify-center items-center text-center bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-r border-teal-500/20">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30 mb-8">
              <UserPlus className="w-16 h-16 text-teal-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent mb-4">
              TheTrustSeller
            </h1>
            <p className="text-xl text-slate-300">Join Our Community</p>
            <p className="text-teal-400 font-semibold">Start Your Journey</p>
          </div>

          {/* Right Side - Register Form */}
          <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-12">
            <div className="max-w-sm mx-auto">
              {/* Desktop Form Header */}
              <div className="hidden lg:block text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Create Account
                </h2>
                <p className="text-slate-400">Join us today</p>
              </div>

              {/* Mobile Form Header */}
              <div className="lg:hidden text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">
                  Sign Up
                </h2>
                <p className="text-slate-400 text-sm">Create your account</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm text-sm">
                    {error}
                  </div>
                )}
                
                {/* Full Name Input */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    <User className="w-4 h-4 mr-2 text-teal-400" />
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 group-hover:border-teal-500/50 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    <Mail className="w-4 h-4 mr-2 text-teal-400" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 group-hover:border-teal-500/50 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Mobile Input */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-teal-400" />
                    Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 group-hover:border-teal-500/50 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="Enter your mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      maxLength={15}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    <Lock className="w-4 h-4 mr-2 text-teal-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 group-hover:border-teal-500/50 backdrop-blur-sm pr-12 text-sm sm:text-base"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-teal-400 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Minimum 6 characters</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none overflow-hidden text-sm sm:text-base"
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                  
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Create Account</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-slate-400 text-sm sm:text-base">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="font-semibold text-teal-400 hover:text-teal-300 transition-colors duration-200 hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient for Mobile */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
};

export default Register;