import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const Fees = () => {
  const [feeStatus, setFeeStatus] = useState(null);
  const [fees, setFees] = useState([]);

  useEffect(() => {
    fetchFeeStatus();
  }, []);

  const fetchFeeStatus = async () => {
    try {
      const response = await api.get('/fees/status');
      setFeeStatus(response.data);
      setFees(response.data.fees || []);
    } catch (error) {
      console.error('Error fetching fee status:', error);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Fee Status</h1>

      {feeStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="text-sm font-medium text-gray-500">Paid</div>
              <div className="mt-1 text-2xl font-semibold text-green-600">{feeStatus.paid}</div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="text-sm font-medium text-gray-500">Pending</div>
              <div className="mt-1 text-2xl font-semibold text-yellow-600">{feeStatus.pending}</div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="text-sm font-medium text-gray-500">Overdue</div>
              <div className="mt-1 text-2xl font-semibold text-red-600">{feeStatus.overdue}</div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="text-sm font-medium text-gray-500">Total Fine</div>
              <div className="mt-1 text-2xl font-semibold text-red-600">RS {feeStatus.totalFine}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room Charge
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mess Charge
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
            {fees.map((fee) => (
              <tr key={fee._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  RS {fee.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RS {fee.roomCharge}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RS {fee.messCharge}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RS {fee.fine}</td>
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
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default Fees;


