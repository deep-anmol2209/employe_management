import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook for apiCall
import CircularProgress from '@mui/material/CircularProgress'; // Assuming you are using MUI for spinner

const LeaveHistory = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const { apiCall, user } = useAuth(); // Get apiCall from AuthContext

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const employeeid= user.id
        console.log(employeeid)
        setLoading(true);
        const response = await apiCall(`http://localhost:3000/leave/employeeleavehistory/${employeeid}`, {
          method: 'GET',
        });
        setLeaveHistory(response.data.leaveRequests|| []); // Assuming response structure
      } catch (err) {
        setError('Failed to fetch leave history');
        console.error('Error fetching leave history:', err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchLeaveHistory();
  }, [apiCall]);
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Leave History</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <CircularProgress />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : leaveHistory.length === 0 ? (
        <p>No leave history available.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2 text-left">Leave Type</th>
                <th className="border-b p-2 text-left">Start Date</th>
                <th className="border-b p-2 text-left">End Date</th>
                <th className="border-b p-2 text-left">Reason</th>
                <th className="border-b p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave, index) => (
                <tr key={index}>
                  <td className="border-b p-2">{leave.type}</td>
                  <td className="border-b p-2">{formatDate(leave.startDate)}</td>
                  <td className="border-b p-2">{formatDate(leave.endDate)}</td>
                  <td className="border-b p-2">{leave.reason}</td>
                  <td className="border-b p-2">{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;
