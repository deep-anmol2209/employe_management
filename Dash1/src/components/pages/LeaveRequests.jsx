import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext'; // Assuming you're using AuthContext for API calls

const LeaveRequests = () => {
  const { apiCall, user } = useAuth(); // Assuming apiCall is available through useAuth
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leave requests from the API
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const adminId = user.id;
        setLoading(true);
        const response = await apiCall(`/leave/getallmanageleaves/${adminId}`, {
          method: 'GET',
        });
        setRequests(response.data.manageLeaves);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        setError('Failed to load leave requests');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [apiCall, user.id]);

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle leave approval
  const handleAction = async (id, action) => {
    try {
      const leaveId = id;
      console.log(action)
      await apiCall(`/leave/validate/leaverequest/${leaveId}`, {
        method: 'PATCH',
        data: { action}, // Pass action (approve or reject) in the body
    
      });
      setRequests(requests.map(req =>
        req._id === id ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
      ));
    } catch (error) {
      console.error(`Error ${action}ing leave request:`, error);
      setError(`Failed to ${action} leave request`);
    }
  };
  if (loading) return <div className="text-center py-4"><CircularProgress /></div>;
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Leave Requests</h1>
      {requests.length === 0 ? (
        <p className="text-gray-500">No leave requests at the moment.</p>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map(request => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.userId.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-500 mr-2" />
                      {formatDate(request.startDate)} to {formatDate(request.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(request._id, 'approve')}
                          className="text-green-600 hover:text-green-900 mr-4 focus:outline-none"
                          aria-label={`Approve leave request from ${request.userId.name}`}
                        >
                          <FaCheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => handleAction(request._id, 'reject')}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                          aria-label={`Decline leave request from ${request.userId.name}`}
                        >
                          <FaTimesCircle size={20} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;
