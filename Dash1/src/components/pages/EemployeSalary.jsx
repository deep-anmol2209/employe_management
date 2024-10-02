import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext';
const EmployeeSalary = () => {
    const [salaryData, setSalaryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { apiCall, user } = useAuth();

    // Fetch employee salary data from API
    useEffect(() => {
        const fetchSalary = async () => {
            try {
                const employeeId = user.id; // Get employee ID from context
                console.log(employeeId);
                const response = await apiCall(`http://localhost:3000/salary/${employeeId}/getemployeesalary`, {
                    method: "GET"
                });
                setSalaryData(response.data.salary); // Set salary data
            } catch (err) {
                setError('Failed to fetch salary details');
                console.error(err);
            } finally {
                setLoading(false); // Ensure loading is set to false
            }
        };

        fetchSalary();
    }, [apiCall, user.id]); // Include apiCall and user.id in dependency array
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };

      if (loading) return <div className="text-center py-4"><CircularProgress /></div>;
      if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;
    
    return (
    
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">My salary</h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border">#</th>
                                    <th className="px-4 py-2 border">Amount</th>
                                    <th className="px-4 py-2 border">Pay Date</th>
                                    <th className="px-4 py-2 border">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaryData.length > 0 ? (
                                    salaryData.map((salary, index) => (
                                        <tr key={index} className="text-center">
                                            <td className="px-4 py-2 border">{index + 1}</td>
                                            <td className="px-4 py-2 border">{salary.totalSalary}</td>
                                            <td className="px-4 py-2 border">{formatDate(salary.paidDate)}</td>
                                            <td className="px-4 py-2 border">{salary.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center p-4">No salary data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        
    );
};

export default EmployeeSalary;

