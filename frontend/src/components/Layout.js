import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (role === 'student') {
      return [
        { path: '/student/dashboard', label: 'Dashboard' },
        { path: '/student/complaints', label: 'Complaints' },
        { path: '/student/fees', label: 'Fees' },
        { path: '/student/mess', label: 'Mess Menu' },
        { path: '/student/notifications', label: 'Notifications' },
        { path: '/student/room', label: 'Room Allocation' },
      ];
    } else if (role === 'accountant') {
      return [
        { path: '/accountant/dashboard', label: 'Dashboard' },
        { path: '/accountant/fees', label: 'Fee Records' },
        { path: '/accountant/fines', label: 'Pending Fines' },
        { path: '/accountant/reports', label: 'Financial Reports' },
      ];
    } else if (role === 'admin') {
      return [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/mess', label: 'Mess Management' },
        { path: '/admin/rooms', label: 'Room Management' },
        { path: '/admin/notifications', label: 'Notifications' },
        { path: '/admin/complaints', label: 'Complaints' },
        { path: '/admin/room-requests', label: 'Room Requests' },
        { path: '/admin/reports', label: 'Reports' },
      ];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">Roomify</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {getNavLinks().map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${
                      location.pathname === link.path
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user?.name}</span>
              <span className="text-gray-500 mr-4">({user?.role})</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default Layout;








