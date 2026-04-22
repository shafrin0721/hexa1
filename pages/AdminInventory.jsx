import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Package, AlertCircle, TrendingUp, Loader2, Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { adminAPI } from '../services/adminApi';

export default function AdminInventory() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockCount: 0,
    turnoverRate: 0
  });
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: 0,
    price: 0,
    location: 'Warehouse A',
    category_id: null,
    description: '',
    image: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, inventoryRes] = await Promise.all([
        adminAPI.getInventoryStats(),
        adminAPI.getInventoryItems()
      ]);
      
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      
      if (inventoryRes.data.success) {
        const formattedInventory = inventoryRes.data.data.map(item => ({
          ...item,
          price: typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0),
          quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : (item.quantity || 0)
        }));
        setInventory(formattedInventory);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Convert to base64 for storage (or you can upload to server)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async () => {
    if (!formData.name || !formData.sku) {
      setError('Product name and SKU are required');
      return;
    }

    setLoading(true);
    try {
      const response = await adminAPI.addInventoryItem({
        name: formData.name,
        sku: formData.sku,
        quantity: parseInt(formData.quantity) || 0,
        price: parseFloat(formData.price) || 0,
        location: formData.location,
        category_id: formData.category_id,
        description: formData.description,
        image: formData.image || '/src/assets/default-product.jpg'
      });
      
      if (response.data.success) {
        setSuccess('Product added successfully!');
        setShowModal(false);
        resetForm();
        fetchInventoryData();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !formData.name) {
      setError('Product name is required');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        quantity: parseInt(formData.quantity) || 0,
        price: parseFloat(formData.price) || 0,
        category_id: formData.category_id,
        description: formData.description
      };
      
      // Only include image if it was changed
      if (formData.image && formData.image !== editingItem.image) {
        updateData.image = formData.image;
      }
      
      const response = await adminAPI.updateInventoryItem(editingItem.id, updateData);
      
      if (response.data.success) {
        setSuccess('Product updated successfully!');
        setEditingItem(null);
        resetForm();
        fetchInventoryData();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setLoading(true);
      try {
        const response = await adminAPI.deleteInventoryItem(id);
        if (response.data.success) {
          setSuccess('Product deleted successfully!');
          fetchInventoryData();
          setTimeout(() => setSuccess(null), 3000);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product');
        setTimeout(() => setError(null), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      location: item.location || 'Warehouse A',
      category_id: item.category_id || null,
      description: item.description || '',
      image: item.image || ''
    });
    setImagePreview(item.image || null);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      quantity: 0,
      price: 0,
      location: 'Warehouse A',
      category_id: null,
      description: '',
      image: ''
    });
    setImagePreview(null);
    setEditingItem(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
    setError(null);
  };

  if (loading && inventory.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 text-black">
        <h1 className="text-4xl font-bold">Inventory Management</h1>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Items</p>
                <p className="text-4xl font-bold mt-2">{stats.totalItems}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Stock Alert</p>
                <p className="text-4xl font-bold mt-2">{stats.lowStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Turnover Rate</p>
                <p className="text-4xl font-bold mt-2">{stats.turnoverRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Inventory Items</h3>
            <button 
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Image</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Product Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">SKU</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No inventory items found. Click "Add Item" to create one.
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <img 
                          src={item.image || '/src/assets/default-product.jpg'} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src = '/src/assets/default-product.jpg';
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-sm">{item.sku}</td>
                      <td className="py-3 px-4 text-gray-900 font-medium">{item.quantity}</td>
                      <td className="py-3 px-4 text-gray-900">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                          item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.location}</td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-gray-500">
          <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded border"
                    />
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter SKU"
                  disabled={!!editingItem}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Warehouse A">Warehouse A</option>
                  <option value="Warehouse B">Warehouse B</option>
                  <option value="Warehouse C">Warehouse C</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Product description"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdateItem : handleAddItem}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingItem ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}