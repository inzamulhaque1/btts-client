import React from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Construction, 
  Wrench, 
  Hammer,
  Settings,
  Sparkles
} from "lucide-react";

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main Content */}
        <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          {/* Icons Container */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="p-4 bg-white/20 rounded-2xl">
              <Construction className="w-12 h-12 text-white" />
            </div>
            <div className="p-4 bg-white/20 rounded-2xl animate-bounce">
              <Hammer className="w-12 h-12 text-white" />
            </div>
            <div className="p-4 bg-white/20 rounded-2xl">
              <Wrench className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Under Construction
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-6 font-light">
            Something amazing is coming soon!
          </p>

          {/* Description */}
          <div className="bg-white/10 rounded-2xl p-6 mb-8 border border-white/20">
            <p className="text-white/80 text-lg mb-4">
              We're working hard to bring you an incredible experience. 
              This page is currently being built with care and attention to detail.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-white/70">
              <Settings className="w-5 h-5 animate-spin" />
              <span className="text-sm">Crafting something special for you</span>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-white/80 text-sm mb-2">
              <span>Progress</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full animate-pulse"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              Go Back
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-white/60 text-sm">
              Need immediate assistance?{" "}
              <a 
                href="mailto:support@example.com" 
                className="text-white hover:text-yellow-300 transition-colors underline"
              >
                Contact our team
              </a>
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-10 left-10 w-6 h-6 bg-yellow-300 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-10 right-10 w-4 h-4 bg-cyan-300 rounded-full animate-bounce opacity-60 animation-delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-pink-300 rounded-full animate-ping opacity-40"></div>
        
        {/* Footer */}
        <div className="mt-8 text-white/40 text-sm">
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default UnderConstruction;