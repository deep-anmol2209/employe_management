import React, { useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';



import { useAuth } from '../context/AuthContext';

const Getallleaverequests = () => {
  const { apiCall } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchStaffleaves = async () => {
      try {
        const response = await apiCall('/leave/getallleaves', {
          method: "GET",
        });
        console.log("your response is: ", response.data);
        
        setContent(response.data.requests);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.response && err.response.status === 400) {
          setError('No employees found.');
        } else if (err.response && err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
        } else {
          setError(err.message);
        }
      }
    };

    fetchStaffleaves();
  }, [apiCall]);

  

  

  if (loading) return <div className="text-center py-4"><CircularProgress /></div>;
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-lg font-semibold text-gray-700 mb-4">Leave History</h1>
        <div className="overflow-x-auto">
          {error === 'No employees found' ? (
            <p className="text-center text-gray-600">No leaves found found.</p>
          ) : (
            <table className="min-w-full bg-white border border-black">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">#</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Photo</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Department</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Leave Type</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Reason</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Start Date</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">End Date</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Applied On</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {content.map((cnt, index) => (
                  <tr key={cnt._id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{index + 1}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.userId?.name}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">
                      <img src={cnt.userId?.profilePicture?.secure_url} className="w-12 h-12 rounded-full" alt="User" />
                    </td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.userId?.departmentId?.name}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.userId?.email}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.type}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.reason}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{new Date(cnt.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{new Date(cnt.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{new Date(cnt.appliedOn).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.status}</td>
                   
                    
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

     
    </div>
  );
};

export default Getallleaverequests;
