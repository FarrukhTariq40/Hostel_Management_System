import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const PendingFines = () => {
  const [pendingFines, setPendingFines] = useState(null);

  useEffect(() => {
    fetchPendingFines();
  }, []);

  const fetchPendingFines = async () => {
    try {
      const response = await api.get('/api/fees/pending-fines');
      setPendingFines(response.data);
    } catch (error) {
      console.error('Error fetching pending fines:', error);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Pending Fines</h1>

      {pendingFines && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="text-2xl font-bold text-red-600">
            Total Pending Fines: RS {pendingFines.totalPendingFine || 0}
          </div>
        </div>
      )}

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
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingFines?.fees?.map((fee) => (
              <tr key={fee._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {fee.studentName || (fee.studentId?.name || 'N/A')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {fee.studentId?.studentId || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RS {fee.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">RS {fee.fine}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      fee.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : fee.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {fee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(fee.dueDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!pendingFines?.fees || pendingFines.fees.length === 0) && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No pending fines found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingFines;


