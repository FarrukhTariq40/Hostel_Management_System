import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const RoomAllocation = () => {
  const { user } = useAuth();
  const [roomDetails, setRoomDetails] = useState(null);
  const [charges, setCharges] = useState({});
  const [selectedRoomType, setSelectedRoomType] = useState('2-person');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoomDetails();
    fetchCharges();
  }, []);

  const fetchRoomDetails = async () => {
    try {
      const response = await api.get('/students/room-details');
      setRoomDetails(response.data);
    } catch (error) {
      console.error('Error fetching room details:', error);
    }
  };

  const fetchCharges = async () => {
    try {
      const response = await api.get('/rooms/charges');
      setCharges(response.data);
    } catch (error) {
      console.error('Error fetching charges:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/students/room-allocation', {
        roomType: selectedRoomType,
      });
      alert('Room allocation request submitted successfully!');
      fetchRoomDetails();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Room Allocation</h1>

      {roomDetails && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Room Number</p>
              <p className="text-lg font-medium">{roomDetails.roomNumber || 'Not allocated'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Room Type</p>
              <p className="text-lg font-medium">{roomDetails.roomType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-medium capitalize">{roomDetails.status}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Room Charges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700">2-Person Room</h3>
            <p className="text-2xl font-bold text-indigo-600">RS {charges['2-person'] || 0}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700">3-Person Room</h3>
            <p className="text-2xl font-bold text-indigo-600">RS {charges['3-person'] || 0}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700">4-Person Room</h3>
            <p className="text-2xl font-bold text-indigo-600">RS {charges['4-person'] || 0}</p>
          </div>
        </div>
      </div>

      {roomDetails?.status === 'none' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Submit Room Allocation Request</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="2-person">2-Person Room (RS {charges['2-person'] || 0})</option>
                <option value="3-person">3-Person Room (RS {charges['3-person'] || 0})</option>
                <option value="4-person">4-Person Room (RS {charges['4-person'] || 0})</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}
      </div>
    </div>
  );
};

export default RoomAllocation;


