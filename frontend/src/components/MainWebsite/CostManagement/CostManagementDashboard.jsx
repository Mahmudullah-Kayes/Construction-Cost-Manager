import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MaterialsTab from './MaterialsTab';
import LaborCost from './LaborCost';
import MiscCost from './MiscCost';
import ElectricalCost from './ElectricalCost';
import PlumbingCost from './PlumbingCost';
import Summary from './Summary';

const CostManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('summary');

  const renderContent = () => {
    switch (activeTab) {
      case 'materials':
        return <MaterialsTab />;
      case 'labor':
        return <LaborCost />;
      case 'misc':
        return <MiscCost />;
      case 'electrical':
        return <ElectricalCost />;
      case 'plumbing':
        return <PlumbingCost />;
      case 'summary':
      default:
        return <Summary />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900">
              {activeTab === 'summary' && 'Dashboard'}
              {activeTab === 'materials' && 'Materials'}
              {activeTab === 'labor' && 'Labor Cost'}
              {activeTab === 'misc' && 'Miscellaneous Costs'}
              {activeTab === 'electrical' && 'Electrical Costs'}
              {activeTab === 'plumbing' && 'Plumbing Costs'}
            </h2>
            <p className="text-gray-600 mt-2">Manage and track your project expenses</p>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default CostManagementDashboard;
