import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification._id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{notification.message}</p>
              {notification.createdBy && (
                <p className="text-sm text-gray-500 mt-2">From: {notification.createdBy.name}</p>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
              No notifications available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

