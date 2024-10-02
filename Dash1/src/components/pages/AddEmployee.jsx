import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAuth } from '../context/AuthContext';
import { LinearProgress } from '@mui/material';


const AddEmployee = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNo: '',
        dob: '',
        gender: '',
        departmentName:'',
        designationId: '',
        password:'',
        base64Image: '', // Will handle file upload
        joiningDate: '',
        address: {
            city: '',
            state: '',
            locality: '',
            country:'India'
        },
        bankDetails: {
            accHolderName: '',
            accountNo: '',
            ifscCode: ''
        },
        education_details: {
            highestQualification: '',
            universitySchoolname: '',
            marksheet_degree_image: null // Will handle file upload
        },
        idproofs: {
            adharNo: '',
            adharPhoto: null, // Will handle file upload
            panNo: '',
            panPhoto: null // Will handle file upload
        }
    });
    const [departments, setDepartments] = useState([]); // For department options
    const [designations, setDesignations]= useState([]);
  const { apiCall } = useAuth(); // Assuming this handles authentication-related API calls
  const [loading, setLoading] = useState(false); // Loading state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
          try {
            const response = await apiCall('http://localhost:3000/departments/getdepartment', {
              method: 'GET',
            });
            const dresponse= await apiCall('http://localhost:3000/designation/getDesignationName',{
                method:"GET"
            })
            // console.log(response.data.result)
            setDepartments(response.data.result); // Assuming departments are in response.result
            setDesignations(dresponse.data.getDesignation)
          } catch (error) {
            console.error('Error fetching departments:', error);
          }
        };
    
        fetchDepartments();
      }, [apiCall]);
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNestedChange = (section, e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                [name]: value
            }
        });
    };
    const handleProfileChange = (e, fieldName) => {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            // On file load, convert to Base64 Data URI
            reader.onloadend = () => {
                const base64DataUri = reader.result;  // Full Data URI (includes MIME type)
                console.log(base64DataUri);  // You can now use the Data URI
                
                // Update the state or perform any other action with the Data URI
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [fieldName]: base64DataUri,  // Store the full Data URI in form data
                }));
            };
    
            reader.readAsDataURL(file);  // Convert file to Base64 Data URI
        }
    };
    

    const handleFileChange = (section, name, e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
       
        reader.onloadend = () => {
            setFormData((prevData) => ({
                ...prevData,
                [section]: {
                    ...prevData[section],
                    [name]: reader.result // base64 string
                }
            }));
        };

        if (file) {
            reader.readAsDataURL(file);
        }
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
        dob: '',
        gender: '',
        departmentName:'',
        password:'',
        profilePicture: null, // Will handle file upload
        joiningDate: '',
        address: {
            city: '',
            state: '',
            locality: ''
        },
        bankDetails: {
            accHolderName: '',
            accountNo: '',
            ifscCode: ''
        },
        education_details: {
            highestQualification: '',
            universitySchoolname: '',
            marksheet_degree_image: null // Will handle file upload
        },
        idproofs: {
            adharNo: '',
            adharPhoto: null, // Will handle file upload
            panNo: '',
            panPhoto: null // Will handle file upload
        }
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
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-bold mb-4">Add Employee</h2>
                {loading && <LinearProgress />}
                <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-4">
                    {/* Name */}
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
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

                    {/* Email */}
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleInputChange}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
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

<div className="col-span-3">
<label className="block text-sm font-medium text-gray-700">Designation</label>
<select
  name="designationId"
  value={formData.designationId}
  onChange={handleInputChange}
  required
  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
>
  <option value="">Select Designation</option>
  {designations && designations.length > 0 ? (
    designations.map((desg) => (
      <option key={desg._id} value={desg._id}>
        {desg.title}
      </option>
    ))
  ) : (
    <option disabled>No designation available</option>
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
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/* Gender */}
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Profile Picture */}
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                        <input
                            type="file"
                            name="base64Image"
                            onChange={(e) => handleProfileChange(e,'base64Image')}
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
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className="col-span-6">
                        <h2 className="text-lg font-semibold mb-2">Address</h2>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.address.city}
                            onChange={(e) => handleNestedChange('address', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.address.state}
                            onChange={(e) => handleNestedChange('address', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Locality</label>
                        <input
                            type="text"
                            name="locality"
                            value={formData.address.locality}
                            onChange={(e) => handleNestedChange('address', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/* Bank Details */}
                    <div className="col-span-6">
                        <h2 className="text-lg font-semibold mb-2">Bank Details</h2>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                        <input
                            type="text"
                            name="accHolderName"
                            value={formData.bankDetails.accHolderName}
                            onChange={(e) => handleNestedChange('bankDetails', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Account No</label>
                        <input
                            type="text"
                            name="accountNo"
                            value={formData.bankDetails.accountNo}
                            onChange={(e) => handleNestedChange('bankDetails', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                        <input
                            type="text"
                            name="ifscCode"
                            value={formData.bankDetails.ifscCode}
                            onChange={(e) => handleNestedChange('bankDetails', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/* Education Details */}
                    <div className="col-span-6">
                        <h2 className="text-lg font-semibold mb-2">Education Details</h2>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Highest Qualification</label>
                        <select
                            name="highestQualification"
                            value={formData.education_details.highestQualification}
                            onChange={(e)=>handleNestedChange('education_details', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select Qualification</option>
                            <option value="Matriculation">Matriculation</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Post Graduate">Post Graduate</option>

                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">University/School Name</label>
                        <input
                            type="text"
                            name="universitySchoolname"
                            value={formData.education_details.universitySchoolname}
                            onChange={(e) => handleNestedChange('education_details', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Marksheet/Degree Image</label>
                        <input
                            type="file"
                            name="marksheet_degree_image"
                            onChange={(e) => handleFileChange('education_details', 'marksheet_degree_image', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* ID Proofs */}
                    <div className="col-span-6">
                        <h2 className="text-lg font-semibold mb-2">ID Proofs</h2>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                        <input
                            type="text"
                            name="adharNo"
                            value={formData.idproofs.adharNo}
                            onChange={(e) => handleNestedChange('idproofs', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Aadhar Photo</label>
                        <input
                            type="file"
                            name="adharPhoto"
                            onChange={(e) => handleFileChange('idproofs', 'adharPhoto', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                        <input
                            type="text"
                            name="panNo"
                            value={formData.idproofs.panNo}
                            onChange={(e) => handleNestedChange('idproofs', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">PAN Photo</label>
                        <input
                            type="file"
                            name="panPhoto"
                            onChange={(e) => handleFileChange('idproofs', 'panPhoto', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-6">
                        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded-md w-full">
                            Add Employee
                        </button>
                    </div>
                </form>
            </div>

            {/* Snackbar for success messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddEmployee;
