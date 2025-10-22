import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ArrowLeft, Save, Loader, Shield, Upload, X, Image as ImageIcon } from 'lucide-react';

// Use your existing ml_default preset that is already UNSIGNED
const CLOUDINARY_CONFIG = {
  cloudName: 'dggaympdv', // Your cloud name
  uploadPreset: 'ml_default', // This exists and is UNSIGNED
};

const AddWiseStock = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({
    authImage: false,
    docImg1: false,
    docImg2: false
  });
  const [formData, setFormData] = useState({
    wiseName: '',
    wiseEmail: '',
    wisePassword: '',
    authImage: '',
    docImg1: '',
    docImg2: '',
    userName: '',
    userEmail: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simple HEIC to JPEG conversion using heic2any library
  const convertHeicToJpeg = async (file) => {
    try {
      const heic2any = (await import('heic2any')).default;
      
      const conversionResult = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      });

      const newFile = new File(
        [conversionResult],
        file.name.replace(/\.heic$/i, '.jpg'),
        {
          type: 'image/jpeg',
          lastModified: new Date().getTime()
        }
      );

      return newFile;
    } catch (error) {
      console.error('HEIC conversion error:', error);
      throw new Error('HEIC conversion failed. Please use JPEG or PNG format.');
    }
  };

  // Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    
    // Optional: Add folder for organization
    formData.append('folder', 'wise-stocks');

    console.log('Uploading to Cloudinary:', {
      cloudName: CLOUDINARY_CONFIG.cloudName,
      uploadPreset: CLOUDINARY_CONFIG.uploadPreset
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Cloudinary error:', data);
      throw new Error(data.error?.message || `Upload failed: ${response.status}`);
    }

    return data.secure_url;
  };

  // Enhanced image upload with Cloudinary
  const handleImageUpload = async (file, imageType) => {
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        title: 'File too large!',
        text: 'Please select an image smaller than 10MB',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/heic', 
      'image/heif',
      'image/webp',
      'image/gif',
      'application/octet-stream'
    ];
    
    const isHeic = file.type.includes('heic') || 
                   file.type.includes('heif') ||
                   file.name.toLowerCase().endsWith('.heic') ||
                   file.name.toLowerCase().endsWith('.heif');

    const isValidType = allowedTypes.includes(file.type.toLowerCase()) || isHeic;
    
    if (!isValidType) {
      Swal.fire({
        title: 'Invalid file type!',
        text: 'Please select JPG, PNG, WEBP, GIF, or HEIC image files',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [imageType]: true }));

      let fileToUpload = file;

      // Convert HEIC to JPEG if needed
      if (isHeic) {
        const conversionToast = Swal.fire({
          title: 'Converting HEIC...',
          text: 'Please wait while we convert your HEIC image',
          icon: 'info',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        try {
          fileToUpload = await convertHeicToJpeg(file);
          await conversionToast.close();
        } catch (conversionError) {
          await conversionToast.close();
          throw conversionError;
        }
      }

      // Upload to Cloudinary
      const uploadToast = Swal.fire({
        title: 'Uploading to Cloudinary...',
        text: 'Please wait while we upload your image',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const imageUrl = await uploadToCloudinary(fileToUpload);
      await uploadToast.close();

      setFormData(prev => ({
        ...prev,
        [imageType]: imageUrl
      }));
      
      Swal.fire({
        title: 'Success!',
        text: 'Image uploaded successfully to Cloudinary',
        icon: 'success',
        confirmButtonColor: '#0d9488',
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      
      let errorMessage = 'Failed to upload image. Please try again.';
      
      if (error.message.includes('Upload preset')) {
        errorMessage = 'Upload preset issue. Please check your Cloudinary configuration.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid request to Cloudinary.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      Swal.fire({
        title: 'Upload Failed!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setUploading(prev => ({ ...prev, [imageType]: false }));
    }
  };

  const removeImage = (imageType) => {
    setFormData(prev => ({
      ...prev,
      [imageType]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['wiseName', 'wiseEmail', 'wisePassword', 'userName', 'userEmail'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Swal.fire({
        title: 'Missing Fields!',
        text: 'Please fill in all required fields',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    // Check if all images are uploaded
    const imageFields = ['authImage', 'docImg1', 'docImg2'];
    const missingImages = imageFields.filter(field => !formData[field]);
    
    if (missingImages.length > 0) {
      Swal.fire({
        title: 'Missing Images!',
        text: 'Please upload all required images',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    try {
      setLoading(true);
      
      await axios.post('https://btts-server-production.up.railway.app/wise-stocks', 
        {
          ...formData,
          serviceName: 'WiseStock',
          status: 'available'
        },
        {
          headers: {
            'x-api-key': 'admin123456',
            'Content-Type': 'application/json'
          }
        }
      );

      Swal.fire({
        title: 'Success!',
        text: 'Wise stock added successfully',
        icon: 'success',
        confirmButtonColor: '#0d9488',
        timer: 1500,
        showConfirmButton: false
      });

      // Reset form after delay
      setTimeout(() => {
        setFormData({
          wiseName: '',
          wiseEmail: '',
          wisePassword: '',
          authImage: '',
          docImg1: '',
          docImg2: '',
          userName: '',
          userEmail: ''
        });
      }, 1500);

    } catch (error) {
      console.error('Error adding Wise stock:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add Wise stock. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  // Individual file input components
  const ImageUploadField = ({ label, imageType, required = true }) => {
    const uniqueId = `file-${imageType}-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && '*'}
        </label>
        
        {formData[imageType] ? (
          <div className="flex items-center gap-3 p-3 border border-green-300 rounded-lg bg-green-50">
            <div className="flex-shrink-0 w-12 h-12 border rounded overflow-hidden bg-white">
              <img 
                src={formData[imageType]} 
                alt={label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAxNkMyMC42ODYzIDE2IDE4IDE4LjY4NjMgMTggMjJDMiAxOC42ODYzIDIwLjY4NjMgMTYgMjQgMTZaIiBmaWxsPSIjOEREQ0RGIi8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjYiIGZpbGw9IiM5Q0EzQkIiLz4KPHBhdGggZD0iTTM2IDM2SDEyQzEwLjg5NTQgMzYgMTAgMzUuMTA0NiAxMCAzNFYxNEMxMCAxMi44OTU0IDEwLjg5NTQgMTIgMTIgMTJIMzZDMzcuMTA0NiAxMiAzOCAxMi44OTU0IDM4IDE0VjM0QzM4IDM1LjM1MDUgMzcuMTA0NiAzNiAzNiAzNloiIGZpbGw9IiM5Q0EzQkIiLz4KPC9zdmc+';
                }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-green-600 font-medium">Image uploaded</p>
              <p className="text-xs text-green-500">Stored in Cloudinary</p>
            </div>
            <button
              type="button"
              onClick={() => removeImage(imageType)}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-400 transition-colors duration-200 bg-white">
            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png, image/heic, image/heif, image/webp, image/gif, .heic, .heif"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleImageUpload(file, imageType);
                e.target.value = '';
              }}
              className="hidden"
              id={uniqueId}
              disabled={uploading[imageType]}
            />
            <label
              htmlFor={uniqueId}
              className={`flex flex-col items-center cursor-pointer ${uploading[imageType] ? 'opacity-50' : ''}`}
            >
              {uploading[imageType] ? (
                <>
                  <Loader className="w-6 h-6 text-teal-500 animate-spin mb-1" />
                  <span className="text-xs text-gray-600">Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-600">Upload {label}</span>
                  <span className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP, GIF, HEIC • Max 10MB</span>
                </>
              )}
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Wise Stock</h1>
            <p className="text-gray-600 text-sm">Add a new Wise account to your inventory</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Wise Account Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Wise Account Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    name="wiseName"
                    value={formData.wiseName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="Enter account holder name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="wiseEmail"
                    value={formData.wiseEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="Enter Wise account email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="wisePassword"
                    value={formData.wisePassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="Enter Wise account password"
                  />
                </div>
              </div>

              {/* Image Uploads */}
              <div className="space-y-4 pt-4">
                <ImageUploadField 
                  label="Authentication Image" 
                  imageType="authImage" 
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageUploadField 
                    label="Document 1" 
                    imageType="docImg1" 
                  />
                  <ImageUploadField 
                    label="Document 2" 
                    imageType="docImg2" 
                  />
                </div>
              </div>
            </div>

            {/* Added By Details */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Added By</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400 text-white rounded-lg transition-all duration-200 font-semibold text-sm"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Adding...' : 'Add Wise Stock'}
              </button>
              
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Configuration Status */}
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-green-800 font-medium text-sm mb-2">✓ Configuration Correct!</h4>
          <ul className="text-green-700 text-xs space-y-1">
            <li>• Cloud Name: <strong>dg</strong> ✓</li>
            <li>• Upload Preset: <strong>ml_default</strong> ✓ (Unsigned)</li>
            <li>• Status: Ready to upload images</li>
          </ul>
        </div>

        {/* Info Box */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-800 font-medium text-sm mb-2">Important Notes:</h4>
          <ul className="text-blue-700 text-xs space-y-1">
            <li>• All fields marked with * are required</li>
            <li>• All images must be uploaded before submission</li>
            <li>• <strong>Cloudinary Storage:</strong> Images stored securely in Cloudinary</li>
            <li>• <strong>HEIC support:</strong> HEIC files automatically converted to JPEG</li>
            <li>• Maximum image size: 10MB per image</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddWiseStock;