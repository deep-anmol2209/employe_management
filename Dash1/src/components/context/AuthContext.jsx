import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../authService.js';
import { options } from 'joi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AuthService.fetchUser();
        console.log(user)
        setUser(user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
        console.log("logging in");
        console.log(credentials);

        const user = await AuthService.login(credentials);
        console.log("logged in");
        console.log("User details:", user);

        setUser(user);
        if(user.role==="admin"){
          console.log("admin is here")
        navigate('/');
        }
        else{
          console.log("employee is here")
          navigate('/employeeDashboard')
        }
    } catch (err) {
        console.error("Login error:", err);
        let errorMessage = "An error occurred. Please try again.";

        if (err.response && err.response.data) {
            errorMessage = err.response.data.msg || errorMessage;
        }

        // Optionally show an error message to the user
        alert(errorMessage); // Or use a more sophisticated error display mechanism
    }
};


  const logout = () => {
    console.log("loggingout")
    AuthService.logout();
    setUser(null);
    navigate('/login');
  };
  const getToken = () => {
    console.log("gettoken called")
    return AuthService.getToken();
  };

  const isAdmin = () => {
    return user?.role === "admin"
  };
  const apiCall=(endpoint, options = {})=>{
    return AuthService.apiCall(endpoint, options)
  }

  const value = useMemo(
    () => ({ user, loading, login, logout,  apiCall, getToken, isAdmin}),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};