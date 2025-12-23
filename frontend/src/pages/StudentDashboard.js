import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import StudentSidebar from '../components/student/StudentSidebar';
import StudentHome from '../components/student/StudentHome';
import Complaints from '../components/student/Complaints';
import Fees from '../components/student/Fees';
import MessMenu from '../components/student/MessMenu';
import Notifications from '../components/student/Notifications';
import RoomAllocation from '../components/student/RoomAllocation';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const roomApproved = user?.roomAllocationStatus === 'approved';
  const allowedPathsWhenUnassigned = ['/student/dashboard', '/student/room', '/student/mess'];
  const isAllowed =
    roomApproved || allowedPathsWhenUnassigned.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/dashboard" element={<StudentHome />} />
          <Route
            path="/complaints"
            element={roomApproved ? <Complaints /> : <Navigate to="/student/room" replace />}
          />
          <Route
            path="/fees"
            element={roomApproved ? <Fees /> : <Navigate to="/student/room" replace />}
          />
          <Route path="/mess" element={<MessMenu />} />
          <Route
            path="/notifications"
            element={roomApproved ? <Notifications /> : <Navigate to="/student/room" replace />}
          />
          <Route path="/room" element={<RoomAllocation />} />
          {!isAllowed && <Route path="*" element={<Navigate to="/student/room" replace />} />}
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;











