import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const SignUp = () => {
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [roleAvailability, setRoleAvailability] = useState({
    adminExists: false,
    accountantExists: false,
  });
  const [checkingRoles, setCheckingRoles] = useState(true);

  const { register, isAuthenticated, user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  // Check if admin/accountant already exist
  useEffect(() => {
    const checkRoles = async () => {
      try {
        const response = await api.get('/auth/check-roles');
        setRoleAvailability({
          adminExists: response.data.adminExists,
          accountantExists: response.data.accountantExists,
        });
      } catch (error) {
        console.error('Error checking roles:', error);
      } finally {
        setCheckingRoles(false);
      }
    };
    checkRoles();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else if (user.role === 'accountant') {
        navigate('/accountant/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleRoleSelect = (role) => {
    if (role === 'admin' && roleAvailability.adminExists) {
      setError('An admin account already exists. Only one admin account is allowed.');
      return;
    }
    if (role === 'accountant' && roleAvailability.accountantExists) {
      setError('An accountant account already exists. Only one accountant account is allowed.');
      return;
    }
    setRegisterData({ ...registerData, role });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setIsLoading(true);

    try {
      // Client-side validation
      if (!registerData.name.trim()) {
        setError('Name is required');
        setFieldErrors({ name: 'Name is required' });
        setIsLoading(false);
        return;
      }

      if (!registerData.email.trim()) {
        setError('Email is required');
        setFieldErrors({ email: 'Email is required' });
        setIsLoading(false);
        return;
      }

      if (registerData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setFieldErrors({ password: 'Password must be at least 6 characters long' });
        setIsLoading(false);
        return;
      }

      if (registerData.password !== registerData.confirmPassword) {
        setError('Passwords do not match');
        setFieldErrors({ confirmPassword: 'Passwords do not match' });
        setIsLoading(false);
        return;
      }

      const result = await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role,
      });

      if (!result.success) {
        setError(result.message || 'Registration failed. Please try again.');
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        console.error('Registration failed:', result);
      } else {
        // Success - user will be redirected automatically
        setError('');
        setFieldErrors({});
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Panel - Background Image */}
      <div
        className="hidden lg:block relative w-1/2 overflow-hidden"
        style={{
          backgroundImage: "url('/left_background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
        }}
      />

      {/* Right Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 py-8 sm:py-12 bg-white dark:bg-gray-800">
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Join the community to manage complaints and payments.
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            SELECT YOUR ROLE
          </label>
          <div className="grid grid-cols-3 gap-3">
            {/* Resident Role */}
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                registerData.role === 'student'
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <svg
                className={`w-6 h-6 mb-2 ${
                  registerData.role === 'student'
                    ? 'text-cyan-600 dark:text-cyan-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14v7"
                />
              </svg>
              <span
                className={`text-sm font-medium ${
                  registerData.role === 'student'
                    ? 'text-cyan-600 dark:text-cyan-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Resident
              </span>
            </button>

            {/* Admin Role */}
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              disabled={roleAvailability.adminExists}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                roleAvailability.adminExists
                  ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800'
                  : registerData.role === 'admin'
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <svg
                className={`w-6 h-6 mb-2 ${
                  roleAvailability.adminExists
                    ? 'text-gray-400 dark:text-gray-600'
                    : registerData.role === 'admin'
                    ? 'text-cyan-600 dark:text-cyan-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span
                className={`text-sm font-medium ${
                  roleAvailability.adminExists
                    ? 'text-gray-400 dark:text-gray-600'
                    : registerData.role === 'admin'
                    ? 'text-cyan-600 dark:text-cyan-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Admin
              </span>
            </button>

            {/* Accountant Role */}
            <button
              type="button"
              onClick={() => handleRoleSelect('accountant')}
              disabled={roleAvailability.accountantExists}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                roleAvailability.accountantExists
                  ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800'
                  : registerData.role === 'accountant'
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <svg
                className={`w-6 h-6 mb-2 ${
                  roleAvailability.accountantExists
                    ? 'text-gray-400 dark:text-gray-600'
                    : registerData.role === 'accountant'
                    ? 'text-cyan-600 dark:text-cyan-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span
                className={`text-sm font-medium ${
                  roleAvailability.accountantExists
                    ? 'text-gray-400 dark:text-gray-600'
                    : registerData.role === 'accountant'
                    ? 'text-cyan-600 dark:text-cyan-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Accountant
              </span>
            </button>
          </div>
          {roleAvailability.adminExists && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Admin account already exists
            </p>
          )}
          {roleAvailability.accountantExists && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Accountant account already exists
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleRegister}>
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-400 ${
                  fieldErrors.name
                    ? 'border-red-500 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="John Doe"
                value={registerData.name}
                onChange={(e) => {
                  setRegisterData({ ...registerData, name: e.target.value });
                  if (fieldErrors.name) {
                    const newErrors = { ...fieldErrors };
                    delete newErrors.name;
                    setFieldErrors(newErrors);
                  }
                }}
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-400 ${
                  fieldErrors.email
                    ? 'border-red-500 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="student@university.edu"
                value={registerData.email}
                onChange={(e) => {
                  setRegisterData({ ...registerData, email: e.target.value });
                  if (fieldErrors.email) {
                    const newErrors = { ...fieldErrors };
                    delete newErrors.email;
                    setFieldErrors(newErrors);
                  }
                }}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-400 ${
                  fieldErrors.password
                    ? 'border-red-500 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your password"
                value={registerData.password}
                onChange={(e) => {
                  setRegisterData({ ...registerData, password: e.target.value });
                  if (fieldErrors.password) {
                    const newErrors = { ...fieldErrors };
                    delete newErrors.password;
                    setFieldErrors(newErrors);
                  }
                }}
              />
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-400 ${
                  fieldErrors.confirmPassword
                    ? 'border-red-500 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Confirm your password"
                value={registerData.confirmPassword}
                onChange={(e) => {
                  setRegisterData({ ...registerData, confirmPassword: e.target.value });
                  if (fieldErrors.confirmPassword) {
                    const newErrors = { ...fieldErrors };
                    delete newErrors.confirmPassword;
                    setFieldErrors(newErrors);
                  }
                }}
              />
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading || checkingRoles}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
