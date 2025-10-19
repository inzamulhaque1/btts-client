import React from 'react';
import { FileText, Award, Globe, Server, CheckCircle, ServerCogIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const features = [
    { icon: Globe, text: 'All Country Wise', path: '/services' },
    { icon: FileText, text: 'Editable Files', path: '/services' },
    { icon: Server, text: 'VPS Services', path: '/services' },
    { icon: ServerCogIcon, text: 'PROXY IP', path: '/Proxy'},
    { icon: Award, text: 'All Country SSN', path: '/services' }
  ];

  const congratulationText = "Congratulations";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <style>{`
        @keyframes letterGlow {
  0%, 100% { 
    opacity: 1;
    text-shadow: 
      0 0 10px rgba(0, 255, 255, 0.5),   /* cyan */
      0 0 20px rgba(0, 200, 255, 0.4);   /* light blue */
  }
  50% { 
    opacity: 0.8;
    text-shadow: 
      0 0 20px rgba(0, 255, 255, 0.9),   /* bright cyan */
      0 0 40px rgba(0, 180, 255, 0.8),   /* aqua-blue */
      0 0 60px rgba(0, 128, 255, 0.6);   /* deeper ocean blue */
  }
}

        
        @keyframes gradientShift {
          0%, 100% { 
            background-position: 0% 50%;
          }
          50% { 
            background-position: 100% 50%;
          }
        }
        
        @keyframes fadeSlide {
          0%, 100% { 
            opacity: 0.7; 
            transform: translateX(0);
          }
          50% { 
            opacity: 1; 
            transform: translateX(10px);
          }
        }
        
        @keyframes shimmer {
          0% { 
            background-position: -200% center;
          }
          100% { 
            background-position: 200% center;
          }
        }
        
        .animate-letter-glow {
          animation: letterGlow 2s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
        }
        
        .animate-fade-slide {
          animation: fadeSlide 2s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center space-y-8">
          {/* Main Heading with Letter Animation */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <div className="text-white">
                {congratulationText.split('').map((letter, index) => (
                  <span
                    key={index}
                    className="animate-letter-glow inline-block"
                    style={{
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </div>
              <span className="block mt-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient-shift">
                Dear Buyer
              </span>
            </h1>
            
            <div className="inline-block">
              <div className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/40 backdrop-blur-sm">
                <CheckCircle className="w-7 h-7 text-teal-400 animate-fade-slide" />
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                  YES, You're In The Right Place!
                </p>
              </div>
            </div>
          </div>

          {/* Feature Grid with SPECIFIC PATHS */}
          <div className="max-w-5xl mx-auto pt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="group relative">
                    <Link to={feature.path}>
                      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-teal-500/30 backdrop-blur-sm hover:border-teal-400/60 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-teal-500/30 overflow-hidden cursor-pointer">
                        {/* Animated Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-cyan-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
                        
                        <div className="relative flex flex-col items-center gap-4">
                          <div className="p-4 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 group-hover:from-teal-400/30 group-hover:to-cyan-400/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                            <Icon className="w-8 h-8 text-teal-400 group-hover:text-teal-300 transition-all duration-500" />
                          </div>
                          <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-all duration-500 text-center">
                            {feature.text}
                          </span>
                        </div>
                        
                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-teal-400/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Bottom Glow */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2 hover:text-teal-300 transition-colors duration-300 cursor-pointer">
              <CheckCircle className="w-5 h-5 text-teal-400" />
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2 hover:text-teal-300 transition-colors duration-300 cursor-pointer">
              <CheckCircle className="w-5 h-5 text-teal-400" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 hover:text-teal-300 transition-colors duration-300 cursor-pointer">
              <CheckCircle className="w-5 h-5 text-teal-400" />
              <span>100% Customizable</span>
            </div>
            <div className="flex items-center gap-2 hover:text-teal-300 transition-colors duration-300 cursor-pointer">
              <CheckCircle className="w-5 h-5 text-teal-400" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
};

export default Hero;