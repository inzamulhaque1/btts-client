/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock,
  Sparkles,
  CheckCircle2,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'pookling.jam@gmail.com',
      subContent: 'We reply within 24 hours',
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+8801728005274',
      subContent: 'Mon-Fri from 8am to 6pm',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '123 Business Avenue',
      subContent: 'New York, NY 10001',
      gradient: 'from-blue-500 to-teal-500'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: '24/7 Available',
      subContent: 'Round the clock support',
      gradient: 'from-teal-500 to-emerald-500'
    }
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: Twitter, label: 'Twitter', color: 'hover:text-cyan-400' },
    { icon: Instagram, label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-500' }
  ];

  const features = [
    'Fast Response Time',
    'Expert Support Team',
    'Secure Communication',
    'Multiple Contact Options'
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

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
          50% { box-shadow: 0 0 40px rgba(20, 184, 166, 0.6); }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes borderGlow {
          0%, 100% { border-color: rgba(20, 184, 166, 0.3); }
          50% { border-color: rgba(20, 184, 166, 0.7); }
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

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-border-glow {
          animation: borderGlow 3s ease-in-out infinite;
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
          backdrop-filter: blur(12px);
        }

        .hover-lift {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-8px);
        }

        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.2);
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl animate-float"></div>
        
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
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-bounce-subtle delay-500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-teal-300 rounded-full animate-float delay-300"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20 space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold opacity-0 animate-fade-in-down">
            <span className="text-white">Get In Touch</span>
            <span className="block mt-3 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient-flow">
              We're Here to Help
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fade-in-up delay-200">
            Have questions? Need support? Want to learn more about our services? 
            <span className="block mt-2 font-semibold text-teal-300">
              Our team is ready to assist you 24/7
            </span>
          </p>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-4 opacity-0 animate-fade-in-up delay-300">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-teal-400/30 hover:border-teal-400/60 hover:scale-105 transition-all duration-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-slate-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div className="opacity-0 animate-slide-in-left delay-400">
            <div className="glass-effect border border-teal-500/30 rounded-3xl p-8 hover:border-teal-400/50 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-cyan-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-6 h-6 text-teal-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Send Us a Message
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 rounded-xl glass-effect border border-teal-500/30 text-white placeholder-slate-500 focus:border-teal-400/70 focus:outline-none input-glow transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 rounded-xl glass-effect border border-teal-500/30 text-white placeholder-slate-500 focus:border-teal-400/70 focus:outline-none input-glow transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 rounded-xl glass-effect border border-teal-500/30 text-white placeholder-slate-500 focus:border-teal-400/70 focus:outline-none input-glow transition-all duration-300"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      rows="5"
                      className="w-full px-4 py-3 rounded-xl glass-effect border border-teal-500/30 text-white placeholder-slate-500 focus:border-teal-400/70 focus:outline-none input-glow transition-all duration-300 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="group w-full px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg hover:from-teal-400 hover:to-cyan-400 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
                    <span className="relative">Send Message</span>
                    <Send className="w-5 h-5 relative group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="opacity-0 animate-slide-in-right delay-500">
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={index}
                    className={`group glass-effect border border-teal-500/30 rounded-2xl p-6 hover-lift hover:border-teal-400/60 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-500 relative overflow-hidden opacity-0 animate-scale-in delay-${600 + index * 100}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-cyan-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative flex items-start gap-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${info.gradient} bg-opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-teal-300 transition-colors duration-300">
                          {info.title}
                        </h3>
                        <p className="text-slate-300 font-semibold mb-1">
                          {info.content}
                        </p>
                        <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                          {info.subContent}
                        </p>
                      </div>

                      <Sparkles className="w-4 h-4 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-4 right-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Social Links & Additional Info */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Social Media */}
          <div className="opacity-0 animate-fade-in-up delay-700">
            <div className="glass-effect border border-teal-500/30 rounded-2xl p-8 hover:border-teal-400/50 transition-all duration-500 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-cyan-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="inline-block mb-6">
                  <Globe className="w-12 h-12 text-teal-400 animate-float" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  Follow Us
                </h3>
                
                <p className="text-slate-400 mb-6">
                  Stay connected with us on social media
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <button
                        key={index}
                        className={`p-4 rounded-xl glass-effect border border-teal-500/30 hover:border-teal-400/60 ${social.color} hover:scale-125 hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 group/icon`}
                      >
                        <Icon className="w-6 h-6 text-slate-400 group-hover/icon:text-current transition-colors duration-300" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="opacity-0 animate-fade-in-up delay-800">
            <div className="glass-effect border border-teal-500/30 rounded-2xl p-8 hover:border-teal-400/50 transition-all duration-500 text-center relative overflow-hidden group h-full flex flex-col justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-cyan-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="inline-block mb-6 relative">
                  <div className="absolute inset-0 bg-teal-500/30 blur-xl rounded-full animate-pulse-glow"></div>
                  <Clock className="relative w-12 h-12 text-teal-400 group-hover:rotate-180 transition-transform duration-700" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  Quick Response
                </h3>
                
                <p className="text-slate-400 mb-4">
                  We typically respond within
                </p>
                
                <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/40">
                  <span className="text-3xl font-bold bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                    24 Hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
};

export default ContactUs;