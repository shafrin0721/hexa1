// src/pages/AdminCustomers.jsx - NO SAMPLE DATA VERSION
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import adminAPI from '../services/adminApi';

export default function AdminCustomers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('3D');
  
  // State for charts data
  const [customerData, setCustomerData] = useState([]);
  const [unitsData, setUnitsData] = useState([]);
  const [assignmentData, setAssignmentData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [productivityData, setProductivityData] = useState(null);
  
  // Track which APIs failed
  const [apiErrors, setApiErrors] = useState({
    ratings: false,
    units: false,
    assignment: false,
    comments: false,
    productivity: false
  });

  useEffect(() => {
    fetchCustomerData();
  }, [dateRange]);

  const fetchCustomerData = async () => {
    setLoading(true);
    setError(null);
    setApiErrors({
      ratings: false,
      units: false,
      assignment: false,
      comments: false,
      productivity: false
    });
    
    try {
      const [
        ratingsRes,
        unitsRes,
        assignmentRes,
        commentsRes,
        productivityRes
      ] = await Promise.all([
        adminAPI.getCustomerData(),
        adminAPI.getUnitsData(),
        adminAPI.getAssignmentData(),
        adminAPI.getCommentData(dateRange),
        adminAPI.getProductivityData()
      ]);

      // Set customer ratings data - NO FALLBACK
      if (ratingsRes.data.success && ratingsRes.data.data && ratingsRes.data.data.length > 0) {
        setCustomerData(ratingsRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, ratings: true }));
      }

      // Set units data - NO FALLBACK
      if (unitsRes.data.success && unitsRes.data.data && unitsRes.data.data.length > 0) {
        setUnitsData(unitsRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, units: true }));
      }

      // Set assignment data - NO FALLBACK
      if (assignmentRes.data.success && assignmentRes.data.data && assignmentRes.data.data.length > 0) {
        setAssignmentData(assignmentRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, assignment: true }));
      }

      // Set comment data - NO FALLBACK
      if (commentsRes.data.success && commentsRes.data.data && commentsRes.data.data.length > 0) {
        setCommentData(commentsRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, comments: true }));
      }

      // Set productivity data - NO FALLBACK
      if (productivityRes.data.success && productivityRes.data.data) {
        setProductivityData(productivityRes.data.data);
      } else {
        setApiErrors(prev => ({ ...prev, productivity: true }));
      }

      // Check if all APIs failed
      const allFailed = Object.values(apiErrors).every(v => v === true);
      if (allFailed) {
        setError('Unable to fetch any customer data. Please check your database connection.');
      }

    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Failed to connect to the server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
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
              onClick={fetchCustomerData}
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
  const hasAnyData = customerData.length > 0 || unitsData.length > 0 || assignmentData.length > 0 || 
                     commentData.length > 0 || productivityData !== null;

  if (!hasAnyData) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-6">No customer data found in the database.</p>
            <button 
              onClick={fetchCustomerData}
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
        <div>
          <h1 className="text-4xl font-bold !text-black">
  Customer Management
</h1>
          <p className="text-gray-600 mt-2">Welcome 👋</p>
          <p className="text-2xl font-bold">Customer Analytics Dashboard</p>
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

        {/* Filter Bar */}
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => handleDateRangeChange('today')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              dateRange === 'today' 
                ? 'bg-blue-500 text-white' 
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Today
          </button>
          <button 
            onClick={() => handleDateRangeChange('yesterday')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              dateRange === 'yesterday' 
                ? 'bg-blue-500 text-white' 
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Yesterday
          </button>
          <button 
            onClick={() => handleDateRangeChange('3D')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              dateRange === '3D' 
                ? 'bg-blue-500 text-white' 
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            3D
          </button>
          <button 
            onClick={() => handleDateRangeChange('3M')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              dateRange === '3M' 
                ? 'bg-blue-500 text-white' 
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            3 M
          </button>
          <button 
            onClick={() => handleDateRangeChange('6M')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              dateRange === '6M' 
                ? 'bg-blue-500 text-white' 
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            6 M
          </button>
          <button 
            onClick={() => handleDateRangeChange('12M')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              dateRange === '12M' 
                ? 'bg-blue-500 text-white' 
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            12 M
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Unresolved Units */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-sm mb-4 uppercase">UNRESOLVED UNITS BY STATUS</h3>
            {apiErrors.units ? (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Unable to load units data</p>
                  <button 
                    onClick={fetchCustomerData}
                    className="mt-2 text-blue-600 text-sm hover:underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : unitsData.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <p>No units data available</p>
                </div>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={unitsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                    >
                      {unitsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-1 text-sm">
                  {unitsData.map((item, idx) => (
                    <p key={idx}>🟦 {item.name}: {item.value}</p>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Assignment Status */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-sm mb-4 uppercase">UNRESOLVED UNITS BY ASSIGNMENT STATUS</h3>
            {apiErrors.assignment ? (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Unable to load assignment data</p>
                  <button 
                    onClick={fetchCustomerData}
                    className="mt-2 text-blue-600 text-sm hover:underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : assignmentData.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <p>No assignment data available</p>
                </div>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={assignmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                    >
                      {assignmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-1 text-sm">
                  {assignmentData.map((item, idx) => (
                    <p key={idx}>🟦 {item.name}: {item.value}</p>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Satisfaction Ratings */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-sm mb-4 uppercase">SATISFACTION RATINGS</h3>
            {apiErrors.ratings ? (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Unable to load ratings data</p>
                  <button 
                    onClick={fetchCustomerData}
                    className="mt-2 text-blue-600 text-sm hover:underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : customerData.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <p>No rating data available</p>
                </div>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={customerData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                    >
                      {customerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-1 text-xs">
                  {customerData.map((item, idx) => (
                    <p key={idx}>
                      🟦 {item.name} {idx === 0 ? '😍' : idx === 1 ? '😊' : idx === 2 ? '😐' : idx === 3 ? '😞' : '😢'}: {item.value}
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Agent Comments Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-bold text-sm mb-4 uppercase">AGENT COMMENTS BY DATE</h3>
          {apiErrors.comments ? (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                <p>Unable to load comments data</p>
                <button 
                  onClick={fetchCustomerData}
                  className="mt-2 text-blue-600 text-sm hover:underline"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : commentData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <p>No comment data available for selected period</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={commentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ai" stroke="#3b82f6" strokeWidth={2} name="AI" />
                <Line type="monotone" dataKey="public" stroke="#60a5fa" strokeWidth={2} name="Public comments" />
                <Line type="monotone" dataKey="internal" stroke="#93c5fd" strokeWidth={2} name="Internal comments" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Agents Productivity */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-bold mb-4">Agents Productivity</h3>
          {apiErrors.productivity ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
              <p>Unable to load productivity data</p>
              <button 
                onClick={fetchCustomerData}
                className="mt-2 text-blue-600 text-sm hover:underline"
              >
                Retry
              </button>
            </div>
          ) : !productivityData ? (
            <div className="text-center py-8 text-gray-500">
              <p>No productivity data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Production per 1000 unit</p>
                  <button className="text-xs text-gray-600">▼</button>
                </div>
                <p className="text-3xl font-bold">{productivityData.productionPer1000} days</p>
                <p className="text-xs text-gray-600 mt-1">
                  {productivityData.reduction}% reduced from previous week
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Production per unit</p>
                  <button className="text-xs text-gray-600">▼</button>
                </div>
                <p className="text-3xl font-bold">{productivityData.productionPerUnit} days</p>
                <p className="text-xs text-gray-600 mt-1">
                  {productivityData.reduction}% reduced from previous week
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}