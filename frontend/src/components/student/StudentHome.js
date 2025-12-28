import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const StudentHome = () => {
  const { user } = useAuth();
  const [feeStatus, setFeeStatus] = useState(null);
  const [todayMenu, setTodayMenu] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [feeRes, menuRes, notifRes] = await Promise.all([
        api.get('/api/fees/status'),
        api.get('/api/mess/menu'),
        api.get('/api/notifications'),
      ]);

      setFeeStatus(feeRes.data);
      
      // Get today's menu
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const todayMenuData = menuRes.data.find((m) => m.day === today);
      setTodayMenu(todayMenuData);

      // Get recent notifications (limit to 3)
      setNotifications(notifRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const calculateFeeProgress = () => {
    if (!feeStatus || !feeStatus.fees || feeStatus.fees.length === 0) return 0;
    const totalAmount = feeStatus.fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = feeStatus.fees
      .filter((fee) => fee.status === 'paid')
      .reduce((sum, fee) => sum + fee.amount, 0);
    return totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
  };

  const getTotalFees = () => {
    if (!feeStatus || !feeStatus.fees) return 0;
    return feeStatus.fees.reduce((sum, fee) => sum + fee.amount, 0);
  };

  const getPaidAmount = () => {
    if (!feeStatus || !feeStatus.fees) return 0;
    return feeStatus.fees
      .filter((fee) => fee.status === 'paid')
      .reduce((sum, fee) => sum + fee.amount, 0);
  };

  const getPendingAmount = () => {
    if (!feeStatus || !feeStatus.fees) return 0;
    return feeStatus.fees
      .filter((fee) => fee.status !== 'paid')
      .reduce((sum, fee) => sum + fee.amount, 0);
  };

  const getNextDueDate = () => {
    if (!feeStatus || !feeStatus.fees) return null;
    const pendingFees = feeStatus.fees.filter((fee) => fee.status !== 'paid');
    if (pendingFees.length === 0) return null;
    const nextDue = pendingFees.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
    const dueDate = new Date(nextDue.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const progress = calculateFeeProgress();
  const totalFees = getTotalFees();
  const paidAmount = getPaidAmount();
  const pendingAmount = getPendingAmount();
  const daysUntilDue = getNextDueDate();

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-gray-600 mt-1">Here&apos;s what&apos;s happening in your hostel today.</p>
          </div>
          <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Status: Checked In</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Room</p>
                <p className="text-lg font-bold text-gray-900">{user?.roomNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Block</p>
                <p className="text-lg font-bold text-gray-900">Block B</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Roommate</p>
                <p className="text-lg font-bold text-gray-900">Jamie L.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Status</p>
                <p className="text-lg font-bold text-gray-900">Occupied</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Fee Payment Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Fee Payment Status</h2>
              {daysUntilDue !== null && daysUntilDue > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Due in {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-6">Fall Semester 2023</p>

            <div className="flex items-center space-x-6 mb-6">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                    className="text-cyan-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-cyan-600">{progress}%</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center mt-8">
                  <span className="text-xs text-gray-500">PAID</span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Total Fees</p>
                  <p className="text-lg font-bold text-gray-900">RS {totalFees.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Paid Amount</p>
                  <p className="text-lg font-bold text-green-600">RS {paidAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Amount</p>
                  <p className="text-lg font-bold text-red-600">RS {pendingAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Link
                to="/student/fees"
                className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 text-center transition-colors"
              >
                History
              </Link>
            </div>
          </div>

          {/* Something Broken Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-sm text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Something broken?</h3>
            <p className="text-purple-100 mb-4 text-sm">
              Don&apos;t let a leaky tap ruin your day. Report issues directly to maintenance.
            </p>
            <Link
              to="/student/complaints"
              className="inline-flex items-center space-x-2 bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Report an Issue</span>
            </Link>
          </div>

          {/* Today's Menu */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Today&apos;s Menu</h2>
              <Link to="/student/mess" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                View Weekly
              </Link>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>

            {todayMenu ? (
              <div className="space-y-4">
                {todayMenu.breakfast && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Breakfast</p>
                    <p className="text-sm font-medium text-gray-900">
                      {todayMenu.breakfast.items?.join(', ') || 'No items set'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {todayMenu.breakfast.timing?.start} - {todayMenu.breakfast.timing?.end}
                    </p>
                  </div>
                )}
                {todayMenu.lunch && (
                  <div className="bg-cyan-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-cyan-600 uppercase mb-1">Lunch</p>
                    <p className="text-sm font-medium text-gray-900">
                      {todayMenu.lunch.items?.join(', ') || 'No items set'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {todayMenu.lunch.timing?.start} - {todayMenu.lunch.timing?.end}
                    </p>
                  </div>
                )}
                {todayMenu.dinner && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Dinner</p>
                    <p className="text-sm font-medium text-gray-900">
                      {todayMenu.dinner.items?.join(', ') || 'No items set'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {todayMenu.dinner.timing?.start} - {todayMenu.dinner.timing?.end}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No menu available for today</p>
            )}
          </div>

          {/* Notice Board */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">Notice Board</h2>
            </div>

            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification._id} className="border-l-4 border-cyan-500 pl-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-semibold text-gray-600 uppercase">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No notices available</p>
              )}
            </div>

            <Link
              to="/student/notifications"
              className="mt-4 inline-block text-sm text-cyan-600 hover:text-cyan-700 font-medium"
            >
              VIEW ALL NOTICES
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
