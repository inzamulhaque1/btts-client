import React from 'react';
import { Shield, Users, Award, Target, Zap, Heart, Globe, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your privacy and security are our top priorities. We ensure all transactions are secure and confidential.'
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Get your documents instantly. We value your time and deliver premium quality at lightning speed.'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Professional-grade templates and editing services that meet the highest industry standards.'
    },
    {
      icon: Heart,
      title: '24/7 Support',
      description: 'Our dedicated team is always here to help you. Round-the-clock support for all your needs.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Clients', icon: Users },
    { number: '50K+', label: 'Documents Delivered', icon: Award },
    { number: '99%', label: 'Satisfaction Rate', icon: TrendingUp },
    { number: '150+', label: 'Countries Served', icon: Globe }
  ];

  const features = [
    'Fully Editable PSD & Template Files',
    'All Country Wise Documents',
    'Professional VPS Services',
    'Custom Document Editing',
    'Utility Bills & Bank Statements',
    'ID Cards & Licenses',
    'Fast Turnaround Time',
    'Lifetime Support'
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-60px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(60px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 1s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 1s ease-out forwards;
        }
        
        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradientFlow 5s ease infinite;
        }
        
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Hero Section */}
        <div className="text-center mb-20 space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold opacity-0 animate-fade-in-up delay-100">
            <span className="text-white">Who We Are</span>
            <span className="block mt-3 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient-flow">
              Your Global Service Partner
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto space-y-6 opacity-0 animate-fade-in-up delay-300">
            <p className="text-xl md:text-2xl font-semibold text-slate-200 leading-relaxed">
              We specialize in providing premium services worldwide with complete customization
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-base md:text-lg">
              <div className="group px-6 py-3 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/40 backdrop-blur-sm hover:scale-110 hover:border-teal-400/60 transition-all duration-500 cursor-pointer">
                <span className="font-bold bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent group-hover:from-teal-200 group-hover:to-cyan-200 transition-all duration-500">
                  ✦ All Country Wise
                </span>
              </div>
              
              <div className="group px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-sm hover:scale-110 hover:border-cyan-400/60 transition-all duration-500 cursor-pointer">
                <span className="font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent group-hover:from-cyan-200 group-hover:to-blue-200 transition-all duration-500">
                  ✦ Fully Editable Files
                </span>
              </div>
              
              <div className="group px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-teal-500/20 border border-blue-400/40 backdrop-blur-sm hover:scale-110 hover:border-blue-400/60 transition-all duration-500 cursor-pointer">
                <span className="font-bold bg-gradient-to-r from-blue-300 to-teal-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-teal-200 transition-all duration-500">
                  ✦ VPS Services
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fade-in-up delay-500">
            With years of experience serving clients across 150+ countries, we're committed to 
            delivering excellence in every service. From editable templates to VPS solutions, 
            we provide everything you need to succeed.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className={`opacity-0 animate-scale-in delay-${300 + (index * 100)}`}
              >
                <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-teal-500/30 backdrop-blur-sm hover:border-teal-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/30 overflow-hidden text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-cyan-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    <Icon className="w-8 h-8 text-teal-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-500" />
                    <p className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</p>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 opacity-0 animate-fade-in-down delay-500">
            Our Core <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Values</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index} 
                  className={`opacity-0 ${index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'} delay-${600 + (index * 100)}`}
                >
                  <div className="group relative h-full p-8 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-teal-500/20 backdrop-blur-sm hover:border-teal-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-cyan-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/10 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
                    
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <Icon className="w-8 h-8 text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors duration-300">
                        {value.title}
                      </h3>
                      
                      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 opacity-0 animate-fade-in-up delay-700">
            What We <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Offer</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`opacity-0 animate-scale-in delay-${800 + (index * 50)}`}
              >
                <div className="group p-4 rounded-xl bg-slate-800/40 border border-teal-500/20 backdrop-blur-sm hover:bg-slate-800/60 hover:border-teal-400/40 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-300">
                      {feature}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center max-w-4xl mx-auto opacity-0 animate-fade-in-up delay-900">
          <div className="p-10 rounded-3xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-400/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/5 to-transparent animate-shimmer"></div>
            
            <div className="relative">
              <Target className="w-16 h-16 text-teal-400 mx-auto mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                To empower individuals and businesses worldwide with professional-grade document solutions 
                that are accessible, affordable, and delivered with unmatched quality. We believe everyone 
                deserves access to premium document services, and we're here to make that a reality.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
};

export default AboutUs;