import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { GiMoneyStack } from "react-icons/gi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FcDepartment } from "react-icons/fc";
import { FcLeave } from "react-icons/fc";
import {
  HomeOutlined,
  AppstoreOutlined,
  BarsOutlined,
  PayCircleOutlined,
} from '@ant-design/icons';

import { useAuth } from '../context/AuthContext';

const MenuList = ({ darkTheme }) => {
  const { isAdmin,user } = useAuth(); // Access the isAdmin function from the context
  
  
  // Define menu items based on the user's role
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to={user.role === 'admin' ? '/' : '/employeeDashboard'}>Home</Link>
    },
    
    ...(isAdmin()
      ? [
          {
            key: 'tasks',
            icon: <BarsOutlined />,
            label: 'Tasks',
            children: [
              {
                key: 'Manage Task',
                label: <Link to="/managetasks">Manage Task</Link>,
              },
              {
                key: 'Create task',
                label: <Link to='/addtask'>Create task</Link>,
              },
            ],
          },
          {
            key: 'staff',
            icon: <HiMiniUserGroup/>,
            label: 'Staff',
            children: [
              {
                key: 'add-staff',
                label: <Link to = "/addStaff">Add Staff</Link>,
              },
              {
                key: 'manage-staff',
                label:  <Link to="/staff-management">Manage Staff</Link>,
              },
            ],
          },
          {
            key: 'Add Salary',
            icon: <GiMoneyStack/>,
            label:<Link to='/paysalary'>Add salary</Link>
          },

          {
            key: 'leave',
            icon: <FcLeave/>,
            label: 'Leaves',
            children: [
              {
                key: 'manage-leaves',
                label: <Link to='/manageleave'>Manage leave</Link>,
              },
              {
                key: 'leave-history',
                label: <Link to="/employee/leaves">Leave history</Link>,
              },
            ],
          },
          {
            key: 'department',
            icon: <FcDepartment/>,
            label: 'Department',
            children: [
              {
                key: 'manage-department',
                label: 'Manage Department',
              },
              {
                key: 'add-department',
                label: <Link to="/department">Add Department</Link>,
              },
            ],
          },
        ]
      : [
          {
            key: 'my-tasks',
            icon: <BarsOutlined />,
            label: 'My Tasks',
            children:[
              {
                key: 'Task History',
                label: <Link to='/employeedashboard/employeetaskhistory'>My Task history</Link>
              },
              {
                key: 'Pending tasks',
                label: <Link to="/employeedashboard/employependingtask">Pending tasks</Link>,
              },
            ],

          },
          {
            key: 'my-salary',
            icon: <PayCircleOutlined />,
            label: <Link to='employeesalary'>My Salary</Link>,
          },

          {
            key: 'leave',
            icon: <BarsOutlined />,
            label: 'leave',
            children: [
              {
                key: 'apply leave',
                label: <Link to= "/employeeDashboard/applyleave">apply leave</Link>
              },
              {
                key: 'my leave History',
                label: <Link to="leavehistory">my leave History</Link>,
              },
            ],
          },
        ]),
    
  ];

  return (
    <>
    <Menu theme={darkTheme ? 'dark' : 'light'} mode="inline" className="menu-bar" items={menuItems}/>
     
    </>
  );
};

export default MenuList;
