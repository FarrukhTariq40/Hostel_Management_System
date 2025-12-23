import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const FinancialReports = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await api.get('/accountant/reports');
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const handleSendToAdmin = async () => {
    try {
      await api.post('/accountant/reports/send');
      alert('Financial report sent to admin successfully!');
    } catch (error) {
      console.error('Error sending report:', error);
      alert(error.response?.data?.message || 'Error sending report to admin');
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
        <button
          onClick={handleSendToAdmin}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Send to Admin
        </button>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                <div className="mt-1 text-2xl font-semibold text-green-600">RS {report.totalRevenue}</div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Pending Amount</div>
                <div className="mt-1 text-2xl font-semibold text-yellow-600">RS {report.pendingAmount}</div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Total Fines</div>
                <div className="mt-1 text-2xl font-semibold text-red-600">RS {report.totalFines}</div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Pending Fines</div>
                <div className="mt-1 text-2xl font-semibold text-red-600">RS {report.pendingFines}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Total Records</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{report.totalRecords}</div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Paid Records</div>
                <div className="mt-1 text-2xl font-semibold text-green-600">{report.paidRecords}</div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Pending Records</div>
                <div className="mt-1 text-2xl font-semibold text-yellow-600">{report.pendingRecords}</div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Overdue Records</div>
                <div className="mt-1 text-2xl font-semibold text-red-600">{report.overdueRecords}</div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Report Generated At</h2>
            <p className="text-gray-600">
              {new Date(report.generatedAt).toLocaleString()}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <h2 className="text-xl font-semibold p-6">All Fee Records</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
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
                {report.fees?.map((fee) => (
                  <tr key={fee._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {fee.studentName || (fee.studentId?.name || 'N/A')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RS {fee.amount}</td>
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
        </>
      )}
    </div>
  );
};

export default FinancialReports;


