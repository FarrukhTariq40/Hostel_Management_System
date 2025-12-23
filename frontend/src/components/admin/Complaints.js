import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleResolve = async (id) => {
    if (!response.trim()) {
      alert('Please provide a response');
      return;
    }
    try {
      await api.put(`/complaints/${id}/resolve`, {
        adminResponse: response,
      });
      setSelectedComplaint(null);
      setResponse('');
      fetchComplaints();
      alert('Complaint resolved successfully!');
    } catch (error) {
      alert('Error resolving complaint');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await api.delete(`/complaints/${id}`);
        fetchComplaints();
        alert('Complaint deleted successfully!');
      } catch (error) {
        alert('Error deleting complaint');
      }
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Complaints</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
            {complaints.map((complaint) => (
              <tr key={complaint._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {complaint.studentName || (complaint.studentId?.name || 'N/A')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{complaint.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      complaint.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : complaint.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(complaint._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{selectedComplaint.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                <strong>Category:</strong> {selectedComplaint.category}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                <strong>Status:</strong> {selectedComplaint.status}
              </p>
              <p className="text-sm text-gray-700 mb-4">{selectedComplaint.description}</p>
              {selectedComplaint.adminResponse && (
                <div className="mb-4 p-3 bg-gray-100 rounded">
                  <strong>Admin Response:</strong>
                  <p className="text-sm text-gray-700">{selectedComplaint.adminResponse}</p>
                </div>
              )}
              {selectedComplaint.status === 'pending' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Response</label>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="4"
                    placeholder="Enter your response..."
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedComplaint(null);
                    setResponse('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
                {selectedComplaint.status === 'pending' && (
                  <button
                    onClick={() => handleResolve(selectedComplaint._id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;


