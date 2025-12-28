import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const AdminHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    occupancyRate: 0,
    availableBeds: 0,
    pendingComplaints: 0,
    monthlyRevenue: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [todayMenu, setTodayMenu] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [roomsRes, complaintsRes, feesRes, menuRes, notifRes] = await Promise.all([
        api.get('/api/rooms'),
        api.get('/api/complaints'),
        api.get('/api/fees'),
        api.get('/api/mess/menu'),
        api.get('/api/notifications/unread-count'),
      ]);

      // Calculate occupancy rate
      const rooms = roomsRes.data.rooms || [];
      const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
      const totalOccupied = rooms.reduce((sum, room) => sum + room.currentOccupancy, 0);
      const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
      
      // Calculate available beds
      const availableBeds = rooms.reduce((sum, room) => sum + (room.capacity - room.currentOccupancy), 0);

      // Get pending complaints
      const pendingComplaints = complaintsRes.data.filter((c) => c.status === 'pending').length;

      // Calculate monthly revenue (paid fees this month)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyRevenue = feesRes.data
        .filter((fee) => fee.status === 'paid' && new Date(fee.paidDate) >= startOfMonth)
        .reduce((sum, fee) => sum + fee.amount, 0);

      // Get recent complaints (last 3)
      const recent = complaintsRes.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      // Get today's menu
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const todayMenuData = menuRes.data.find((m) => m.day === today);

      setStats({
        occupancyRate,
        availableBeds,
        pendingComplaints,
        monthlyRevenue,
      });
      setRecentComplaints(recent);
      setTodayMenu(todayMenuData);
      setUnreadNotifications(notifRes.data.count || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'resolved':
        return 'Resolved';
      case 'pending':
        return 'Pending';
      case 'investigating':
        return 'Investigating';
      default:
        return status;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/reports"
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">Received Reports</span>
            </Link>
            <Link
              to="/admin/notifications"
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back, Admin 👋
          </h1>
          <p className="text-gray-600">Here's what's happening at Roomify Hostel today.</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+2%</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Occupancy Rate</p>
            <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Available Beds</p>
            <p className="text-2xl font-bold text-gray-900">{stats.availableBeds}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">Action Needed</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Pending Complaints</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingComplaints}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+5%</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Monthly Revenue</p>
            <p className="text-2xl font-bold text-gray-900">RS {stats.monthlyRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/room-requests')}
              className="flex items-center justify-center space-x-2 bg-cyan-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>Allocate Room</span>
            </button>
            <button
              onClick={() => navigate('/admin/rooms')}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Room</span>
            </button>
            <button
              onClick={() => navigate('/admin/mess')}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Update Menu</span>
            </button>
            <button
              onClick={() => navigate('/admin/notifications')}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span>Send Alert</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Complaints */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Complaints</h2>
              <Link to="/admin/complaints" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentComplaints.length > 0 ? (
                recentComplaints.map((complaint) => (
                  <div key={complaint._id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-600">
                        {complaint.studentName?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          Room {complaint.studentId?.roomNumber || 'N/A'} - {complaint.studentName || 'Student'}
                        </p>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{complaint.title}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                        {getStatusLabel(complaint.status)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No complaints available</p>
              )}
            </div>
          </div>

          {/* Today's Menu */}
          <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Menu</h2>
            {todayMenu ? (
              <div className="space-y-4">
                {todayMenu.breakfast && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase">BREAKFAST</p>
                      <p className="text-xs text-gray-500">
                        {todayMenu.breakfast.timing?.start || '7:30 AM'}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {todayMenu.breakfast.items?.join(', ') || 'No items set'}
                    </p>
                  </div>
                )}
                {todayMenu.lunch && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase">LUNCH</p>
                      <p className="text-xs text-gray-500">
                        {todayMenu.lunch.timing?.start || '1:00 PM'}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {todayMenu.lunch.items?.join(', ') || 'No items set'}
                    </p>
                  </div>
                )}
                {todayMenu.dinner && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase">DINNER</p>
                      <p className="text-xs text-gray-500">
                        {todayMenu.dinner.timing?.start || '8:00 PM'}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {todayMenu.dinner.items?.join(', ') || 'No items set'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No menu available for today</p>
            )}
          </div>
        </div>

        {/* Recent Room Allocations */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Room Allocations</h2>
            <Link to="/admin/rooms" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
              Manage Rooms →
            </Link>
          </div>
          <p className="text-sm text-gray-500">Room allocation details will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
