/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Loader,
  Package
} from 'lucide-react';

const AllServices = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingService, setEditingService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    image: '',
    deliveryTime: '',
    popular: false,
    features: [''],
    paymentMethods: ['']
  });

  // Fetch all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://btts-server-production.up.railway.app/services', {
        headers: {
          'x-api-key': 'admin123456'
        }
      });
      setServices(response.data);
      setFilteredServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch services',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#1f2937'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services
  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(service => service.category === categoryFilter);
    }

    setFilteredServices(filtered);
  }, [searchTerm, categoryFilter, services]);

  // Get unique categories
  const categories = ['all', ...new Set(services.map(service => service.category))];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle array fields (features, paymentMethods)
  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  // Add new item to array
  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // Remove item from array
  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Create new service
  const createService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://btts-server-production.up.railway.app/services', 
        {
          ...formData,
          features: formData.features.filter(f => f.trim() !== ''),
          paymentMethods: formData.paymentMethods.filter(p => p.trim() !== '')
        },
        {
          headers: {
            'x-api-key': 'admin123456'
          }
        }
      );

      Swal.fire({
        title: 'Success!',
        text: 'Service created successfully',
        icon: 'success',
        confirmButtonColor: '#0d9488',
        background: '#ffffff',
        color: '#1f2937',
        timer: 2000,
        showConfirmButton: false
      });

      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error creating service:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create service',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#1f2937'
      });
    }
  };

  // Update service
  const updateService = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://btts-server-production.up.railway.app/services/${editingService._id}`, 
        {
          ...formData,
          features: formData.features.filter(f => f.trim() !== ''),
          paymentMethods: formData.paymentMethods.filter(p => p.trim() !== '')
        },
        {
          headers: {
            'x-api-key': 'admin123456'
          }
        }
      );

      Swal.fire({
        title: 'Success!',
        text: 'Service updated successfully',
        icon: 'success',
        confirmButtonColor: '#0d9488',
        background: '#ffffff',
        color: '#1f2937',
        timer: 2000,
        showConfirmButton: false
      });

      setShowModal(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update service',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#1f2937'
      });
    }
  };

  // Delete service
  const deleteService = async (serviceId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#ffffff',
      color: '#1f2937'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://btts-server-production.up.railway.app/services/${serviceId}`, {
          headers: {
            'x-api-key': 'admin123456'
          }
        });

        Swal.fire({
          title: 'Deleted!',
          text: 'Service has been deleted.',
          icon: 'success',
          confirmButtonColor: '#0d9488',
          background: '#ffffff',
          color: '#1f2937',
          timer: 2000,
          showConfirmButton: false
        });

        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete service',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#ffffff',
          color: '#1f2937'
        });
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      image: '',
      deliveryTime: '',
      popular: false,
      features: [''],
      paymentMethods: ['']
    });
  };

  // Open edit modal
  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      image: service.image,
      deliveryTime: service.deliveryTime,
      popular: service.popular || false,
      features: service.features.length > 0 ? service.features : [''],
      paymentMethods: service.paymentMethods.length > 0 ? service.paymentMethods : ['']
    });
    setShowModal(true);
  };

  // Open create modal
  const openCreateModal = () => {
    setEditingService(null);
    resetForm();
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Services</h1>
            <p className="text-gray-600">Manage your services and offerings</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <Package className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div>
              <p className="text-gray-600 text-sm">Popular Services</p>
              <p className="text-2xl font-bold text-gray-900">
                {services.filter(s => s.popular).length}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Categories</option>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={fetchServices}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-300 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <div key={service._id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:border-teal-500/50 transition-all duration-300">
              {/* Service Image */}
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Service Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {service.title}
                  </h3>
                  {service.popular && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {service.description}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-teal-600 font-bold">${service.price}</span>
                  <span className="text-gray-500 text-sm">{service.deliveryTime}</span>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-2">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 2).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 2 && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        +{service.features.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => openEditModal(service)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteService(service._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No services found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or add a new service</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingService ? 'Edit Service' : 'Create New Service'}
              </h2>
            </div>

            <form onSubmit={editingService ? updateService : createService} className="p-6 space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">Delivery Time</label>
                  <input
                    type="text"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-gray-700 text-sm mb-2">Features</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange('features', index, e.target.value)}
                      placeholder="Feature description"
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('features', index)}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('features')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-300 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-gray-700 text-sm mb-2">Payment Methods</label>
                {formData.paymentMethods.map((method, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={method}
                      onChange={(e) => handleArrayChange('paymentMethods', index, e.target.value)}
                      placeholder="Payment method"
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    {formData.paymentMethods.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('paymentMethods', index)}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('paymentMethods')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-300 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </button>
              </div>

              {/* Popular Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="popular"
                  checked={formData.popular}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-teal-500 bg-white border-gray-300 rounded focus:ring-teal-500"
                />
                <label className="text-gray-700 text-sm">Mark as popular service</label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300 font-semibold"
                >
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllServices;