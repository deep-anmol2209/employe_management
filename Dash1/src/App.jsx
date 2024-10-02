import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Layoutapp from './components/layout/Layoutapp';
import Dashboard from './components/pages/Dashboard';
import { Login } from './components/authentication/Login';
import { Register } from './components/authentication/Register';
import PrivateRoute from './components/PrivateRoute';
import EmployeDashboard from './components/pages/EmployeDashboard';
import Employeedetails from './components/pages/Employeedetails';
import AlertDelete from './components/pages/AlertDelete';
import EditEmployee from './components/pages/EditEmployee';
import DepartmentTable from './components/pages/DepartmentTable';
import ApplyLeave from './components/pages/ApplyLeave';
import AddStaff from './components/pages/AddStaff';
import AddAdmin from './components/pages/AddAdmin';
import LeaveRequests from './components/pages/LeaveRequests';
import LeaveHistory from './components/pages/LeaveHistory';
import Paysalary from './components/pages/Paysalary';
import EmployeeSalary from './components/pages/EemployeSalary';
import  AddTask  from './components/pages/AddTask';
import TaskDes from './components/pages/TaskDes';
import Employeetasks from './components/pages/Employeetasks';
import Managetasks from './components/pages/Managetasks';
import EmployeeTaskHistory from './components/pages/EmployeeTaskHistory';
import Getallleaverequests from './components/pages/GetallleaveRequests';
import AddEmployee from './components/pages/AddEmployee';

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => setDarkTheme(prev => !prev);
  const toggleSidebar = () => setCollapsed(prev => !prev);

  return (
    <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Admin Routes */}
  <Route 
    path="/" 
    element={ 
      <PrivateRoute requiredRole="admin">
        <Layoutapp toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} darkTheme={darkTheme} collapsed={collapsed}>
          <Outlet />
        </Layoutapp>
      </PrivateRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="/staff-management" element={<Employeedetails />} />
    <Route path="/deleteEmployee" element={<AlertDelete />} />
    <Route path="/edit-staff/:id" element={<EditEmployee />} />
    <Route path="/department" element={<DepartmentTable />} />
    <Route path = "addStaff" element={<AddStaff/>}/>
    <Route path='/addAdmin' element= {<AddAdmin/>}/>
    <Route path= "/manageleave" element={<LeaveRequests/>}/>
    <Route path='/paysalary' element= {<Paysalary/>}/>
    <Route path='/addtask' element={<AddTask/>}/>
    <Route path='/submitdescription' element={<TaskDes/>}/>
    <Route path='/managetasks' element={<Managetasks/>}/>
    <Route path='/employee/leaves' element={<Getallleaverequests/>}/>
    <Route path="/addEmployee" element={<AddEmployee/>}/>
  </Route>

  {/* Employee Dashboard Routes */}
  <Route 
    path="/employeeDashboard" 
    element={
      <PrivateRoute requiredRole="employee">
        <Layoutapp toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} darkTheme={darkTheme} collapsed={collapsed}>
          <Outlet />
        </Layoutapp>
      </PrivateRoute>
    }
  >
    <Route index element={<EmployeDashboard />} />
    <Route path="applyleave" element={<ApplyLeave />} />
    <Route path= "leavehistory" element= {<LeaveHistory/>}/>
    <Route path='employeesalary' element={<EmployeeSalary/>}/>
    <Route path= "employependingtask" element={<Employeetasks/>}/>
    <Route path='employeetaskhistory' element={<EmployeeTaskHistory/>}/>
  
    {/* Example of more nested routes */}
    {/* <Route path="tasks" element={<EmployeeTasks />} /> */}
  </Route>
</Routes>
    
  );
}

export default App;