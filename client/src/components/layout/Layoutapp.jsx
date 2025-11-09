import React from 'react';
import { Avatar, Stack } from '@mui/material';
import { Button as Bt } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Logo from "./Logo";
import { Button, Layout, theme } from "antd";
import LogoutAlert from '../pages/LogoutAlert';
import MenuList from './MenuList';
import ToggleThemeButton from './ToggleThemeButton';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { BookTwoTone } from '@mui/icons-material';
import config from '../../../configure';

const { Header, Sider, Content } = Layout;

export default function Layoutapp({ children, toggleTheme, collapsed, darkTheme, toggleSidebar }) {
  const { logout, user } = useAuth();
  console.log("user is here ", user);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    console.log("confirm clicked")
    setOpenLogoutDialog(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  const { token: { colorBgContainer } } = theme.useToken(); // Correctly fetching the token

  return (
    <Layout>
      <Sider style={{ position: "sticky", top: 0}} collapsed={collapsed} collapsible trigger={null} theme={darkTheme ? 'dark' : 'light'} className='sidebar'>
        <Logo />
        <MenuList darkTheme={darkTheme} />
        <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </Sider>
      <Layout>
        <Header style={{ position: 'sticky', top:0, padding: 0, background: 'rgb(218, 218, 218)' }} className="flex justify-between items-center">
          <Button
            type='text'
            className="toggle"
            onClick={toggleSidebar}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
          <Stack direction="row" spacing={0.5} alignItems="center">
            {user.role === 'employee' && (
              <Avatar
                alt={user.name}
                src={`${config.domainName}/${user.photo}`}
                sx={{ width: 50, height: 50, position: "relative", right: 30, border: 1, borderColor: "black"}}
              />
            )}
            <Bt
              type="text"
              onClick={handleLogoutClick}
              sx={{color: "black", position: "relative", right: 10, border:1, borderColor: "black", borderRadius:15, backgroundColor: 'white',
              
              '&:hover': {
                backgroundColor: 'red', // Change background color on hover
               // Change text color on hover 
              }}}
            >
              Logout
            </Bt>
          </Stack>
        </Header>
        <Content style={{ margin: '16px', background: colorBgContainer }}>
          {children}
        </Content>
      </Layout>
      <LogoutAlert
         open={openLogoutDialog}
         onClose={handleLogoutCancel}
         onLogout={handleLogoutConfirm}
      />
    </Layout>
  );
}