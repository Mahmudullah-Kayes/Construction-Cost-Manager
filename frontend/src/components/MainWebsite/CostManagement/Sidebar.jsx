import React, { useState } from 'react';
import { ChartBarIcon, CurrencyDollarIcon, UserGroupIcon, DocumentTextIcon, Bars3Icon, XMarkIcon, BoltIcon, WrenchIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: 'summary', label: 'Summary', icon: ChartBarIcon },
    { id: 'materials', label: 'Materials', icon: CurrencyDollarIcon },
    { id: 'labor', label: 'Labor Cost', icon: UserGroupIcon },
    { id: 'misc', label: 'Miscellaneous', icon: DocumentTextIcon },
    { id: 'electrical', label: 'Electrical', icon: BoltIcon },
    { id: 'plumbing', label: 'Plumbing', icon: WrenchIcon },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-blue-700 flex items-center justify-between">
          {isOpen && <h1 className="text-2xl font-bold">CostMgmt</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-blue-700 rounded-lg transition"
          >
            {isOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-white text-blue-900 font-semibold shadow-lg'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-700">
            <p className="text-xs text-blue-200">© 2025 CostMgmt</p>
            <p className="text-xs text-blue-300 mt-2">Personal Use v1.0</p>
          </div>
        )}
      </div>

      {/* Mobile Toggle Button */}
      <div className="hidden sm:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-600 text-white rounded-lg"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Offset */}
      <div className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        {/* This div is used to offset the main content */}
      </div>
    </>
  );
};

export default Sidebar;
