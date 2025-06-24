import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaKey, FaLock, FaShieldAlt, FaEye, FaEyeSlash, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: otp+new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character (!@#$%^&*)');
    }

    setPasswordStrength({ score, feedback });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    checkPasswordStrength(password);
  };

  // Countdown for resend OTP
  useEffect(() => {
    let interval = null;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(cooldown => cooldown - 1);
      }, 1000);
    } else if (resendCooldown === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
      if (res.data.success) {
        toast.success('OTP sent to your email address');
        setStep(2);
        setResendCooldown(60); // 60 seconds cooldown
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/resend-otp', { email });
      if (res.data.success) {
        toast.success('New OTP sent to your email address');
        setResendCooldown(60);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!otp || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordStrength.score < 4) {
      toast.error('Password does not meet security requirements');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/reset-password', {
        email,
        otp,
        new_password: newPassword,
      });
      if (res.data.success) {
        toast.success('Password reset successful! You can now log in with your new password.');
        // Reset form
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength({ score: 0, feedback: [] });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = (score) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score) => {
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center mb-10">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg transform hover:rotate-6 transition-transform duration-300">
            <FaShieldAlt className="text-4xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            {step === 1
              ? 'Enter your email to receive a verification code'
              : 'Enter the verification code and set a new password'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
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
                    onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                    className="pl-10 w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We'll send a verification code to this email address
                </p>
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
                    Sending Code...
                  </div>
                ) : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 text-sm font-semibold" htmlFor="otp">
                    Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isLoading}
                    className={`text-xs ${resendCooldown > 0 ? 'text-gray-400' : 'text-indigo-600 hover:text-indigo-800'}`}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-indigo-500" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-10 w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-center font-mono text-lg tracking-widest"
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-indigo-500" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className="pl-10 pr-10 w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Password Strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.score <= 2 ? 'text-red-600' : 
                        passwordStrength.score <= 3 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getPasswordStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <div className="flex items-start">
                          <FaInfoCircle className="text-blue-500 mt-0.5 mr-1 flex-shrink-0" />
                          <div>
                            <span>Missing: </span>
                            <span>{passwordStrength.feedback.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-8">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-indigo-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 w-full px-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      confirmPassword && newPassword !== confirmPassword 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-500 text-xs mt-2">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || passwordStrength.score < 4 || newPassword !== confirmPassword}
                className={`w-full px-4 py-3.5 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all ${
                  isLoading || passwordStrength.score < 4 || newPassword !== confirmPassword 
                    ? 'opacity-70 cursor-not-allowed' 
                    : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </div>
                ) : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
        
        <div className="text-center mt-8">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;