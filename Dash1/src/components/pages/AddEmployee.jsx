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
        departmentName: '',
        designationId: '',
        password: '',
        address: {
            city: '',
            state: '',
            locality: ''
        },
        joiningDate: '',
        bankDetails: {
            accHolderName: '',
            accountNo: '',
            ifscCode: '',
        },
        education_details: {
            highestQualification: '',
            universitySchoolname: '',
        },
    });

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const { apiCall } = useAuth();
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await apiCall('/departments/getdepartment', { method: 'GET' });
                const dresponse = await apiCall('/designation/getDesignationName', { method: 'GET' });
                setDepartments(response.data.result);
                setDesignations(dresponse.data.getDesignation);
            } catch (error) {
                console.error('Error fetching departments:', error);
                showSnackbar('Failed to load departments and designations', 'error');
            }
        };
        fetchDepartments();
    }, [apiCall]);

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value || undefined });
    };

    const handleNestedChange = (section, e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                [name]: value,
            },
        });
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            mobileNo: '',
            dob: '',
            gender: '',
            departmentName: '',
            designationId: '',
            password: '',
            address: {
                city: '',
                state: '',
                locality: ''
            },
            joiningDate: '',
            bankDetails: {
                accHolderName: '',
                accountNo: '',
                ifscCode: '',
            },
            education_details: {
                highestQualification: '',
                universitySchoolname: '',
            },
        });
        setProfilePicture(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate required fields
        if (!profilePicture) {
            showSnackbar('Please upload a profile picture', 'error');
            setLoading(false);
            return;
        }

        // Create FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('profilePicture', profilePicture);

        // Append all other form data
        Object.keys(formData).forEach(key => {
            if (key === 'bankDetails' || key === 'education_details' || key === 'address') {
                formDataToSend.append(key, JSON.stringify(formData[key]));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await apiCall('/Admin/addEmploye', {
                method: 'POST',
                data: formDataToSend,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status===201) {
                showSnackbar('Employee added successfully!', 'success');
                resetForm();
            }
            else{
                showSnackbar(response.data.msg)
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            const errorMessage = error.response?.data?.msg || 
                              error.response?.data?.message || 
                              error.message || 
                              'Failed to add employee';
            showSnackbar(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Add New Employee
                    </h1>
                    <p className="mt-3 text-xl text-gray-500">
                        Fill in the details to create a new employee profile
                    </p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    {loading && <LinearProgress />}

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Personal Details Card */}
                        <div className="space-y-6 bg-blue-50 p-6 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                                        <input
                                            type="tel"
                                            name="mobileNo"
                                            value={formData.mobileNo}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                            required
                                            placeholder="9876543210"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth*</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Details*</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.address.city}
                                        onChange={(e) => handleNestedChange('address', e)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                        required
                                        placeholder="City"
                                    />

                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.address.state}
                                        onChange={(e) => handleNestedChange('address', e)}
                                        className="w-full px-4 py-2 border my-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                        required
                                        placeholder="State"
                                    />
                                    <input
                                        type="text"
                                        name="locality"
                                        value={formData.address.locality}
                                        onChange={(e) => handleNestedChange('address', e)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                        required
                                        placeholder="Street Address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture*</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {profilePicture ? profilePicture.name : 'Upload photo'}
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                name='profilePicture'
                                                onChange={handleFileChange}
                                                className="hidden"
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employment Details Card */}
                        <div className="space-y-6 bg-indigo-50 p-6 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-indigo-100 p-2 rounded-full">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Employment Details</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
                                    <select
                                        name="departmentName"
                                        value={formData.departmentName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept._id} value={dept.name}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation*</label>
                                    <select
                                        name="designationId"
                                        value={formData.designationId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                       
                                    >
                                        <option value="">Select Designation</option>
                                        {designations.map((desg) => (
                                            <option key={desg._id} value={desg._id}>
                                                {desg.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date*</label>
                                    <input
                                        type="date"
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                            required
                                            minLength="8"
                                            placeholder="••••••••"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                                </div>
                            </div>
                        </div>

                        {/* Bank & Education Details Card */}
                        <div className="space-y-6">
                            {/* Bank Details */}
                            <div className="bg-purple-50 p-6 rounded-xl space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-purple-100 p-2 rounded-full">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Bank Details</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name*</label>
                                    <input
                                        type="text"
                                        name="accHolderName"
                                        value={formData.bankDetails.accHolderName}
                                        onChange={(e) => handleNestedChange('bankDetails', e)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number*</label>
                                    <input
                                        type="text"
                                        name="accountNo"
                                        value={formData.bankDetails.accountNo}
                                        onChange={(e) => handleNestedChange('bankDetails', e)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
                                        required
                                        placeholder="1234567890"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code*</label>
                                    <input
                                        type="text"
                                        name="ifscCode"
                                        value={formData.bankDetails.ifscCode}
                                        onChange={(e) => handleNestedChange('bankDetails', e)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
                                        required
                                        placeholder="ABCD0123456"
                                    />
                                </div>
                            </div>

                            {/* Education Details */}
                            <div className="bg-green-50 p-6 rounded-xl space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Education Details</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification*</label>
                                    <select
                                        name="highestQualification"
                                        value={formData.education_details.highestQualification}
                                        onChange={(e) => handleNestedChange('education_details', e)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                                        required
                                    >
                                        <option value="">Select Qualification</option>
                                        <option value="Matriculation">Matriculation</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Graduate">Graduate</option>
                                        <option value="Post Graduate">Post Graduate</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">University/School Name*</label>
                                    <input
                                        type="text"
                                        name="universitySchoolname"
                                        value={formData.education_details.universitySchoolname}
                                        onChange={(e) => handleNestedChange('education_details', e)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                                        required
                                        placeholder="Harvard University"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 lg:col-span-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Add Employee'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Snackbar for messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{
                        width: '100%',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        borderRadius: '0.5rem'
                    }}
                >
                    <div className="flex items-center">
                        {snackbarSeverity === 'success' ? (
                            <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        )}
                        {snackbarMessage}
                    </div>
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddEmployee;