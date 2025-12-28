import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const AccountantHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    totalFines: 0,
    pendingFines: 0,
  });
  const [recentFees, setRecentFees] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [reportsRes, feesRes, notifRes] = await Promise.all([
        api.get('/api/accountant/reports'),
        api.get('/api/fees'),
        api.get('/api/notifications/unread-count'),
      ]);

      setStats({
        totalRevenue: reportsRes.data.totalRevenue || 0,
        pendingAmount: reportsRes.data.pendingAmount || 0,
        totalFines: reportsRes.data.totalFines || 0,
        pendingFines: reportsRes.data.pendingFines || 0,
      });

      // Get recent fees (last 5)
      const recent = feesRes.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentFees(recent);
      setUnreadNotifications(notifRes.data.count || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              to="/accountant/reports"
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">Financial Reports</span>
            </Link>
            <Link
              to="/accountant/notifications"
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
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Accountant'}</p>
                <p className="text-xs text-gray-500">Accountant</p>
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
            Welcome back, Accountant 👋
          </h1>
          <p className="text-gray-600">Here's what's happening at Roomify Hostel today.</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+5%</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">RS {stats.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Pending Amount</p>
            <p className="text-2xl font-bold text-gray-900">RS {stats.pendingAmount.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">Action Needed</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Fines</p>
            <p className="text-2xl font-bold text-gray-900">RS {stats.totalFines.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Pending Fines</p>
            <p className="text-2xl font-bold text-gray-900">RS {stats.pendingFines.toLocaleString()}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/accountant/fees')}
              className="flex items-center justify-center space-x-2 bg-cyan-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>View Fees</span>
            </button>
            <button
              onClick={() => navigate('/accountant/fines')}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Check Fines</span>
            </button>
            <button
              onClick={() => navigate('/accountant/reports')}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Generate Report</span>
            </button>
            <button
              onClick={() => navigate('/accountant/fees')}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Fee</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Fee Records */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Fee Records</h2>
              <Link to="/accountant/fees" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentFees.length > 0 ? (
                recentFees.map((fee) => (
                  <div key={fee._id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-600">
                        {fee.studentName?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {fee.studentName || 'Student'}
                        </p>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">RS {fee.amount.toLocaleString()}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(fee.status)}`}>
                        {fee.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No fee records available</p>
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-lg font-bold text-green-600">RS {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-lg font-bold text-yellow-600">RS {stats.pendingAmount.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <p className="text-sm text-gray-600">Total Fines</p>
                <p className="text-lg font-bold text-red-600">RS {stats.totalFines.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Pending Fines</p>
                <p className="text-lg font-bold text-orange-600">RS {stats.pendingFines.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <Link to="/accountant/fees" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
              View All →
            </Link>
          </div>
          <p className="text-sm text-gray-500">Transaction details will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default AccountantHome;
