// src/pages/AdminCharts.jsx - With Order Status Change Functionality
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { MapPin, Send, Loader2, Download, Search, Calendar, AlertCircle, RefreshCw, Eye, X, Edit2, Check, ChevronDown } from 'lucide-react';
import adminAPI from '../services/adminApi';

export default function AdminCharts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrderStatus, setEditingOrderStatus] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // State for charts data
  const [revenueData, setRevenueData] = useState([]);
  const [shipmentData, setShipmentData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [customerTypeData, setCustomerTypeData] = useState([]);
  
  // State for tables
  const [ordersTable, setOrdersTable] = useState([]);
  const [activitiesData, setActivitiesData] = useState([]);
  const [shipmentsData, setShipmentsData] = useState([]);

  // Track which APIs failed
  const [apiErrors, setApiErrors] = useState({
    revenue: false,
    shipmentStatus: false,
    orderStatus: false,
    locationSales: false,
    channelSales: false,
    customerType: false,
    recentOrders: false,
    recentActivities: false,
    recentShipments: false
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-700' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-700' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-700' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700' }
  ];

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    setApiErrors({
      revenue: false,
      shipmentStatus: false,
      orderStatus: false,
      locationSales: false,
      channelSales: false,
      customerType: false,
      recentOrders: false,
      recentActivities: false,
      recentShipments: false
    });
    
    try {
      const [
        revenueRes,
        shipmentStatusRes,
        orderStatusRes,
        locationSalesRes,
        channelSalesRes,
        customerTypeRes,
        recentOrdersRes,
        recentActivitiesRes,
        recentShipmentsRes
      ] = await Promise.all([
        adminAPI.getRevenueData(dateRange).catch(err => ({ data: { success: false, data: [] } })),
        adminAPI.getShipmentStatusData().catch(err => ({ data: { success: false, data: [] } })),
        adminAPI.getOrderStatusData().catch(err => ({ data: { success: false, data: [] } })),
        adminAPI.getLocationSalesData().catch(err => ({ data: { success: false, data: [] } })),
        adminAPI.getChannelSalesData().catch(err => ({ data: { success: false, data: [] } })),
        adminAPI.getCustomerTypeData().catch(err => ({ data: { success: false, data: [] } })),
        adminAPI.getRecentOrders(10).catch(err => ({ data: { success: false, data: [] } })),
        adminAPI.getRecentActivities(10).catch(err => ({ data: { success: false, data: [] } })),
        adminAPI.getRecentShipments(10).catch(err => ({ data: { success: false, data: [] } }))
      ]);

      // Set revenue data
      if (revenueRes.data.success && revenueRes.data.data && revenueRes.data.data.length > 0) {
        setRevenueData(revenueRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, revenue: true }));
      }

      // Set shipment data
      if (shipmentStatusRes.data.success && shipmentStatusRes.data.data && shipmentStatusRes.data.data.length > 0) {
        setShipmentData(shipmentStatusRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, shipmentStatus: true }));
      }

      // Set orders data
      if (orderStatusRes.data.success && orderStatusRes.data.data && orderStatusRes.data.data.length > 0) {
        setOrdersData(orderStatusRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, orderStatus: true }));
      }

      // Set location data
      if (locationSalesRes.data.success && locationSalesRes.data.data && locationSalesRes.data.data.length > 0) {
        setLocationData(locationSalesRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, locationSales: true }));
      }

      // Set channel data
      if (channelSalesRes.data.success && channelSalesRes.data.data && channelSalesRes.data.data.length > 0) {
        setChannelData(channelSalesRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, channelSales: true }));
      }

      // Set customer type data
      if (customerTypeRes.data.success && customerTypeRes.data.data && customerTypeRes.data.data.length > 0) {
        setCustomerTypeData(customerTypeRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, customerType: true }));
      }

      // Set orders table
      if (recentOrdersRes.data.success && recentOrdersRes.data.data && recentOrdersRes.data.data.length > 0) {
        setOrdersTable(recentOrdersRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, recentOrders: true }));
      }

      // Set activities
      if (recentActivitiesRes.data.success && recentActivitiesRes.data.data && recentActivitiesRes.data.data.length > 0) {
        setActivitiesData(recentActivitiesRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, recentActivities: true }));
      }

      // Set shipments
      if (recentShipmentsRes.data.success && recentShipmentsRes.data.data && recentShipmentsRes.data.data.length > 0) {
        setShipmentsData(recentShipmentsRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, recentShipments: true }));
      }

      // Check if all APIs failed
      const allFailed = Object.values(apiErrors).every(v => v === true);
      if (allFailed) {
        setError('Unable to fetch any data. Please check your database connection.');
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to connect to the server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await adminAPI.updateOrderStatus(orderId, newStatus);
      if (response.data.success) {
        // Update local state
        setOrdersTable(prevOrders => 
          prevOrders.map(order => 
            (order.id === orderId || order.order_id === orderId) 
              ? { ...order, status: newStatus }
              : order
          )
        );
        
        // Also update selectedOrder if it's open
        if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.order_id === orderId)) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
        
        // Show success message
        alert(`Order #${orderId} status updated to ${newStatus}`);
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
      setEditingOrderStatus(null);
    }
  };

  const handleExport = async (type) => {
    try {
      const response = await adminAPI.exportData(type, dateRange);
      if (response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export data');
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      const response = await adminAPI.getOrderById(orderId);
      if (response.data.success) {
        setSelectedOrder(response.data.data);
        setShowOrdersModal(true);
      } else {
        // If API doesn't exist, show basic order info from table
        const order = ordersTable.find(o => o.id === orderId || o.order_id === orderId);
        setSelectedOrder(order);
        setShowOrdersModal(true);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      // Show basic order info from table
      const order = ordersTable.find(o => o.id === orderId || o.order_id === orderId);
      setSelectedOrder(order);
      setShowOrdersModal(true);
    }
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status?.toLowerCase());
    return option?.color || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status?.toLowerCase());
    return option?.label || status || 'Pending';
  };

  // Safe filtering with proper type checking
  const filteredOrders = ordersTable.filter(order => {
    const orderId = order.id || order.order_id || '';
    const customerName = order.customer_name || order.user_name || '';
    const searchLower = searchTerm.toLowerCase();
    
    return String(orderId).toLowerCase().includes(searchLower) || 
           String(customerName).toLowerCase().includes(searchLower);
  });

  const totalShipments = shipmentData.reduce((sum, item) => sum + (item.value || 0), 0);
  const totalShipmentsCount = shipmentsData.length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Data</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchAllData}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={18} />
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Check if there's any data to display
  const hasAnyData = revenueData.length > 0 || shipmentData.length > 0 || ordersData.length > 0 || 
                     locationData.length > 0 || channelData.length > 0 || customerTypeData.length > 0 ||
                     ordersTable.length > 0 || activitiesData.length > 0 || shipmentsData.length > 0;

  if (!hasAnyData) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-6">No data found in the database. Please add some data to see analytics.</p>
            <button 
              onClick={fetchAllData}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 text-black">
        <div className="flex items-center justify-between text-black">
          <div>
            <h1 className="text-4xl font-bold">Charts and Tables</h1>
            <p className="text-gray-600 mt-1">Analytics and insights from your data</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
        </div>

        {/* Show partial data warnings */}
        {Object.values(apiErrors).some(v => v === true) && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span>Some data could not be loaded. The charts below may be incomplete.</span>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Recent Orders</h3>
              <div className="flex items-center gap-2 text-sm">
                <div className="relative">
                  <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-7 pr-3 py-1 border border-gray-200 rounded text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button 
                  onClick={() => handleExport('orders')}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1"
                >
                  <Download size={14} /> Export
                </button>
              </div>
            </div>

            {apiErrors.recentOrders ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                <p>Unable to load orders data</p>
                <button 
                  onClick={fetchAllData}
                  className="mt-2 text-blue-600 text-sm hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : ordersTable.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders found
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Delivered to</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.slice(0, 5).map((order, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-blue-600 font-mono text-xs">
                            #{order.id || order.order_id}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {order.customer_name || order.user_name || 'Guest'}
                          </td>
                          <td className="py-3 px-4">
                            {editingOrderStatus === (order.id || order.order_id) ? (
                              <div className="flex items-center gap-1">
                                <select
                                  value={order.status?.toLowerCase() || 'pending'}
                                  onChange={(e) => handleUpdateOrderStatus(order.id || order.order_id, e.target.value)}
                                  className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  disabled={updatingStatus}
                                >
                                  {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => setEditingOrderStatus(null)}
                                  className="p-1 text-gray-500 hover:text-gray-700"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {getStatusLabel(order.status)}
                                </span>
                                <button
                                  onClick={() => setEditingOrderStatus(order.id || order.order_id)}
                                  className="p-1 text-gray-400 hover:text-blue-600 transition"
                                  title="Edit Status"
                                >
                                  <Edit2 size={12} />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium">
                            ${(order.total || order.amount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {order.shipping_country || order.delivered_to || 'N/A'}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleViewOrderDetails(order.id || order.order_id)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-center text-sm">
                  <button 
                    onClick={() => setShowOrdersModal(true)}
                    className="text-blue-600 hover:underline"
                  >
                    View all orders ↓
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Activities */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Recent Activities</h3>
              <button 
                onClick={() => handleExport('activities')}
                className="text-gray-600 hover:bg-gray-100 p-1 rounded"
              >
                <Download size={16} />
              </button>
            </div>
            
            {apiErrors.recentActivities ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                <p>Unable to load activities</p>
              </div>
            ) : activitiesData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent activities
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {activitiesData.map((activity, idx) => (
                  <div key={idx} className="pb-4 border-b border-gray-100 last:border-0">
                    <p className="font-medium text-sm">{activity.user || activity.user_name || 'System'}</p>
                    <p className="text-xs text-gray-600 mt-1">{activity.action}</p>
                    {activity.file && (
                      <p className="text-xs text-blue-600 mt-1">📄 {activity.file}</p>
                    )}
                    {activity.text && (
                      <p className="text-xs text-gray-600 mt-1">{activity.text}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">{activity.time || 'Just now'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Charts Grid - Same as before */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sources of Sales */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Sources of Sales</h3>
              <button onClick={() => handleExport('sales-sources')} className="text-blue-600 text-sm flex items-center gap-1">
                <Download size={14} /> Export
              </button>
            </div>

            {apiErrors.locationSales && apiErrors.channelSales && apiErrors.customerType ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                <p>Unable to load sales data</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Locations */}
                {!apiErrors.locationSales && locationData.length > 0 && (
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm font-medium mb-3 flex items-center gap-2">
                      <MapPin size={16} /> Locations
                    </p>
                    {locationData.map((loc, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-600">{loc.region}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-medium">${(loc.value || 0).toLocaleString()}</span>
                          <span className="text-gray-400">{loc.pct || `${Math.round((loc.value / locationData.reduce((s, l) => s + (l.value || 0), 0)) * 100)}%`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Channels */}
                {!apiErrors.channelSales && channelData.length > 0 && (
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm font-medium mb-3">Channels</p>
                    {channelData.map((ch, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-600">{ch.channel}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-medium">${(ch.value || 0).toLocaleString()}</span>
                          <span className="text-gray-400">{ch.pct || `${Math.round((ch.value / channelData.reduce((s, c) => s + (c.value || 0), 0)) * 100)}%`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Customer Types */}
                {!apiErrors.customerType && customerTypeData.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-3">Customers</p>
                    {customerTypeData.map((cust, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-600">{cust.type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-medium">{cust.value}</span>
                          <span className="text-gray-400">{cust.pct || `${Math.round((cust.value / customerTypeData.reduce((s, c) => s + (c.value || 0), 0)) * 100)}%`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sales Channels Pie */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg mb-4">Sales Channels</h3>
            {apiErrors.channelSales || channelData.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-gray-500">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>No channel data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ channel, percent }) => `${channel}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#1e40af', '#60a5fa'][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Customer Types Pie */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg mb-4">Customer Types</h3>
            {apiErrors.customerType || customerTypeData.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-gray-500">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>No customer data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={customerTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#1e40af', '#60a5fa'][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipment Overview */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg mb-4">Shipment Overview</h3>
            {apiErrors.shipmentStatus || shipmentData.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>No shipment data available</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={shipmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={({ status, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {shipmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill || ['#3b82f6', '#1e40af', '#93c5fd'][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-4">
                    <p className="text-3xl font-bold">{totalShipments || totalShipmentsCount}</p>
                    <p className="text-gray-600 text-sm">Total Shipments</p>
                  </div>
                </div>
                <div>
                  <div className="space-y-3 max-h-[250px] overflow-y-auto">
                    <h4 className="font-semibold text-sm">Recent Shipments</h4>
                    {apiErrors.recentShipments || shipmentsData.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">No recent shipments</p>
                    ) : (
                      shipmentsData.slice(0, 5).map((ship, idx) => (
                        <div key={idx} className="pb-3 border-b border-gray-100 last:border-0">
                          <p className="text-sm text-blue-600 font-medium">{ship.tracking_number || ship.id}</p>
                          <p className="text-xs text-gray-600">
                            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                              ship.status === 'Completed' || ship.status === 'delivered' ? 'bg-green-500' :
                              ship.status === 'Ongoing' || ship.status === 'in_transit' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}></span>
                            {ship.status}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{ship.date}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Revenue Overview</h3>
              <button onClick={() => handleExport('revenue')} className="text-blue-600 text-sm flex items-center gap-1">
                <Download size={14} /> Export
              </button>
            </div>
            {apiErrors.revenue || revenueData.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-gray-500">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>No revenue data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#3b82f6" name="Revenue" />
                  <Line type="monotone" dataKey="trend" stroke="#1e40af" strokeWidth={2} name="Trend" dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Orders Details Modal */}
      {showOrdersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {selectedOrder ? 'Order Details' : 'All Orders'}
              </h2>
              <button
                onClick={() => {
                  setShowOrdersModal(false);
                  setSelectedOrder(null);
                  setEditingOrderStatus(null);
                }}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 max-h-[calc(80vh-120px)]">
              {selectedOrder ? (
                // Single order details view
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Order ID</label>
                      <p className="font-mono text-lg">#{selectedOrder.id || selectedOrder.order_id}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        {editingOrderStatus === (selectedOrder.id || selectedOrder.order_id) ? (
                          <div className="flex items-center gap-1">
                            <select
                              value={selectedOrder.status?.toLowerCase() || 'pending'}
                              onChange={(e) => handleUpdateOrderStatus(selectedOrder.id || selectedOrder.order_id, e.target.value)}
                              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              disabled={updatingStatus}
                            >
                              {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => setEditingOrderStatus(null)}
                              className="p-1 text-gray-500 hover:text-gray-700"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                              {getStatusLabel(selectedOrder.status)}
                            </span>
                            <button
                              onClick={() => setEditingOrderStatus(selectedOrder.id || selectedOrder.order_id)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition"
                              title="Edit Status"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Customer Name</label>
                      <p className="font-medium">{selectedOrder.customer_name || selectedOrder.user_name || 'Guest'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Total Amount</label>
                      <p className="font-bold text-lg">${(selectedOrder.total || selectedOrder.amount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Delivered To</label>
                      <p>{selectedOrder.shipping_country || selectedOrder.delivered_to || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Order Date</label>
                      <p>{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                  
                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Order Items</h3>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-2">Product</th>
                            <th className="text-left p-2">Quantity</th>
                            <th className="text-left p-2">Price</th>
                            <th className="text-left p-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="p-2">{item.product_name || `Product #${item.product_id}`}</td>
                              <td className="p-2">{item.quantity}</td>
                              <td className="p-2">${item.price}</td>
                              <td className="p-2">${item.quantity * item.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                // All orders list view
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left p-3">Order ID</th>
                        <th className="text-left p-3">Customer</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Amount</th>
                        <th className="text-left p-3">Delivered To</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersTable.map((order, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-blue-600 font-mono">#{order.id || order.order_id}</td>
                          <td className="p-3">{order.customer_name || order.user_name || 'Guest'}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusLabel(order.status)}
                              </span>
                              <button
                                onClick={() => handleViewOrderDetails(order.id || order.order_id)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition"
                                title="Edit Status"
                              >
                                <Edit2 size={12} />
                              </button>
                            </div>
                          </td>
                          <td className="p-3 font-medium">${(order.total || order.amount || 0).toLocaleString()}</td>
                          <td className="p-3">{order.shipping_country || order.delivered_to || 'N/A'}</td>
                          <td className="p-3 text-xs text-gray-500">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleViewOrderDetails(order.id || order.order_id)}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              {selectedOrder && (
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Back to All Orders
                </button>
              )}
              <button
                onClick={() => {
                  setShowOrdersModal(false);
                  setSelectedOrder(null);
                  setEditingOrderStatus(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}