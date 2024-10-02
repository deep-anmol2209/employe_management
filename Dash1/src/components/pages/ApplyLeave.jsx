import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LinearProgress from '@mui/material/LinearProgress'; // Import LinearProgress

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const { apiCall, user } = useAuth();

  const [loading, setLoading] = useState(false); // For loading state
  const [message, setMessage] = useState(null);  // For success/error feedback

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      setMessage(null);
  
      // Convert startDate and endDate to ISO 8601 format (with time)
      const formattedStartDate = new Date(formData.startDate).toISOString();
      const formattedEndDate = new Date(formData.endDate).toISOString();
  
      const response = await apiCall('http://localhost:3000/leave/createleave', {
        method: "POST",
        data: {
          type: formData.leaveType,
          reason: formData.reason,
          startDate: formattedStartDate,  // Using the formatted date
          endDate: formattedEndDate,      // Using the formatted date
        },
      });
  
      setMessage({ type: 'success', text: 'Leave Application Submitted Successfully' });
  
      // Reset the form
      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
      });
    } catch (error) {
      console.error('Error submitting leave request:', error);
      setMessage({ type: 'error', text: 'Error submitting leave request' });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl w-full bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Apply Leave Form</h2>

        {/* Feedback Message */}
        {message && (
          <div
            className={`mb-4 p-4 text-center rounded ${
              message.type === 'error' ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leave Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Leave Type</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Leave Type</option>
                <option value="Sick">Sick</option>
                <option value="Vacation">Vacation</option>
                <option value="Casual">Casual</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Reason for Leave */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Reason for Leave</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the reason for leave"
                rows="4"
                required
              />
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 ${
                loading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Leave Application'}
            </button>
          </div>
           {/* Display LinearProgress when submitting */}
           {loading && <LinearProgress className="mt-4" />}
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
