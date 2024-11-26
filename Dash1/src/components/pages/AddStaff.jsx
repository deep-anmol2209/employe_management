import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LinearProgress, Snackbar, Alert } from '@mui/material';

const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    gender: '',
    departmentName: '',
    dob: '',
    joiningDate: '',
    password: '',
   
    address: {
      city: '',
      state: '',
      locality: '',
      country: 'India',
    },
    bankDetails: {
      accountHolderName: '',
      accountNo: '',
      ifscCode: '',
    },
  });

  const [departments, setDepartments] = useState([]); // For department options
  const { apiCall } = useAuth(); // Assuming this handles authentication-related API calls
  const [loading, setLoading] = useState(false); // Loading state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiCall('http://localhost:3000/departments/getdepartment', {
          method: 'GET',
        });
        // console.log(response.data.result)
        setDepartments(response.data.result); // Assuming departments are in response.result
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, [apiCall]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

  setFormData((prevState) => ({
    ...prevState,
    [name]: value,
  }));
  };

  const handleNestedChange = (section, e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...(prevState[section] || {}),  // Ensure the section (e.g., address or bankDetails) is not undefined
        [name]: value,
      },
    }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0]; // Ensure you're picking the first file
    console.log(file)
    if (file) {
      convertToBase64(file)
        .then((base64) => {
          setFormData((prevState) => ({
            ...prevState,
            base64Image: base64, // Store the Base64 string in formData
          }));
        })
        .catch((error) => console.error('Error converting image to Base64:', error));
    }
  };
  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); // The base64 string of the image
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file); // Convert file to Base64
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true)
    // const base64Image= await convertToBase64(formData.picture)

    const staffData = {
      ...formData,
      dob: new Date(formData.dob).toISOString(),
      joiningDate: new Date(formData.joiningDate).toISOString()
      
    };
 console.log(staffData)
    try {
      const response = await apiCall('http://localhost:3000/Admin/addemploye', {
        method: 'POST',
        data: staffData,
      });
      // console.log('Staff added successfully:', response);
      setLoading(false); // Stop loading
      setSnackbarMessage('Staff added successfully!');
      setSnackbarOpen(true); // Show success message
      setFormData({
        name: '',
        email: '',
        mobileNo: '',
        gender: '',
        departmentName: '',
        dob: '',
        joiningDate: '',
        password: '',
        address: {
          city: '',
          state: '',
          locality: '',
          country: 'India',
        },
        bankDetails: {
          accountHolderName: '',
          accountNo: '',
          ifscCode: '',
        },
      });
      
      // Optionally, reset file input as well
      document.querySelector('input[type="file"]').value = '';
      
      // Optionally navigate to a success page
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  return (
    <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Add Staff</h1>
        {loading && <LinearProgress />}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-6 gap-4">
            {/* Name */}
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded p-2"
              />
            </div>

            {/* Email */}
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded p-2"
              />
            </div>

            {/* Mobile */}
<div className="col-span-3">
<label className="block text-sm font-medium text-gray-700">Mobile No</label>
<input
  type="tel"
  name="mobileNo"
  value={formData.mobileNo}
  onChange={handleInputChange}
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
/>
</div>

{/* Gender */}
<div className="col-span-3">
<label className="block text-sm font-medium text-gray-700">Gender</label>
<select
  name="gender"
  value={formData.gender}
  onChange={handleInputChange}
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Other">Other</option>
</select>
</div>

{/* Password */}
<div className="col-span-3">
<label className="block text-sm font-medium text-gray-700">Password</label>
<input
  type="password"
  name="password"
  value={formData.password}
  onChange={handleInputChange}
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
/>
</div>

{/* Department */}
<div className="col-span-3">
<label className="block text-sm font-medium text-gray-700">Department</label>
<select
  name="departmentName"
  value={formData.departmentName}
  onChange={handleInputChange}
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
>
  <option value="">Select Department</option>
  {departments && departments.length > 0 ? (
    departments.map((dept) => (
      <option key={dept._id} value={dept.name}>
        {dept.name}
      </option>
    ))
  ) : (
    <option disabled>No departments available</option>
  )}
</select>
</div>

{/* Date of Birth */}
<div className="col-span-3">
<label className="block text-sm font-medium text-gray-700">Date of Birth</label>
<input
  type="date"
  name="dob"
  value={formData.dob}
  onChange={handleInputChange}
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
/>
</div>
{/* Joining Date */}
<div className="col-span-3">
<label className="block text-sm font-medium text-gray-700">Joining Date</label>
<input
  type="date"
  name="joiningDate"
  value={formData.joiningDate}
  onChange={handleInputChange}
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
/>
</div>
{/* Address */}
<div className="col-span-2">
<label className="block text-sm font-medium text-gray-700">City</label>
<input
  type="text"
  name="city"
  value={formData.address.city}
  onChange={(e) => handleNestedChange('address', e)} 
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
/>
</div>
<div className="col-span-2">
<label className="block text-sm font-medium text-gray-700">State</label>
<input
  type="text"
  name="state"
  value={formData.address.state}
  onChange={(e) => handleNestedChange('address', e)} 
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
/>
</div>
<div className="col-span-2">
<label className="block text-sm font-medium text-gray-700">Locality</label>
<input
  type="text"
  name="locality"
  value={formData.address.locality}
  onChange={(e) => handleNestedChange('address', e)} 
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
/>

</div>

{/* Bank Details */}
<div className="col-span-2">
<label className="block text-sm font-medium text-gray-700">Account Holder Name</label> {/* Added Account Holder Name field */}
<input
  type="text"
  name="accountHolderName"
  value={formData.bankDetails.accountHolderName}
  onChange={(e) => handleNestedChange('bankDetails', e)} 
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
/>
</div>

<div className="col-span-2">
<label className="block text-sm font-medium text-gray-700">Account No</label>
<input
  type="text"
  name="accountNo"
  value={formData.bankDetails.accountNo}
  onChange={(e) => handleNestedChange('bankDetails', e)} 
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
/>
</div>

<div className="col-span-2">
<label className="block text-sm font-medium text-gray-700">IFSC Code</label>
<input
  type="text"
  name="ifscCode"
  value={formData.bankDetails.ifscCode}
  onChange={(e) => handleNestedChange('bankDetails', e)} 
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
/>
</div>


            {/* Picture Upload */}
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <input type="file" onChange={handlePictureChange} className="mt-1 block w-full" />
            </div>

            <div className="col-span-6">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Add Staff
              </button>
            </div>
          </div>
        </form>
        {/* Snackbar for success/error messages */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('successfully') ? 'success' : 'error'}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AddStaff;
















































































