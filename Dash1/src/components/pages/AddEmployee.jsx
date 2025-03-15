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
        base64Image: '',
        joiningDate: '',
        address: {
            city: '',
            state: '',
            locality: '',
            country: 'India',
        },
        bankDetails: {
            accHolderName: '',
            accountNo: '',
            ifscCode: '',
        },
        education_details: {
            highestQualification: '',
            universitySchoolname: '',
            marksheet_degree_image: null,
        },
        idproofs: {
            adharNo: '',
            adharPhoto: null,
            panNo: '',
            panPhoto: null,
        },
    });

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const { apiCall } = useAuth();
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await apiCall('/departments/getdepartment', { method: 'GET' });
                const dresponse = await apiCall('/designation/getDesignationName', { method: 'GET' });
                setDepartments(response.data.result);
                setDesignations(dresponse.data.getDesignation);
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
                [name]: value,
            },
        });
    };

    const handleProfileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64DataUri = reader.result;
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [fieldName]: base64DataUri,
                }));
            };
            reader.readAsDataURL(file);
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
                    [name]: reader.result,
                },
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const staffData = {
            ...formData,
            dob: new Date(formData.dob).toISOString(),
            joiningDate: new Date(formData.joiningDate).toISOString(),
        };
        try {
            const response = await apiCall('/Admin/addemploye', {
                method: 'POST',
                data: staffData,
            });
            setLoading(false);
            setSnackbarMessage('Employee added successfully!');
            setSnackbarOpen(true);
            setFormData({
                name: '',
                email: '',
                mobileNo: '',
                dob: '',
                gender: '',
                departmentName: '',
                password: '',
                base64Image: '',
                joiningDate: '',
                address: {
                    city: '',
                    state: '',
                    locality: '',
                    country: 'India',
                },
                bankDetails: {
                    accHolderName: '',
                    accountNo: '',
                    ifscCode: '',
                },
                education_details: {
                    highestQualification: '',
                    universitySchoolname: '',
                    marksheet_degree_image: null,
                },
                idproofs: {
                    adharNo: '',
                    adharPhoto: null,
                    panNo: '',
                    panPhoto: null,
                },
            });
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Employee</h2>
                {loading && <LinearProgress />}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Personal Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Personal Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Phone</label>
                            <input
                                type="text"
                                name="mobileNo"
                                value={formData.mobileNo}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Profile Picture</label>
                            <input
                                type="file"
                                name="base64Image"
                                onChange={(e) => handleProfileChange(e, 'base64Image')}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Employment Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Department</label>
                            <select
                                name="departmentName"
                                value={formData.departmentName}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                            <label className="block text-sm font-medium text-gray-600">Designation</label>
                            <select
                                name="designationId"
                                value={formData.designationId}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
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
                            <label className="block text-sm font-medium text-gray-600">Joining Date</label>
                            <input
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Address Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Address Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.address.city}
                                onChange={(e) => handleNestedChange('address', e)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.address.state}
                                onChange={(e) => handleNestedChange('address', e)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Locality</label>
                            <input
                                type="text"
                                name="locality"
                                value={formData.address.locality}
                                onChange={(e) => handleNestedChange('address', e)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Bank Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Account Holder Name</label>
                            <input
                                type="text"
                                name="accHolderName"
                                value={formData.bankDetails.accHolderName}
                                onChange={(e) => handleNestedChange('bankDetails', e)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Account No</label>
                            <input
                                type="text"
                                name="accountNo"
                                value={formData.bankDetails.accountNo}
                                onChange={(e) => handleNestedChange('bankDetails', e)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">IFSC Code</label>
                            <input
                                type="text"
                                name="ifscCode"
                                value={formData.bankDetails.ifscCode}
                                onChange={(e) => handleNestedChange('bankDetails', e)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Education Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Education Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Highest Qualification</label>
                            <select
                                name="highestQualification"
                                value={formData.education_details.highestQualification}
                                onChange={(e) => handleNestedChange('education_details', e)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                            <label className="block text-sm font-medium text-gray-600">University/School Name</label>
                            <input
                                type="text"
                                name="universitySchoolname"
                                value={formData.education_details.universitySchoolname}
                                onChange={(e) => handleNestedChange('education_details', e)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Marksheet/Degree Image</label>
                            <input
                                type="file"
                                name="marksheet_degree_image"
                                onChange={(e) => handleFileChange('education_details', 'marksheet_degree_image', e)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* ID Proofs */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">ID Proofs</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Aadhar Number</label>
                            <input
                                type="text"
                                name="adharNo"
                                value={formData.idproofs.adharNo}
                                onChange={(e) => handleNestedChange('idproofs', e)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Aadhar Photo</label>
                            <input
                                type="file"
                                name="adharPhoto"
                                onChange={(e) => handleFileChange('idproofs', 'adharPhoto', e)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">PAN Number</label>
                            <input
                                type="text"
                                name="panNo"
                                value={formData.idproofs.panNo}
                                onChange={(e) => handleNestedChange('idproofs', e)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                                />

                                </div>

                                <div className="col-span-1 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">PAN Photo</label>
                        <input
                            type="file"
                            name="panPhoto"
                            onChange={(e) => handleFileChange('idproofs', 'panPhoto', e)}
                            className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                        />
                    </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-1 sm:col-span-3">
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
