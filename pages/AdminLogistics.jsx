// src/pages/AdminLogistics.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Package, Clock, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import adminAPI from '../services/adminApi';

export default function LogisticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [revenueCostData, setRevenueCostData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [shipmentData, setShipmentData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [error, setError] = useState(null);
  
  // Track which APIs failed
  const [apiErrors, setApiErrors] = useState({
    metrics: false,
    revenueCost: false,
    country: false,
    shipment: false,
    orders: false
  });

  useEffect(() => {
    fetchLogisticsData();
  }, []);

  const fetchLogisticsData = async () => {
    setLoading(true);
    setError(null);
    setApiErrors({
      metrics: false,
      revenueCost: false,
      country: false,
      shipment: false,
      orders: false
    });
    
    try {
      const [metricsRes, revenueCostRes, countryRes, shipmentRes, ordersRes] = await Promise.all([
        adminAPI.getMetrics(),
        adminAPI.getRevenueCostData(),
        adminAPI.getCountryData(),
        adminAPI.getShipmentData(),
        adminAPI.getOrdersData()
      ]);

      // Set metrics
      if (metricsRes.data.success && metricsRes.data.data) {
        setMetrics(metricsRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, metrics: true }));
      }

      // Set revenue cost data
      if (revenueCostRes.data.success && revenueCostRes.data.data && revenueCostRes.data.data.length > 0) {
        setRevenueCostData(revenueCostRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, revenueCost: true }));
      }

      // Set country data
      if (countryRes.data.success && countryRes.data.data && countryRes.data.data.length > 0) {
        setCountryData(countryRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, country: true }));
      }

      // Set shipment data
      if (shipmentRes.data.success && shipmentRes.data.data && shipmentRes.data.data.length > 0) {
        setShipmentData(shipmentRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, shipment: true }));
      }

      // Set orders data
      if (ordersRes.data.success && ordersRes.data.data && ordersRes.data.data.length > 0) {
        // Capitalize status names for better display
        const formattedOrders = ordersRes.data.data.map(order => ({
          name: order.name.charAt(0).toUpperCase() + order.name.slice(1),
          value: order.value
        }));
        setOrdersData(formattedOrders);
      } else {
        setApiErrors(prev => ({ ...prev, orders: true }));
      }

      // Check if all APIs failed
      const allFailed = Object.values(apiErrors).every(v => v === true);
      if (allFailed) {
        setError('Unable to fetch any logistics data. Please check your database connection.');
      }

    } catch (err) {
      console.error('Error fetching logistics data:', err);
      setError('Failed to connect to the server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

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
              onClick={fetchLogisticsData}
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
  const hasAnyData = metrics !== null || revenueCostData.length > 0 || countryData.length > 0 || 
                     shipmentData.length > 0 || ordersData.length > 0;

  if (!hasAnyData) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-6">No logistics data found in the database.</p>
            <button 
              onClick={fetchLogisticsData}
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

  const totalShipments = shipmentData.reduce((sum, item) => sum + (item.value || 0), 0);
  const ongoingShipment = shipmentData.find(s => s.name === 'Ongoing');
  const spaceUsedPercent = ongoingShipment && totalShipments > 0 
    ? Math.round((ongoingShipment.value / totalShipments) * 100)
    : 0;

  return (
    <AdminLayout>
      <div className="space-y-8 text-black">
        <h1 className="text-4xl font-bold">Logistics Dashboard</h1>

        {/* Show partial data warnings */}
        {Object.values(apiErrors).some(v => v === true) && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span>Some data could not be loaded. The charts below may be incomplete.</span>
            </div>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">Revenue</p>
                <p className="text-3xl font-bold mt-2">
                  {metrics ? `$${(metrics.revenue / 1000).toFixed(1)}k` : 'N/A'}
                </p>
                {metrics && (
                  <p className={`text-sm mt-2 ${metrics.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.revenueChange > 0 ? '↑' : '↓'} {Math.abs(metrics.revenueChange)}%
                  </p>
                )}
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Total revenue</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">Cost</p>
                <p className="text-3xl font-bold mt-2">
                  {metrics ? `$${(metrics.cost / 1000).toFixed(1)}k` : 'N/A'}
                </p>
                {metrics && (
                  <p className={`text-sm mt-2 ${metrics.costChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.costChange < 0 ? '↓' : '↑'} {Math.abs(metrics.costChange)}%
                  </p>
                )}
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Total shipping cost</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">Shipments</p>
                <p className="text-3xl font-bold mt-2">
                  {metrics ? metrics.shipments.toLocaleString() : 'N/A'}
                </p>
                {metrics && (
                  <p className={`text-sm mt-2 ${metrics.shipmentsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.shipmentsChange > 0 ? '↑' : '↓'} {Math.abs(metrics.shipmentsChange)}%
                  </p>
                )}
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Total shipments</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg Delivery Time</p>
                <p className="text-3xl font-bold mt-2">
                  {metrics ? metrics.avgDeliveryTime + ' days' : 'N/A'}
                </p>
                {metrics && (
                  <p className={`text-sm mt-2 ${metrics.deliveryChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.deliveryChange < 0 ? '↓' : '↑'} {Math.abs(metrics.deliveryChange)}%
                  </p>
                )}
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Average delivery time</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue vs Cost Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold mb-4">Revenue & Cost Trends</h3>
            {apiErrors.revenueCost ? (
              <div className="flex items-center justify-center h-[250px] text-gray-500">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Unable to load revenue data</p>
                </div>
              </div>
            ) : revenueCostData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueCostData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}k`} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} name="Cost" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-500">
                No revenue data available
              </div>
            )}
          </div>

          {/* Profit by Country */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Profit by Country ($)</h3>
              <button className="text-sm text-gray-600">Top 3 ↓</button>
            </div>
            {apiErrors.country ? (
              <div className="flex items-center justify-center h-[250px] text-gray-500">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Unable to load country data</p>
                </div>
              </div>
            ) : countryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={countryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}k`} />
                  <Line type="monotone" dataKey="italy" stroke="#3b82f6" strokeWidth={2} name="Italy" />
                  <Line type="monotone" dataKey="canada" stroke="#60a5fa" strokeWidth={2} name="Canada" />
                  <Line type="monotone" dataKey="us" stroke="#93c5fd" strokeWidth={2} name="USA" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-500">
                No country data available
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Warehouse Activities */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold">Warehouse Activities</h3>
              <a href="#" className="text-blue-600 text-sm font-medium">View all</a>
            </div>
            {apiErrors.shipment ? (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Unable to load shipment data</p>
                </div>
              </div>
            ) : shipmentData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={shipmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {shipmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill || ['#3b82f6', '#1e40af', '#93c5fd'][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-3xl font-bold">{spaceUsedPercent}%</p>
                  <p className="text-gray-600 text-sm">Space used</p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                No shipment data
              </div>
            )}
            {shipmentData.length > 0 && (
              <div className="flex gap-4 mt-4 text-xs flex-wrap">
                {shipmentData.map((item, idx) => (
                  <div key={idx}>
                    <p className="text-blue-600">● {item.name}: {item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shipment Overview */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold mb-4">Shipment Overview</h3>
            {apiErrors.shipment ? (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Unable to load shipment data</p>
                </div>
              </div>
            ) : shipmentData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={shipmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {shipmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill || ['#3b82f6', '#1e40af', '#93c5fd'][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-3xl font-bold">{totalShipments}</p>
                  <p className="text-gray-600 text-sm">Total Shipments</p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                No shipment data
              </div>
            )}
          </div>

          {/* Orders Bar Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Orders by Status</h3>
              <a href="/admin/orders" className="text-blue-600 text-sm font-medium">View all</a>
            </div>
            {apiErrors.orders ? (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Unable to load orders data</p>
                </div>
              </div>
            ) : ordersData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart 
                  data={ordersData} 
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" name="Orders">
                    {ordersData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#3b82f6" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                No order data available
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}