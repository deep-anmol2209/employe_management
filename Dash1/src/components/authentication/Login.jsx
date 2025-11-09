import React, { lazy, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const backgroundimage = '/images/login.jpeg';
  const { login } = useAuth(); // Get the login function from AuthContext
  const [user, setUser] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // ✅ Normal login
  const loginSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      if (!user.email || !user.password) {
        alert('Please enter all details');
        return;
      }
      setLoading(true);
      await login(user);
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Demo login using env variables
  const handleDemoLogin = async () => {
    if (loading) return;

    const demoEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const demoPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!demoEmail || !demoPassword) {
      alert('Demo credentials are missing from .env');
      return;
    }

    try {
      setLoading(true);
      await login({ email: demoEmail, password: demoPassword });
    } catch (err) {
      alert('Demo login failed. Check demo credentials or backend config.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundimage})`, width: "100%" }}
    >
      <div className="w-96 bg-transparent border-2 border-black/10 backdrop-blur-lg shadow-lg text-black rounded-lg p-10">
        <form onSubmit={loginSubmit}>
          <h1 className="text-3xl text-center mb-10 font-semibold">Login</h1>

          <div className="relative w-full h-12 mb-8">
            <input
              style={{ outline: "2px solid black" }}
              type="text"
              placeholder="Email"
              required
              name="email"
              value={user.email}
              onChange={onChangeInput}
              className="w-full h-full bg-transparent border-2 border-black/20 rounded-md text-lg p-4 text-black placeholder-black"
            />
          </div>

          <div className="relative w-full h-12 mb-8">
            <input
              type="password"
              placeholder="Password"
              style={{ outline: "2px solid black" }}
              required
              name="password"
              value={user.password}
              onChange={onChangeInput}
              className="w-full h-full bg-transparent border-2 border-black/20 rounded-md text-lg p-4 text-black placeholder-black"
            />
          </div>

          {/* Main login button */}
          <button
            type="submit"
            className="w-full h-12 bg-white text-gray-900 rounded-md text-lg font-semibold shadow-md hover:bg-gray-200 transition disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Divider */}
          <div className="text-center text-gray-600 my-4">or</div>

          {/* Demo login button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full h-12 bg-gray-800 text-white rounded-md text-lg font-semibold shadow-md hover:bg-gray-900 transition disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Logging in as Demo...' : 'Try Demo Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
