import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
const EmployeeTaskHistory = () => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, apiCall } = useAuth();

  // Fetch task details when the component mounts
  useEffect(() => {
    const fetchTaskDetails = async () => {
      const empid = user.id;
      try {
        setLoading(true);
        const response = await apiCall(
          `http://localhost:3000/usertask/employee/task/completed/${empid}`,
          {
            method: 'GET',
          }
        );
        setTask(response.data.completedTasks);
        setLoading(false);
      } catch (error) {
        setError('Error fetching task details');
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [user.id]); // Dependency array to trigger API call when user ID changes
  if (loading) return <div className="text-center py-4"><CircularProgress /></div>;
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;


  // Handle case where no tasks are available
  if (!task || !task.length) {
    return <div className="text-center">No task details available</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4">
        {task.map((task, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-lg rounded-lg p-6 mb-4"
          >
            {/* Title */}
            <div className="col-span-1">
              <h2 className="text-xl font-semibold mb-2">Title</h2>
              <p className="text-gray-700">{task.title}</p>
            </div>

            {/* Description */}
            <div className="col-span-1">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{task.description}</p>
            </div>

            {/* Submitted On */}
            <div className="col-span-1">
              <h2 className="text-xl font-semibold mb-2">Submitted On</h2>
              <p className="text-gray-700">
                {new Date(task.submittedOn).toLocaleDateString()}
              </p>
            </div>

            {/* Due Date */}
            <div className="col-span-1">
              <h2 className="text-xl font-semibold mb-2">Due Date</h2>
              <p className="text-gray-700">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-2">Status</h2>
              <p
                className={`text-lg font-bold ${
                  task.status === 'completed'
                    ? 'text-green-600'
                    : task.status === 'in-progress'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {task.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTaskHistory;
