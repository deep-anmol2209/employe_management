import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import authService from '../authService';
import { Link } from 'react-router-dom';
import AlertDialog from './AlertDelete';  // Import the AlertDialog component
import Button from '@mui/material/Button'; // Import the Button component
import { useAuth } from '../context/AuthContext';

const Employeedetails = () => {
  const { apiCall } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await apiCall('/Admin/fetchemployee', {
          method: "GET",
        });

        console.log("your response is: ",response);
        if(response && response.data){
          setContent(response.data.employees);
          
        }
        else{
          setError(response.msg)
        }
        
        //setContent(response.data.employees);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.response && err.status === 400) {
          setError('No employees found.'); // Handle 400 error case by setting a specific message
        } else if (err.response && err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
        } else {
          setError(err.message);
        }
      }
    };

    fetchStaffData();
  }, [apiCall]);

  const handleDeleteClick = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      await apiCall(`/Admin/employee/delete/${employeeToDelete}`, {
        method: "DELETE",
      });

      setContent(content.filter((employee) => employee._id !== employeeToDelete));
      setEmployeeToDelete(null);
      setOpenDialog(false); // Close the dialog after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-4"><CircularProgress /></div>;
  // if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Manage Staff</h3>
        <div className="overflow-x-auto">
          {error==='not founded'? (
            <p className="text-center text-gray-600">No employees found.</p>
          ) : (
            <table className="min-w-full bg-white border border-black">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">#</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Photo</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Department</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Gender</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Mobile</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">DOB</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Joined On</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">Locality</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">City</th>
                  <th className="px-4 py-2 border-b border-r border-black text-left text-sm font-medium text-gray-700">State</th>
                  
                  <th className="px-4 py-2 border-b border-black text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {content.map((cnt) => (
                  <tr key={cnt._id} className={`hover:bg-gray-50 ${cnt.id % 2 === 0 ? 'bg-white-50' : 'bg-grey'}`}>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.id}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.name}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">
                      <img src={`http://localhost:3001${cnt.photo}`} className="w-12 h-12 rounded-full" alt="User" />
                    </td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.departmentId?.name}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.gender}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.mobileNo}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.email}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{new Date(cnt.dob).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{new Date(cnt.joiningDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.address?.locality}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.address?.city}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-sm text-gray-700">{cnt.address?.state}</td>
                    
                    <td className="px-4 py-2  border-black text-sm text-gray-700 flex mt-2 gap-2">
                      <Link to={`/edit-staff/${cnt._id}`} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Edit</Link>
                      <Button
                        sx={{ height: "28px"   }}
                        variant="outlined"
                        color="error"
                        
                        onClick={() => handleDeleteClick(cnt._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AlertDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Employeedetails;
