import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const RoomManagement = () => {
  const [charges, setCharges] = useState({
    '2-person': 0,
    '3-person': 0,
    '4-person': 0,
  });
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState(null);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    roomType: '2-person',
    charge: '',
  });

  useEffect(() => {
    fetchCharges();
    fetchRooms();
    fetchAllocations();
  }, []);

  const fetchCharges = async () => {
    try {
      const response = await api.get('/rooms/charges');
      setCharges(response.data);
    } catch (error) {
      console.error('Error fetching charges:', error);
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

  const fetchAllocations = async () => {
    try {
      const response = await api.get('/rooms/allocations');
      setAllocations(response.data);
    } catch (error) {
      console.error('Error fetching allocations:', error);
    }
  };

  const handleUpdateCharges = async () => {
    try {
      await api.put('/rooms/charges', charges);
      alert('Room charges updated successfully!');
      fetchCharges();
      fetchRooms();
    } catch (error) {
      alert('Error updating charges');
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoom.roomNumber || !newRoom.charge) {
      alert('Please provide room number and charge');
      return;
    }
    try {
      await api.post('/rooms', {
        roomNumber: newRoom.roomNumber,
        roomType: newRoom.roomType,
        charge: Number(newRoom.charge),
      });
      alert('Room created successfully');
      setNewRoom({ roomNumber: '', roomType: '2-person', charge: '' });
      fetchRooms();
      fetchCharges();
      fetchAllocations();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating room');
    }
  };

  const summaryByType = ['2-person', '3-person', '4-person'].map((type) => {
    const filtered = rooms.filter((r) => r.roomType === type);
    const total = filtered.length;
    const available = filtered.filter((r) => r.isAvailable).length;
    const occupied = filtered.reduce((sum, r) => sum + r.currentOccupancy, 0);
    return { type, total, available, occupied };
  });

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Room Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Room Inventory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {summaryByType.map((item) => (
              <div key={item.type} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 capitalize">{item.type}</h3>
                <p className="text-sm text-gray-500">Total rooms: {item.total}</p>
                <p className="text-sm text-green-600">Available: {item.available}</p>
                <p className="text-sm text-indigo-600">Occupied slots: {item.occupied}</p>
                <p className="text-sm text-gray-500">Charge: RS {charges[item.type] || 0}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
              <input
                type="text"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 301"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select
                value={newRoom.roomType}
                onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="2-person">2-Person</option>
                <option value="3-person">3-Person</option>
                <option value="4-person">4-Person</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Charge (RS)</label>
              <input
                type="number"
                value={newRoom.charge}
                onChange={(e) => setNewRoom({ ...newRoom, charge: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 4500"
              />
            </div>
          </div>
          <button
            onClick={handleCreateRoom}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Room
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Update Room Charges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">2-Person Room</label>
            <input
              type="number"
              value={charges['2-person']}
              onChange={(e) => setCharges({ ...charges, '2-person': parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">3-Person Room</label>
            <input
              type="number"
              value={charges['3-person']}
              onChange={(e) => setCharges({ ...charges, '3-person': parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">4-Person Room</label>
            <input
              type="number"
              value={charges['4-person']}
              onChange={(e) => setCharges({ ...charges, '4-person': parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button
          onClick={handleUpdateCharges}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Charges
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <h2 className="text-xl font-semibold p-6">All Room Allocations</h2>
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
                Room Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allocations?.students?.map((student) => (
              <tr key={student._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.studentId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.roomNumber || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.roomType || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.roomAllocationStatus === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : student.roomAllocationStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : student.roomAllocationStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {student.roomAllocationStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomManagement;


