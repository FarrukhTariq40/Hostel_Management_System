import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const GenerateFine = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [existingFees, setExistingFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState('');
  const [fineAmount, setFineAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentFees();
    } else {
      setExistingFees([]);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/accountant/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error fetching students');
    }
  };

  const fetchStudentFees = async () => {
    try {
      const response = await api.get('/fees');
      const studentFees = response.data.filter((fee) => {
        const feeStudentId = fee.studentId?._id || fee.studentId;
        return feeStudentId === selectedStudent;
      });
      setExistingFees(studentFees);
    } catch (error) {
      console.error('Error fetching fees:', error);
      alert('Error fetching fee records');
    }
  };

  const handleGenerateFine = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }

    if (!fineAmount || parseFloat(fineAmount) <= 0) {
      alert('Please enter a valid fine amount');
      return;
    }

    if (!reason.trim()) {
      alert('Please enter a reason for the fine');
      return;
    }

    setLoading(true);

    try {
      if (selectedFee) {
        // Add fine to existing fee record
        const fee = existingFees.find((f) => f._id === selectedFee);
        if (!fee) {
          alert('Selected fee record not found');
          setLoading(false);
          return;
        }

        const newFineAmount = parseFloat(fineAmount);
        const updatedFine = (fee.fine || 0) + newFineAmount;
        const updatedAmount = fee.amount + newFineAmount;

        await api.put(`/fees/${selectedFee}/add-fine`, {
          fine: updatedFine,
          amount: updatedAmount,
          reason: reason,
        });

        alert('Fine added to existing fee record successfully!');
      } else {
        // Create new fee record with fine
        const student = students.find((s) => s._id === selectedStudent);
        if (!student) {
          alert('Selected student not found');
          setLoading(false);
          return;
        }

        // Get room charges
        const roomsResponse = await api.get('/rooms/charges');
        const charges = roomsResponse.data;
        const roomCharge = charges[student.roomType] || 0;

        await api.post('/fees', {
          studentId: selectedStudent,
          amount: parseFloat(fineAmount),
          roomCharge: roomCharge,
          messCharge: 0,
          fine: parseFloat(fineAmount),
          dueDate: new Date().toISOString().split('T')[0],
          remarks: `Fine: ${reason}`,
        });

        alert('Fine record created successfully!');
      }

      // Reset form
      setSelectedStudent('');
      setSelectedFee('');
      setFineAmount('');
      setReason('');
      setExistingFees([]);
    } catch (error) {
      console.error('Error generating fine:', error);
      alert(error.response?.data?.message || 'Error generating fine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Generate Fine</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
          <form onSubmit={handleGenerateFine} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Resident
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => {
                  setSelectedStudent(e.target.value);
                  setSelectedFee('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              >
                <option value="">-- Select a resident --</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.studentId || 'N/A'}) - Room {student.roomNumber || 'N/A'}
                  </option>
                ))}
              </select>
            </div>

            {selectedStudent && existingFees.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add to Existing Fee Record (Optional)
                </label>
                <select
                  value={selectedFee}
                  onChange={(e) => setSelectedFee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">-- Create new fine record --</option>
                  {existingFees
                    .filter((fee) => fee.status !== 'paid')
                    .map((fee) => (
                      <option key={fee._id} value={fee._id}>
                        Fee: RS {fee.amount} | Status: {fee.status} | Due: {new Date(fee.dueDate).toLocaleDateString()}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select an existing unpaid fee record to add the fine to, or leave blank to create a new fine record
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fine Amount (RS)
              </label>
              <input
                type="number"
                value={fineAmount}
                onChange={(e) => setFineAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter fine amount"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Fine
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows="4"
                placeholder="Enter reason for the fine (e.g., Late payment, Damage to property, etc.)"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Generate Fine'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedStudent('');
                  setSelectedFee('');
                  setFineAmount('');
                  setReason('');
                  setExistingFees([]);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateFine;

