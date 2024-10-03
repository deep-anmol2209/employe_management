import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaTrashAlt, FaBuilding, FaPlus } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress';

const DepartmentTable = () => {
  const [departments, setDepartments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ name: '' }); // Only track name for editing
  const [adding, setAdding] = useState(false);
  const [error , setError]= useState(null)
  const [newDepartment, setNewDepartment] = useState({ name: '' });
  const [loading ,setLoading] = useState(true)
  const { apiCall } = useAuth();

  useEffect(() => {
    function fetchdepartments(){
    apiCall('/departments/getdepartment', {
      method: 'GET',
    })
      .then((response) => {
        console.log(response);
        if (response.data.result && Array.isArray(response.data.result)) {
          setDepartments(response.data.result);
        } else {
         
          console.error('Unexpected response format:', response);
        }
      })
      .catch((error) => {
       
        console.error('There was an error fetching the departments!', error);
      }).finally(() => {
        setLoading(false); // Stop loading once data is fetched
      });
    }
    fetchdepartments()
  }, [apiCall]);

  const handleEdit = (department) => {
    setEditing(department._id);
    setEditData({ name: department.name });
  };

  const handleSave = () => {
    apiCall(`http://localhost:3000/departments/${editing}`, {
      method: 'PUT',
      data: editData,
    })
      .then((response) => {
        setDepartments(
          departments.map((department) =>
            department._id === editing
              ? { ...department, name: editData.name }
              : department
          )
        );
        setEditing(null);
      })
      .catch((error) => {
        console.error('There was an error updating the department!', error);
      });
  };

  const handleDelete = (id) => {
    apiCall(`http://localhost:3000/departments/deleteDepartment/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setDepartments(departments.filter((department) => department._id !== id));
      })
      .catch((error) => {
        console.error('There was an error deleting the department!', error);
      });
  };

  const handleAdd = () => {
   
    if (newDepartment.name) {
      apiCall('http://localhost:3000/departments/postdepartment', {
        method: 'POST',
        data: { name: newDepartment.name, employees: [] }, // Send empty employees array
      })
        .then((response) => {
          console.log(response.data.result.name)
          
          console.log(departments)
          setNewDepartment([ ...departments, response.data.result.name ]);
          setDepartments([...departments, newDepartment]);
          setAdding(false)
          console.log(departments)
  
         
        })
        .catch((error) => {
          console.error('There was an error adding the department!', error);
        });
    } else {
      alert('Please enter valid department details');
    }
  };

  
    if (loading) return <div className="text-center py-4"><CircularProgress /></div>;
    
  

  return (
    <div className="p-4 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Departments</h1>

      <div className="flex flex-col">
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 border-b text-left text-gray-700">Name</th>
                <th className="py-3 px-4 border-b text-left text-gray-700">Employees</th>
                <th className="py-3 px-4 border-b text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            { departments.length===0 ? (<p className="text-center relative left-200 text-gray-600">No Department added yet</p>):(
            <tbody>
              {departments.map((department) => (
                <tr key={department._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 flex items-center text-gray-800">
                    <FaBuilding size={20} className="mr-2 text-blue-500" />
                    {editing === department._id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ name: e.target.value })}
                        className="border border-gray-300 p-1 rounded w-full"
                      />
                    ) : (
                      department.name
                    )}
                  </td>
                  <td className="py-2 px-4 text-gray-800">
                    {(department.employees || []).length}
                  </td>
                  <td className="py-2 px-4 flex space-x-2">
                    {editing === department._id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="bg-green-500 text-white p-1 rounded hover:bg-green-600 flex items-center"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600 flex items-center"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(department)}
                          className="text-blue-500 hover:text-blue-700 flex items-center"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(department._id)}
                          className="text-red-500 hover:text-red-700 flex items-center"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>)
}
          </table>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setAdding(!adding)}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
          >
            <FaPlus className="mr-2" /> Add Department
          </button>
        </div>

        {adding && (
          <div className="p-4 bg-white border border-gray-300 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Add New Department</h2>
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                placeholder="Department Name"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ name: e.target.value })}
                className="border border-gray-300 p-2 rounded"
              />
              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Add Department
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentTable;
