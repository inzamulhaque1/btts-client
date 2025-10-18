import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = 'https://btts-server-production.up.railway.app';
const IMGBB_API_KEY = '288f2bbd3e2c4d9db5eda66b617eb1c4';

const createService = async (serviceData) => {
  const response = await axios.post(`${API_BASE_URL}/services`, serviceData);
  return response.data;
};

const uploadImageToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', imageFile);

  const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

const AddServicePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'documents',
    features: ['', '', ''],
    popular: false,
    image: '',
    price: '',
    deliveryTime: '',
    paymentMethods: []
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const mutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      setSuccessMessage(true);
      setFormData({
        title: '',
        description: '',
        category: 'documents',
        features: ['', '', ''],
        popular: false,
        image: '',
        price: '',
        deliveryTime: '',
        paymentMethods: []
      });
      setImageFile(null);
      setImagePreview('');
      setTimeout(() => setSuccessMessage(false), 2000);
    },
  });

  const [successMessage, setSuccessMessage] = useState(false);

  const categories = [
    { id: 'documents', name: 'Documents' },
    { id: 'editableFile', name: 'EditableFile' },
    { id: 'wise', name: 'Wise' },
    { id: 'vps', name: 'VPS Services' }
  ];

  const paymentOptions = [
    { id: 'binance', name: 'Binance' },
    { id: 'bkash', name: 'BKash' },
    { id: 'nagad', name: 'Nagad' },
    { id: 'upay', name: 'Upay' },
    { id: 'roket', name: 'Roket' },
    { id: 'wise', name: 'Wise' },
    { id: 'payoneer', name: 'Payoneer' },
    { id: 'remitly', name: 'Remitly' },
    { id: 'ach', name: 'ACH' },
    { id: 'xoom', name: 'Xoom' }
  ];

  const deliveryTimeOptions = [
    { id: 'instant', name: 'Instant Delivery' },
    { id: '1hour', name: '1 Hour' },
    { id: '3hours', name: '3 Hours' },
    { id: '6hours', name: '6 Hours' },
    { id: '12hours', name: '12 Hours' },
    { id: '24hours', name: '24 Hours' },
    { id: '48hours', name: '48 Hours' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handlePaymentMethodChange = (methodId) => {
    setFormData(prev => {
      const currentMethods = prev.paymentMethods;
      const updatedMethods = currentMethods.includes(methodId)
        ? currentMethods.filter(method => method !== methodId)
        : [...currentMethods, methodId];
      
      return {
        ...prev,
        paymentMethods: updatedMethods
      };
    });
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = '';
      
      if (imageFile) {
        const imgbbResponse = await uploadImageToImgBB(imageFile);
        imageUrl = imgbbResponse.data.url;
      }

      const serviceData = {
        ...formData,
        image: imageUrl,
        features: formData.features.filter(f => f.trim() !== '')
      };

      mutation.mutate(serviceData);
    } catch (error) {
      console.error('Image upload failed:', error);
      mutation.mutate({
        ...formData,
        features: formData.features.filter(f => f.trim() !== '')
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-8">


        <div className="space-y-4">
          
          <h1 className="text-3xl font-bold text-gray-900">
            Add New Service
          </h1>
        </div>
      </div>

      {/* Error Message */}
      {mutation.isError && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {mutation.error.message}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image
                </label>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 32MB)</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Popular Service
                  </label>
                  <label className="flex items-center gap-3 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="popular"
                      checked={formData.popular}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Mark as Popular</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Delivery */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pricing & Delivery
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., $50, €45, 0.005 BTC"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time *
                </label>
                <select
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select delivery time</option>
                  {deliveryTimeOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Accepted Payment Methods
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {paymentOptions.map(payment => (
                <label key={payment.id} className="flex items-center gap-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.paymentMethods.includes(payment.id)}
                    onChange={() => handlePaymentMethodChange(payment.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">{payment.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Features
              </h2>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                + Add Feature
              </button>
            </div>

            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 bg-red-100 border border-red-200 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Service</span>
              )}
            </button>
          </div>
        </form>

        {/* Success Message */}
        {successMessage && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            ✓ Service added successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default AddServicePage;