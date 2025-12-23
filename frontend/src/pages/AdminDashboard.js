import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHome from '../components/admin/AdminHome';
import MessManagement from '../components/admin/MessManagement';
import RoomManagement from '../components/admin/RoomManagement';
import Notifications from '../components/admin/Notifications';
import Complaints from '../components/admin/Complaints';
import RoomRequests from '../components/admin/RoomRequests';
import Reports from '../components/admin/Reports';

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/dashboard" element={<AdminHome />} />
          <Route path="/mess" element={<MessManagement />} />
          <Route path="/rooms" element={<RoomManagement />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/room-requests" element={<RoomRequests />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;











