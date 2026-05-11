import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Cost Management
import CostManagementDashboard from './components/MainWebsite/CostManagement/CostManagementDashboard';

// Main App Layout Component
const MainWebsiteLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <CostManagementDashboard />
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Website Routes (Public) */}
        <Route path="/" element={<MainWebsiteLayout />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;