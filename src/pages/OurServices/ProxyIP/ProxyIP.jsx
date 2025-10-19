/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
  Shield, 
  Zap, 
  Clock, 
  DollarSign, 
  CheckCircle2,
  Globe,
  Lock,
  Server,
  ArrowRight,
  Send,
  Sparkles,
  CreditCard,
  Users,
  MessageCircle
} from 'lucide-react';

const ProxyService = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: Shield,
      title: 'High Security',
      description: 'Enterprise-grade SOCKS5 & HTTP proxies',
      color: 'bg-teal-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: '99.9% uptime with blazing speeds',
      color: 'bg-teal-600'
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Round-the-clock proxy service',
      color: 'bg-teal-500'
    },
    {
      icon: DollarSign,
      title: 'Affordable',
      description: 'Starting from just 100 BDT',
      color: 'bg-teal-600'
    }
  ];

  const pricing = [
    {
      duration: '12 Hours',
      price: '100',
      popular: false,
      features: ['SOCKS5 Proxy', 'HTTP Proxy', 'Instant Activation', '24/7 Support']
    },
    {
      duration: '24 Hours',
      price: '140',
      popular: true,
      features: ['SOCKS5 Proxy', 'HTTP Proxy', 'Instant Activation', '24/7 Support', 'Priority Support']
    }
  ];

  const paymentMethods = [
    { name: 'bKash', number: '01760935893', color: 'bg-teal-500' },
    { name: 'Nagad', number: '01732551463', color: 'bg-teal-600' },
    { name: 'Rocket', number: '01732551463-7', color: 'bg-teal-500' }
  ];

  const steps = [
    { number: '1', title: 'Sign Up', desc: 'Create account with email' },
    { number: '2', title: 'Choose Plan', desc: 'Select proxy & duration' },
    { number: '3', title: 'Payment', desc: 'Pay via bKash/Nagad' },
    { number: '4', title: 'Get Proxy', desc: 'Receive details instantly' }
  ];

  const handleTelegramRedirect = () => {
    window.open('https://t.me/btheproxifier_bot', '_blank');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
          50% { box-shadow: 0 0 40px rgba(20, 184, 166, 0.6); }
        }

        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
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
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradientFlow 5s ease infinite;
        }

        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }

        .glass-effect {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(16px);
        }

        .hover-lift {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-12px);
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-3xl animate-float"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)'
          }}></div>
        </div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-bounce-subtle"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-teal-400 rounded-full animate-bounce-subtle delay-500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-teal-300 rounded-full animate-float delay-300"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20 space-y-8">
          <div className="inline-block mb-6 opacity-0 animate-fade-in-down">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-500/30 blur-2xl rounded-full animate-pulse-glow"></div>
              <Globe className="relative w-20 h-20 text-teal-400 animate-float mx-auto" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold opacity-0 animate-fade-in-down delay-200">
            <span className="text-white">B-The Proxy Service</span>
            <span className="block mt-3 text-teal-400">
              High-Speed Proxies 24/7
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fade-in-up delay-400">
            Premium SOCKS5 & HTTP proxies for your online work and freelancing needs.
            <span className="block mt-2 font-semibold text-teal-300">
              Lightning fast, secure, and affordable!
            </span>
          </p>

          {/* CTA Button */}
          <div className="opacity-0 animate-scale-in delay-500">
            <button
              onClick={handleTelegramRedirect}
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-teal-500 text-white font-bold text-lg hover:bg-teal-600 hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-500 hover:scale-110 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 animate-shimmer"></div>
              <Send className="w-6 h-6 relative group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative">Get Started on Telegram</span>
              <ArrowRight className="w-6 h-6 relative group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <p className="mt-4 text-sm text-slate-400">
              🤖 Automated bot • ⚡ Instant setup • 🔒 Secure payment
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`group glass-effect border border-teal-500/30 rounded-2xl p-6 hover-lift hover:border-teal-400/60 hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 relative overflow-hidden cursor-pointer opacity-0 animate-scale-in delay-${600 + index * 100}`}
              >
                <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <div className={`absolute inset-0 ${feature.color} rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <div className={`relative p-5 rounded-xl ${feature.color} bg-opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                        <Icon className="w-8 h-8 text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  <Sparkles className="w-5 h-5 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-2 right-2 animate-pulse" />
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 opacity-0 animate-fade-in-up delay-700">
            How It <span className="text-teal-400">Works</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`glass-effect border border-teal-500/30 rounded-2xl p-6 hover:border-teal-400/60 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-500 relative overflow-hidden opacity-0 animate-scale-in delay-${800 + index * 100}`}
              >
                <div className="absolute top-0 right-0 text-8xl font-bold text-teal-500/5">
                  {step.number}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-teal-500 bg-opacity-20 flex items-center justify-center mb-4 border border-teal-400/40">
                    <span className="text-2xl font-bold text-teal-400">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-teal-400/50" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Simple <span className="text-teal-400">Pricing</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan, index) => (
              <div
                key={index}
                className={`glass-effect border ${plan.popular ? 'border-teal-400/60 shadow-2xl shadow-teal-500/30' : 'border-teal-500/30'} rounded-3xl p-8 hover:border-teal-400/70 hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 relative overflow-hidden group`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-bl-2xl rounded-tr-3xl">
                    POPULAR
                  </div>
                )}
                
                <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.duration}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-teal-400">
                      {plan.price}
                    </span>
                    <span className="text-slate-400 ml-2">BDT</span>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleTelegramRedirect}
                    className={`w-full py-4 rounded-xl font-bold text-white ${plan.popular ? 'bg-teal-500 hover:bg-teal-600' : 'glass-effect border border-teal-500/30 hover:border-teal-400/60'} transition-all duration-300 hover:scale-105`}
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Payment <span className="text-teal-400">Methods</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="glass-effect border border-teal-500/30 rounded-2xl p-6 hover:border-teal-400/60 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-500 text-center group"
              >
                <div className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{method.name}</h3>
                <p className="text-teal-300 font-mono font-semibold">{method.number}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-slate-400 text-sm">
              ⏱️ Approval usually takes 5-30 minutes after payment verification
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="glass-effect border border-teal-500/30 rounded-3xl p-12 text-center relative overflow-hidden group hover:border-teal-400/60 transition-all duration-500">
          <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative">
            <MessageCircle className="w-16 h-16 text-teal-400 mx-auto mb-6 animate-float" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied customers using our premium proxy service. Start your journey with B-The Proxy now!
            </p>
            
            <button
              onClick={handleTelegramRedirect}
              className="group/btn inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-teal-500 text-white font-bold text-lg hover:bg-teal-600 hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-500 hover:scale-110 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 animate-shimmer"></div>
              <Send className="w-6 h-6 relative group-hover/btn:rotate-12 transition-transform duration-300" />
              <span className="relative">Open Telegram Bot</span>
              <ArrowRight className="w-6 h-6 relative group-hover/btn:translate-x-2 transition-transform duration-300" />
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                <span>500+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400" />
                <span>Instant Setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>Need help? Contact our sales admin: <span className="text-teal-400 font-semibold">@iam_nokib</span></p>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent"></div>
    </div>
  );
};

export default ProxyService;