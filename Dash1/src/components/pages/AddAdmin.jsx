import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Alert from '@mui/material/Alert';

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [alert, setAlert] = useState({ show: false, severity: '', message: '' });
  const { apiCall } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Admin details:', formData);

    try {
      const response = await apiCall('/Admin/addNewadmin', {
        method: 'POST',
        data: formData,
      });
       console.log('res...',response.msg)
      if (response.status === 201) {
        // Show success alert
        setAlert({
          show: true,
          severity: 'success',
          message: 'Admin added successfully!',
        });
        setFormData({ name: '', email: '', password: '' }); // Clear form data on success
      }
  
      else if(response.status=== 400){
        setAlert({
          show: true,
          severity: 'error',
          message: response.msg
         })
      }
      
      else {
        // Show error alert if status is not 201
        setAlert({
          show: true,
          severity: 'error',
          message: response.data.message || 'Failed to add admin!',
        });
      }
    } catch (err) {
      let errorMessage = 'An error occurred while adding the admin.';

      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || errorMessage;
      }

      // Show error alert for unexpected errors
      setAlert({
        show: true,
        severity: 'error',
        message: errorMessage,
      });
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Admin</h1>

          {/* Alert */}
          {alert.show && (
            <Alert severity={alert.severity} sx={{ mb: 4 }}>
              {alert.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {/* Admin Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Admin Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition ease-in-out duration-150"
              >
                Add Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAdmin;
