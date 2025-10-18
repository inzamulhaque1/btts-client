/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, ArrowRight, Search, Briefcase, Sparkles, Zap, Star, TrendingUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://btts-server-production.up.railway.app/services');
        const servicesData = response.data || [];
        setServices(servicesData);
        
        const serviceCounts = servicesData.reduce((acc, service) => {
          acc[service.category] = (acc[service.category] || 0) + 1;
          return acc;
        }, {});

        const uniqueCategories = [...new Set(servicesData.map(service => service.category))];
        const categoryList = [
          { 
            id: 'all', 
            name: 'All Services',
            count: servicesData.length
          },
          ...uniqueCategories.map(cat => ({
            id: cat,
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            count: serviceCounts[cat] || 0
          }))
        ];
        
        setCategories(categoryList);
      } catch (err) {
        setError('Failed to fetch services. Please try again later.');
        setServices([]);
        setCategories([{ id: 'all', name: 'All Services', count: 0 }]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleViewDetails = (serviceId) => {
    navigate(`/service-details/${serviceId}`);
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    if (searchExpanded) {
      setSearchTerm('');
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex items-center justify-center">
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          .animate-spin { animation: spin 1s linear infinite; }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        `}</style>
        
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative text-center">
          <div className="inline-block">
            <div className="w-20 h-20 border-4 border-teal-500/30 border-t-teal-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-teal-300 mt-6 text-lg font-semibold animate-pulse">Loading Services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative text-center glass-effect border border-red-500/30 rounded-2xl p-8 max-w-md">
          <p className="text-red-400 text-lg mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:from-red-400 hover:to-orange-400 hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
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

        @keyframes expandWidth {
          0% { width: 0; opacity: 0; }
          100% { width: 100%; opacity: 1; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.4), 0 0 40px rgba(20, 184, 166, 0.2); }
          50% { box-shadow: 0 0 30px rgba(20, 184, 166, 0.6), 0 0 60px rgba(20, 184, 166, 0.3); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
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

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        .animate-expand {
          animation: expandWidth 0.3s ease-out forwards;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }

        .glass-effect {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
        }

        .service-card {
          opacity: 0;
          animation: scaleIn 0.6s ease-out forwards;
        }

        .service-card:nth-child(1) { animation-delay: 0.05s; }
        .service-card:nth-child(2) { animation-delay: 0.1s; }
        .service-card:nth-child(3) { animation-delay: 0.15s; }
        .service-card:nth-child(4) { animation-delay: 0.2s; }
        .service-card:nth-child(5) { animation-delay: 0.25s; }
        .service-card:nth-child(6) { animation-delay: 0.3s; }
        .service-card:nth-child(7) { animation-delay: 0.35s; }
        .service-card:nth-child(8) { animation-delay: 0.4s; }
        .service-card:nth-child(9) { animation-delay: 0.45s; }
        .service-card:nth-child(10) { animation-delay: 0.5s; }
        .service-card:nth-child(11) { animation-delay: 0.55s; }
        .service-card:nth-child(12) { animation-delay: 0.6s; }

        .category-tab {
          position: relative;
          overflow: hidden;
        }

        .category-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.3), transparent);
          transition: left 0.5s;
        }

        .category-tab:hover::before {
          left: 100%;
        }

        @media (max-width: 640px) {
          .service-card:nth-child(n) { animation-delay: 0.1s; }
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        
        {/* Header */}
        <div className="text-center mb-8 opacity-0 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient-flow">
              Explore Premium Services
            </span>
          </h1>
        </div>

        {/* Compact Search & Filter Bar */}
        <div className="mb-10 opacity-0 animate-fade-in-up delay-100">
          <div className="glass-effect border border-teal-500/30 rounded-xl p-3 hover:border-teal-400/40 transition-all duration-300">
            <div className="flex flex-col lg:flex-row items-center gap-3">
              
              {/* Search Section */}
              <div className="w-full lg:w-auto flex items-center gap-2">
                {/* Search Icon Button */}
                <button
                  onClick={toggleSearch}
                  className={`flex-shrink-0 p-2.5 rounded-lg transition-all duration-300 ${
                    searchExpanded 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/40' 
                      : 'glass-effect border border-teal-500/30 text-teal-400 hover:border-teal-400/60 hover:text-teal-300'
                  }`}
                >
                  {searchExpanded ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>

                {/* Expandable Search Input */}
                {searchExpanded && (
                  <div className="flex-1 lg:w-64 relative animate-expand">
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                      className="w-full px-4 py-2.5 glass-effect border border-teal-500/30 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-400/60 transition-all duration-300"
                    />
                    {searchTerm && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded border border-teal-400/30">
                        <span className="text-teal-300 text-xs font-semibold">{filteredServices.length}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Results count when search is collapsed */}
                {!searchExpanded && searchTerm && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-lg border border-teal-400/30">
                    <span className="text-teal-300 text-xs font-semibold">{filteredServices.length} results</span>
                  </div>
                )}
              </div>

              {/* Category Tabs */}
              <div className="flex-1 w-full lg:w-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`category-tab group flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white '
                        : 'glass-effect text-slate-300 border border-teal-500/30 hover:border-teal-400/60 hover:text-white'
                    }`}
                  >
                    <Briefcase className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 ${selectedCategory === category.id ? 'rotate-12' : 'group-hover:rotate-12'}`} />
                    <span className="hidden sm:inline">{category.name}</span>
                    <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                    <div className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-all duration-300 ${
                      selectedCategory === category.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-teal-500/20 text-teal-400 group-hover:bg-teal-500/30'
                    }`}>
                      {category.count}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="service-card group"
                
              >
                <div className="relative h-full rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-teal-500/30 backdrop-blur-sm hover:border-teal-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/30 overflow-hidden">
                  
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-cyan-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
                  
                  {/* Service Image */}
                  {service.image && (
                    <div className="relative h-40 sm:h-44 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                      
                      {/* Floating Premium Badge */}
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/50 animate-glow">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white" />
                          <span className="text-white text-[10px] sm:text-xs font-bold">PREMIUM</span>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 px-2 sm:px-3 py-1 rounded-lg glass-effect border border-teal-400/40 backdrop-blur-md">
                        <span className="text-teal-300 text-[10px] sm:text-xs font-semibold">{service.category}</span>
                      </div>
                    </div>
                  )}

                  <div className="relative p-4 sm:p-5 space-y-3 sm:space-y-4">
                    {/* Title */}
                    <h3 className="font-bold text-white text-base sm:text-lg leading-tight group-hover:text-teal-300 transition-all duration-300">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 group-hover:text-slate-300 transition-colors duration-300">
                      {service.description}
                    </p>

                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                      <div className="space-y-1.5 sm:space-y-2">
                        {service.features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="mt-0.5 p-1 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 group-hover:from-teal-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                              <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
                            </div>
                            <span className="text-slate-300 text-xs sm:text-sm leading-snug group-hover:text-white transition-colors duration-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Price Section */}
                    <div className="pt-3 sm:pt-4 border-t border-teal-500/20 group-hover:border-teal-400/30 transition-colors duration-300">
                      {service.price && (
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div>
                            <div className="flex items-baseline gap-1 sm:gap-1.5">
                              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-gradient-flow">
                                ${service.price}
                              </span>
                              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">USD</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <TrendingUp className="w-3 h-3 text-green-400" />
                              <span className="text-[10px] sm:text-xs text-green-400 font-semibold">Best Value</span>
                            </div>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 group-hover:from-teal-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
                          </div>
                        </div>
                      )}

                      {/* Button */}
                      <button 
                        onClick={() => handleViewDetails(service._id)}
                        className="w-full flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/40 text-teal-300 font-bold text-xs sm:text-sm rounded-xl hover:from-teal-500 hover:to-cyan-500 hover:text-white hover:border-teal-400/60 hover:shadow-xl hover:shadow-teal-500/50 transition-all duration-300 relative overflow-hidden group/btn"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 animate-shimmer"></div>
                        <span className="relative font-bold">View Details</span>
                        <ArrowRight className="relative w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-teal-400/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Bottom Glow */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Sparkle */}
                    <Sparkles className="absolute top-3 sm:top-4 right-3 sm:right-4 w-3 h-3 sm:w-4 sm:h-4 text-teal-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 opacity-0 animate-fade-in-up">
            <div className="glass-effect border border-teal-500/30 rounded-2xl p-8 sm:p-12 max-w-xl mx-auto hover:border-teal-400/50 transition-all duration-300">
              <div className="inline-block mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 text-teal-400" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">No Services Found</h3>
              <p className="text-slate-400 text-base sm:text-lg">
                {services.length === 0 
                  ? 'No services available at the moment.' 
                  : 'Try adjusting your search or filters.'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
};

export default Services;