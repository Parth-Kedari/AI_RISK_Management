import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password
      });
      
      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Includes user_id
        toast.success('Login successful!');
        window.location.href = '/'; // Force reload to dashboard for instant auth state
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center mb-10">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg transform hover:rotate-6 transition-transform duration-300">
            <FaShieldAlt className="text-4xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-indigo-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-semibold" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-800">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-indigo-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-3.5 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center group">
            <FaArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;