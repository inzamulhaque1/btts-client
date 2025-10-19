/* eslint-disable no-unused-vars */
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../provider/AuthProvider';
import { useState } from 'react';
import { Eye, EyeOff, LogIn, Shield, User, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the previous path - FIXED LOGIC
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return setError('Please fill in all fields');
    }

    try {
      setError('');
      setLoading(true);
      
      // Call login function
      await login(email, password);
      
      // Navigate to the previous page or home
      console.log('Redirecting to:', from); // Debug log
      navigate(from, { replace: true });
      
    } catch (error) {
      setError('Bro Check Your Email Or Password You Entered Wrong Information');
      setLoading(false);
    }
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
      <div className="relative md:mt-14  z-10 w-full max-w-md mx-4 lg:max-w-4xl">
        <div className="flex flex-col lg:flex-row bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl border border-teal-500/30 shadow-2xl shadow-teal-500/20 overflow-hidden">
          
          {/* Mobile & Tablet: Top Section - Branding */}
          <div className="lg:hidden p-8 text-center border-b border-teal-500/20 bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30">
                <Shield className="w-8 h-8 text-teal-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              TheTrustSeller
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Secure Login</p>
          </div>

          {/* Desktop: Left Side - Branding */}
          <div className="hidden lg:flex lg:w-2/5 p-12 flex-col justify-center items-center text-center bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-r border-teal-500/20">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30 mb-8">
              <Shield className="w-16 h-16 text-teal-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent mb-4">
              TheTrustSeller
            </h1>
            <p className="text-xl text-slate-300">Premium Services</p>
            <p className="text-teal-400 font-semibold">Secure Access</p>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-12">
            <div className="max-w-sm mx-auto">
              {/* Desktop Form Header */}
              <div className="hidden lg:block text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-slate-400">Sign in to your account</p>
              </div>

              {/* Mobile Form Header */}
              <div className="lg:hidden text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">
                  Sign In
                </h2>
                <p className="text-slate-400 text-sm">Access your account</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm text-sm">
                    {error}
                  </div>
                )}
                
                {/* Email Input */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    <User className="w-4 h-4 mr-2 text-teal-400" />
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
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Sign In</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-slate-400 text-sm sm:text-base">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="font-semibold text-teal-400 hover:text-teal-300 transition-colors duration-200 hover:underline"
                    >
                      Sign up
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

export default Login;