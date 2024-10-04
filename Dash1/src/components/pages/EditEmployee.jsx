import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext';

const EditEmployee = () => {
  const { id } = useParams(); // Get the employee ID from the URL
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    mobileNo: '',
    gender: '',
    departmentId: '', // Initialize as an empty string
    dob: '',
    joiningDate: '',
    address: {
      city: '',
      state: '',
      locality: '',
      country: '',
    },
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiCall } = useAuth();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await apiCall(`/Admin/getemployee/${id}`, {
          method: 'GET',
        });
        setEmployee(response.data.result);
        console.log(employee)
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await apiCall('/departments/getdepartment', {
          method: 'GET',
        });
        setDepartments(response.data.result);
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    };

    fetchEmployeeDetails();
    fetchDepartments();
  }, [id, apiCall]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'departmentId') {
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        departmentId: value, // Directly use value which is the department ID
      }));
    } else if (name.startsWith('address.')) {
      const addressKey = name.split('.')[1];
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        address: {
          ...prevEmployee.address,
          [addressKey]: value,
        },
      }));
    } else {
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get department name from departments list based on departmentId
    const department = departments.find((dept) => dept._id === employee.departmentId);
    const departmentname = department ? department.name : '';

    const updatedEmployee = {
      ...employee,
      departmentname, // Include department name instead of ID
      departmentId: undefined // Optionally remove departmentId if not needed
    };

    console.log("Payload being sent:", updatedEmployee);

    try {
      const response = await apiCall(`/Admin/employee/update/${id}`, {
        method: 'PUT',
        data: updatedEmployee,
      });
      console.log(response);
      navigate('/staff-management');
    } catch (err) {
      setError('Failed to update employee details. Please try again.');
      console.error(err);
    }
  };

  if (loading) return <div className='text-center py-4'><CircularProgress /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Edit Staff</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Name and Email */}
            <div className="border p-4 rounded">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={employee.name}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
            <div className="border p-4 rounded">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={employee.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
            {/* Mobile No and Gender */}
            <div className="border p-4 rounded">
              <label className="block text-gray-700">Mobile No</label>
              <input
                type="text"
                name="mobileNo"
                value={employee.mobileNo}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
            <div className="border p-4 rounded">
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender"
                value={employee.gender}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Department and DOB */}
            <div className="border p-4 rounded">
              <label className="block text-gray-700">Department</label>
              <select
                name="departmentId"
                value={employee.departmentId || ""}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="border p-4 rounded">
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={new Date(employee.dob).toISOString().split('T')[0]}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
            {/* Joining Date */}
            <div className="border p-4 rounded">
              <label className="block text-gray-700">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={new Date(employee.joiningDate).toISOString().split('T')[0]}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
            {/* Address */}
            <div className="border p-4 rounded col-span-2">
              <h3 className="text-gray-700 font-semibold mb-2">Address</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={employee.address.city}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={employee.address.state}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Locality</label>
                  <input
                    type="text"
                    name="address.locality"
                    value={employee.address.locality}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={employee.address.country}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;