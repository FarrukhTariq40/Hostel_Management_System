import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/admin/reports');
      setReports(response.data || []);
      setSelected((response.data || [])[0] || null);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Financial Reports (Sent by Accountant)</h1>

      {reports.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-gray-600">
          No reports received yet.
        </div>
      )}

      {reports.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Reports</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {reports.map((rep) => (
                <button
                  key={rep._id}
                  onClick={() => setSelected(rep)}
                  className={`w-full text-left p-3 rounded border ${
                    selected?._id === rep._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  } hover:border-indigo-400`}
                >
                  <div className="text-sm font-semibold">Generated: {new Date(rep.generatedAt).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">By: {rep.createdBy?.name || 'Accountant'}</div>
                  <div className="text-xs text-gray-500">Revenue: RS {rep.totalRevenue}</div>
                  <div className="text-xs text-gray-500">Pending: RS {rep.pendingAmount}</div>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                  <div className="p-5">
                    <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                    <div className="mt-1 text-2xl font-semibold text-green-600">RS {selected.totalRevenue}</div>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                  <div className="p-5">
                    <div className="text-sm font-medium text-gray-500">Pending Amount</div>
                    <div className="mt-1 text-2xl font-semibold text-yellow-600">RS {selected.pendingAmount}</div>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                  <div className="p-5">
                    <div className="text-sm font-medium text-gray-500">Total Fines</div>
                    <div className="mt-1 text-2xl font-semibold text-red-600">RS {selected.totalFines}</div>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                  <div className="p-5">
                    <div className="text-sm font-medium text-gray-500">Pending Fines</div>
                    <div className="mt-1 text-2xl font-semibold text-red-600">RS {selected.pendingFines}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6 border border-gray-100 mb-6">
                <h2 className="text-xl font-semibold mb-4">Report Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Records</p>
                    <p className="text-lg font-semibold">{selected.totalRecords}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Paid Records</p>
                    <p className="text-lg font-semibold text-green-600">{selected.paidRecords}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending Records</p>
                    <p className="text-lg font-semibold text-yellow-600">{selected.pendingRecords}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Overdue Records</p>
                    <p className="text-lg font-semibold text-red-600">{selected.overdueRecords}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Generated at: {new Date(selected.generatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;


