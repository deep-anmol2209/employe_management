import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Register = () => {
  const backgroundimage = '/images/mepl.jpg';
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const onChangeInput = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerSubmit = async e => {
    e.preventDefault();
    console.log("form submission prevented");
    try {
      if (!user.name || !user.email || !user.password || !user.phoneNumber) {
        console.log("enter details");
      }
      const response = await axios.post('http://192.168.29.189:3000/user/register', { ...user });
      const token = response.data;
      console.log(token);
      localStorage.setItem('token', token.accesstoken);

      // Navigate programmatically
      navigate('/Admin');
      
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div>
      <div className="display flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundimage})`, width: "100%" }}>
        <div className="w-96 bg-transparent border-2 border-white/10 backdrop-blur-lg shadow-lg text-white rounded-lg p-10">
          <form onSubmit={registerSubmit}>
            <h1 className="text-3xl text-center mb-10">Register</h1>

            <div className="relative w-full h-12 mb-8">
              <input 
                type="text" 
                placeholder="Name" 
                required 
                name='name'
                value={user.name}
                onChange={onChangeInput}
                className="w-full h-full bg-transparent border-2 border-white/20 rounded-md text-lg p-4 text-white placeholder-white outline-none" 
              />
            </div>

            <div className="relative w-full h-12 mb-8">
              <input 
                type="email" 
                placeholder="Email" 
                required 
                name='email'
                value={user.email}
                onChange={onChangeInput}
                className="w-full h-full bg-transparent border-2 border-white/20 rounded-md text-lg p-4 text-white placeholder-white outline-none" 
              />
            </div>

            <div className="relative w-full h-12 mb-8">
              <input 
                type="password" 
                placeholder="Password" 
                required 
                name='password'
                value={user.password}
                onChange={onChangeInput}
                className="w-full h-full bg-transparent border-2 border-white/20 rounded-md text-lg p-4 text-white placeholder-white outline-none" 
              />
            </div>

            <div className="relative w-full h-12 mb-8">
              <input 
                type="text" 
                placeholder="Phone Number" 
                required 
                name='phoneNumber'
                value={user.phoneNumber}
                onChange={onChangeInput}
                className="w-full h-full bg-transparent border-2 border-white/20 rounded-md text-lg p-4 text-white placeholder-white outline-none" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full h-12 bg-white text-gray-900 rounded-md text-lg font-semibold shadow-md hover:bg-gray-200 transition"
            >
              Register
            </button>
            </form>

         </div>
         </div>
         </div>)}