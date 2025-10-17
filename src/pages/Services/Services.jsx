/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, ArrowRight, Search, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://btts-server-production.up.railway.app/services');
        const servicesData = response.data || [];
        setServices(servicesData);
        
        // Calculate service counts for each category
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2 text-sm">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Our Services
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              Professional document templates and services tailored to your needs.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar - Fixed width */}
            <div className="w-full lg:w-80 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Category Filter with counts */}
            <div className="flex-1 flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors text-sm ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <Briefcase className="w-3 h-3" />
                  {category.name}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    selectedCategory === category.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-300 text-gray-700'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg overflow-hidden group"
              >
                
                {/* Service Image */}
                {service.image && (
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="p-4 space-y-4">
                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-900 text-base leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  {/* Price */}
                  {service.price && (
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-2xl font-bold text-green-600">
                        ${service.price}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        USD
                      </span>
                    </div>
                  )}

                  {/* Features - Show only first 2 */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2">
                      {service.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Details Button */}
                  <button 
                    onClick={() => handleViewDetails(service._id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors group-hover:shadow-md"
                  >
                    <span className="text-sm">View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <p className="text-gray-600 text-sm">
                {services.length === 0 
                  ? 'No services available at the moment.' 
                  : 'No services found. Try adjusting your search or filters.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;