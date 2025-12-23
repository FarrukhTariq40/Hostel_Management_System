import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const RoomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('');

  useEffect(() => {
    fetchRequests();
    fetchRooms();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/admin/room-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      await api.put(`/admin/room-requests/${studentId}/approve`, {
        roomNumber: selectedRoom || undefined,
      });
      setSelectedRequest(null);
      setSelectedRoom('');
      fetchRequests();
      fetchRooms();
      alert('Room allocation approved successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error approving request');
    }
  };

  const handleReject = async (studentId) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        await api.put(`/admin/room-requests/${studentId}/reject`);
        setSelectedRequest(null);
        fetchRequests();
        alert('Room allocation request rejected!');
      } catch (error) {
        alert('Error rejecting request');
      }
    }
  };

  const getAvailableRooms = (roomType) => {
    return rooms.filter(
      (room) => room.roomType === roomType && room.currentOccupancy < room.capacity
    );
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Room Allocation Requests</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.studentId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.roomType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Process
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No pending requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Process Request - {selectedRequest.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                <strong>Student ID:</strong> {selectedRequest.studentId}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Requested Room Type:</strong> {selectedRequest.roomType}
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Room (Optional)
                </label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Auto-assign</option>
                  {getAvailableRooms(selectedRequest.roomType).map((room) => (
                    <option key={room._id} value={room.roomNumber}>
                      {room.roomNumber} ({room.currentOccupancy}/{room.capacity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setSelectedRoom('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedRequest._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedRequest._id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomRequests;


