// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { FileText, Play, Loader2, X, ChevronRight } from 'lucide-react';
import { adminAPI } from '../services/adminApi';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [taskFilter, setTaskFilter] = useState('new');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailTasks, setDetailTasks] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [taskFilter]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const statusMap = {
        'new': 'new',
        'in_progress': 'in_progress', 
        'completed': 'completed'
      };
      
      const [statsRes, tasksRes, teamRes, activitiesRes] = await Promise.all([
        adminAPI.getDashboardStats().catch(err => ({ data: { success: false, data: null } })),
        adminAPI.getTasks(statusMap[taskFilter]).catch(err => ({ data: { success: false, data: [] } })),
        adminAPI.getTeamMembers().catch(err => ({ data: { success: false, data: [] } })),
        adminAPI.getRecentActivities().catch(err => ({ data: { success: false, data: [] } }))
      ]);

      if (statsRes.data.success && statsRes.data.data) {
        setStats(statsRes.data.data);
      } else {
        setStats({
          newTasks: 11,
          inProgressTasks: 3,
          completedTasks: 3,
          newTasksChange: 5,
          inProgressChange: 8
        });
      }
      
      if (tasksRes.data.success && tasksRes.data.data) {
        console.log('Tasks loaded for filter:', taskFilter, tasksRes.data.data);
        setTasks(tasksRes.data.data);
      } else {
        setTasks([]);
      }
      
      if (teamRes.data.success && teamRes.data.data) {
        setTeamMembers(teamRes.data.data);
      } else {
        setTeamMembers([]);
      }
      
      if (activitiesRes.data.success && activitiesRes.data.data) {
        setActivities(activitiesRes.data.data);
      } else {
        setActivities([]);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (type) => {
    setSelectedDetail(type);
    setDetailLoading(true);
    
    try {
      let statusParam = '';
      if (type === 'new') statusParam = 'new';
      else if (type === 'in_progress') statusParam = 'in_progress';
      
      const response = await adminAPI.getTasks(statusParam);
      if (response.data.success && response.data.data) {
        setDetailTasks(response.data.data);
      } else {
        setDetailTasks([]);
      }
    } catch (error) {
      console.error('Error fetching detail tasks:', error);
      setDetailTasks([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedDetail(null);
    setDetailTasks([]);
  };

  const getFilterDisplayText = (filter) => {
    switch(filter) {
      case 'new': return 'New Orders';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Orders';
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-black">Dashboard Overview</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
          {/* New Orders Card - Entire card clickable without view details text */}
          <div 
            onClick={() => handleCardClick('new')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick('new');
              }
            }}
            className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">New Orders</p>
                <p className="text-4xl font-bold mt-2">{stats?.newTasks || 0}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {stats?.newTasksChange > 0 ? '+' : ''}{stats?.newTasksChange || 0} from yesterday
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center pointer-events-none">
                <FileText size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* In Progress Card - Entire card clickable without view details text */}
          <div 
            onClick={() => handleCardClick('in_progress')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick('in_progress');
              }
            }}
            className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-4xl font-bold mt-2">{stats?.inProgressTasks || 0}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {stats?.inProgressChange > 0 ? '+' : ''}{stats?.inProgressChange || 0} from yesterday
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center pointer-events-none">
                <Play size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-2">
                <button 
                  onClick={() => setTaskFilter('new')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    taskFilter === 'new' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  New Orders
                </button>
                <button 
                  onClick={() => setTaskFilter('in_progress')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    taskFilter === 'in_progress' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  In Progress
                </button>
                <button 
                  onClick={() => setTaskFilter('completed')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    taskFilter === 'completed' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium">{task.name}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{task.progress}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          {task.date ? new Date(task.date).toLocaleDateString() : 'No date'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Assigned to: {task.assignee_name || 'Unassigned'}
                        </p>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {task.avatar || 'U'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No {getFilterDisplayText(taskFilter).toLowerCase()} found
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Team Members</h3>
                <a href="/admin/users" className="text-blue-600 text-sm font-medium">View all</a>
              </div>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {teamMembers.slice(0, 5).map((member) => (
                  <div 
                    key={member.id} 
                    className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    title={member.name}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {teamMembers.length > 5 && (
                  <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium">
                    +{teamMembers.length - 5}
                  </button>
                )}
                <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition">
                  +
                </button>
              </div>
              <div className="text-xs text-gray-500 space-y-2">
                {teamMembers.slice(0, 5).map((member) => (
                  <p key={member.id} className="flex justify-between">
                    <span>{member.name}</span>
                    <span className="text-gray-400">{member.role}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Recent Activities</h3>
                <a href="#" className="text-blue-600 text-sm font-medium">View all</a>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="border-b border-gray-100 pb-3 last:border-0">
                      <p className="font-medium text-sm">{activity.user || 'System'}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.action}</p>
                      {activity.file && (
                        <p className="text-xs text-blue-600 mt-1">📄 {activity.file}</p>
                      )}
                      {activity.text && (
                        <p className="text-xs text-gray-600 mt-1">{activity.text}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No recent activities
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-black">
                {selectedDetail === 'new' ? 'New Orders Details' : 'In Progress Orders Details'}
              </h2>
              <button 
                onClick={closeDetail}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : detailTasks.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-blue-900 font-medium">
                      Total {selectedDetail === 'new' ? 'New Orders' : 'In Progress Orders'}: {detailTasks.length}
                    </p>
                  </div>

                  {detailTasks.map((task) => (
                    <div key={task.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{task.name}</h3>
                          <span className={`inline-block text-xs px-2 py-1 rounded mt-1 ${
                            task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {task.priority} Priority
                          </span>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {task.avatar || 'U'}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{task.progress}%</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Order Date</p>
                            <p className="font-medium">{task.date ? new Date(task.date).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Assigned To</p>
                            <p className="font-medium">{task.assignee_name || 'Unassigned'}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">
                            Update Status
                          </button>
                          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No {selectedDetail === 'new' ? 'new orders' : 'orders in progress'} found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}