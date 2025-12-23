import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    recipient: 'all',
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notifications', formData);
      setShowForm(false);
      setFormData({ title: '', message: '', recipient: 'all' });
      fetchNotifications();
      alert('Notification sent successfully!');
    } catch (error) {
      alert('Error sending notification');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await api.delete(`/notifications/${id}`);
        fetchNotifications();
        alert('Notification deleted successfully!');
      } catch (error) {
        alert('Error deleting notification');
      }
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          {showForm ? 'Cancel' : 'Send Notification'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Send New Notification</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="4"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
              <select
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Users</option>
                <option value="student">Students Only</option>
                <option value="accountant">Accountant Only</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Send Notification
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification._id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  To: {notification.recipient} | Created: {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(notification._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
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
  );
};

export default Notifications;


