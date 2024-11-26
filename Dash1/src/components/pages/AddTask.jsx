import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress'; // Import LinearProgress

const AddTask = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false); // Use to show linear progress bar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { apiCall } = useAuth();

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiCall('/departments/getdepartment', {
          method: 'GET',
        });
        setDepartments(response.data.result);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setError('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [apiCall]);

  const handleDepartmentChange = async (event) => {
    const departmentName = event.target.value;
    setSelectedDepartment(departmentName);

    if (departmentName) {
      setLoading(true);
      setError('');
      try {
        const response = await apiCall(`/Admin/getemployeeindepartment/${departmentName}`, {
          method: 'GET',
        });
        setStaffList(response.data.employees);
        setFormData(response.data.employees.map(staff => ({
          assignedTo: staff._id,
          title: '',
          description: '',
          dueDate: '',
        })));
        setShowForm(true);
      } catch (error) {
        console.error('Error fetching staff:', error);
        setError('Failed to load staff for the selected department');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validData = formData.filter(entry => entry.title && entry.description && entry.dueDate);

    if (validData.length === 0) {
      alert('Please fill in at least one staff member\'s task details.');
      return;
    }

    const submissionData = { tasks: validData };

    setSubmitLoading(true); // Show linear progress bar

    try {
      await apiCall('http://localhost:3000/usertask/tasks', {
        method: 'POST',
        data: submissionData,
      });
      alert('Tasks created successfully!');
      setFormData([]);
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting tasks:', error);
      setError('Error submitting tasks');
    } finally {
      setSubmitLoading(false); // Hide progress bar after submission
    }
  };

  if (loading) return <div className="text-center py-4"><CircularProgress /></div>;
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Add Task</h1>
        
        {loading && <div className="text-center text-gray-600">Loading...</div>}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="mb-4">
          <label htmlFor="department" className="block text-gray-700 font-medium mb-2">Select Department:</label>
          <select
            id="department"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="">-- Select Department --</option>
            {departments.map(department => (
              <option key={department._id} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4">Department: {selectedDepartment}</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Staff Name</th>
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">Description</th>
                    <th className="px-4 py-2 border">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.length > 0 ? (
                    staffList.map((staff, index) => (
                      <tr key={staff._id}>
                        <td className="px-4 py-2 border text-center">{index + 1}</td>
                        <td className="px-4 py-2 border">{staff.name}</td>
                        <td className="px-4 py-2 border">
                          <input
                            type="text"
                            value={formData[index]?.title || ''}
                            onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                            className="border p-2 rounded w-full"
                          />
                        </td>
                        <td className="px-4 py-2 border">
                          <input
                            type="text"
                            value={formData[index]?.description || ''}
                            onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                            className="border p-2 rounded w-full"
                          />
                        </td>
                        <td className="px-4 py-2 border">
                          <input
                            type="date"
                            value={formData[index]?.dueDate || ''}
                            onChange={(e) => handleInputChange(index, 'dueDate', e.target.value)}
                            className="border p-2 rounded w-full"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4">No staff data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
              disabled={formData.filter(entry => entry.title && entry.description && entry.dueDate).length === 0}
            >
              Submit
            </button>

            {/* Display LinearProgress when submitting */}
            {submitLoading && <LinearProgress className="mt-4" />}
          </form>
        )}
      </div>
    </div>
  );
};

export default AddTask;
