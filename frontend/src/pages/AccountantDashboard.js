import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AccountantSidebar from '../components/accountant/AccountantSidebar';
import AccountantHome from '../components/accountant/AccountantHome';
import FeeRecords from '../components/accountant/FeeRecords';
import PendingFines from '../components/accountant/PendingFines';
import FinancialReports from '../components/accountant/FinancialReports';
import Notifications from '../components/accountant/Notifications';
import GenerateFine from '../components/accountant/GenerateFine';

const AccountantDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AccountantSidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/dashboard" element={<AccountantHome />} />
          <Route path="/fees" element={<FeeRecords />} />
          <Route path="/fines" element={<PendingFines />} />
          <Route path="/reports" element={<FinancialReports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/generate-fine" element={<GenerateFine />} />
        </Routes>
      </div>
    </div>
  );
};

export default AccountantDashboard;











