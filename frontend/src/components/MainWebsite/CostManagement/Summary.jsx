import React, { useState, useEffect } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon, BoltIcon, WrenchIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

const Summary = () => {
  const [summaryData, setSummaryData] = useState({
    materialsCost: 0,
    laborCost: 0,
    miscCost: 0,
    electricalCost: 0,
    plumbingCost: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all costs on mount
  useEffect(() => {
    fetchAllCosts();
  }, []);

  const fetchAllCosts = async () => {
    try {
      setLoading(true);
      
      const [materialsRes, laborRes, miscRes, electricalRes, plumbingRes] = await Promise.all([
        axios.get(`${API_BASE}/materials`),
        axios.get(`${API_BASE}/labor-costs`),
        axios.get(`${API_BASE}/misc-costs`),
        axios.get(`${API_BASE}/electrical-costs`),
        axios.get(`${API_BASE}/plumbing-costs`),
      ]);

      const materialsCost = materialsRes.data.reduce(
        (sum, m) => sum + parseFloat(m.price),
        0
      );
      const laborCost = laborRes.data.reduce((sum, l) => sum + parseFloat(l.amount), 0);
      const miscCost = miscRes.data.reduce((sum, m) => sum + parseFloat(m.price), 0);
      const electricalCost = electricalRes.data.reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const plumbingCost = plumbingRes.data.reduce((sum, p) => sum + parseFloat(p.amount), 0);

      setSummaryData({
        materialsCost,
        laborCost,
        miscCost,
        electricalCost,
        plumbingCost,
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch cost summary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const grandTotal = summaryData.materialsCost + summaryData.laborCost + summaryData.miscCost + summaryData.electricalCost + summaryData.plumbingCost;

  const getPercentage = (value) => {
    if (grandTotal === 0) return 0;
    return ((value / grandTotal) * 100).toFixed(1);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading summary...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-2 text-lg">Total Project Cost</p>
            <h1 className="text-5xl font-bold">Tk {grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h1>
          </div>
          <ArrowTrendingUpIcon className="w-20 h-20 opacity-20" />
        </div>
      </div>

      {/* Cost Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Materials */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Materials Cost</h3>
            <div className="p-4 bg-blue-100 rounded-full">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-2">Tk {summaryData.materialsCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          <div className="flex items-end">
            <div className="flex-grow bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${getPercentage(summaryData.materialsCost)}%` }}
              ></div>
            </div>
            <span className="ml-3 text-sm font-semibold text-gray-600">{getPercentage(summaryData.materialsCost)}%</span>
          </div>
        </div>

        {/* Labor */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Labor Cost</h3>
            <div className="p-4 bg-green-100 rounded-full">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-2">Tk {summaryData.laborCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          <div className="flex items-end">
            <div className="flex-grow bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${getPercentage(summaryData.laborCost)}%` }}
              ></div>
            </div>
            <span className="ml-3 text-sm font-semibold text-gray-600">{getPercentage(summaryData.laborCost)}%</span>
          </div>
        </div>

        {/* Miscellaneous */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Miscellaneous Cost</h3>
            <div className="p-4 bg-purple-100 rounded-full">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600 mb-2">Tk {summaryData.miscCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          <div className="flex items-end">
            <div className="flex-grow bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${getPercentage(summaryData.miscCost)}%` }}
              ></div>
            </div>
            <span className="ml-3 text-sm font-semibold text-gray-600">{getPercentage(summaryData.miscCost)}%</span>
          </div>
        </div>

        {/* Electrical */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Electrical Cost</h3>
            <div className="p-4 bg-yellow-100 rounded-full">
              <BoltIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600 mb-2">Tk {summaryData.electricalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          <div className="flex items-end">
            <div className="flex-grow bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full" 
                style={{ width: `${getPercentage(summaryData.electricalCost)}%` }}
              ></div>
            </div>
            <span className="ml-3 text-sm font-semibold text-gray-600">{getPercentage(summaryData.electricalCost)}%</span>
          </div>
        </div>

        {/* Plumbing */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Plumbing Cost</h3>
            <div className="p-4 bg-orange-100 rounded-full">
              <WrenchIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-600 mb-2">Tk {summaryData.plumbingCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          <div className="flex items-end">
            <div className="flex-grow bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full" 
                style={{ width: `${getPercentage(summaryData.plumbingCost)}%` }}
              ></div>
            </div>
            <span className="ml-3 text-sm font-semibold text-gray-600">{getPercentage(summaryData.plumbingCost)}%</span>
          </div>
        </div>
      </div>

      {/* Detailed Summary Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Cost Summary Details</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-blue-50 transition">
              <td className="px-6 py-4 text-sm text-gray-700 font-medium">Materials</td>
              <td className="px-6 py-4 text-sm text-right font-semibold text-blue-600">Tk {summaryData.materialsCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 text-sm text-right text-gray-600">{getPercentage(summaryData.materialsCost)}%</td>
            </tr>
            <tr className="border-b hover:bg-green-50 transition">
              <td className="px-6 py-4 text-sm text-gray-700 font-medium">Labor</td>
              <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">Tk {summaryData.laborCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 text-sm text-right text-gray-600">{getPercentage(summaryData.laborCost)}%</td>
            </tr>
            <tr className="border-b hover:bg-purple-50 transition">
              <td className="px-6 py-4 text-sm text-gray-700 font-medium">Miscellaneous</td>
              <td className="px-6 py-4 text-sm text-right font-semibold text-purple-600">Tk {summaryData.miscCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 text-sm text-right text-gray-600">{getPercentage(summaryData.miscCost)}%</td>
            </tr>
            <tr className="border-b hover:bg-yellow-50 transition">
              <td className="px-6 py-4 text-sm text-gray-700 font-medium">Electrical</td>
              <td className="px-6 py-4 text-sm text-right font-semibold text-yellow-600">Tk {summaryData.electricalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 text-sm text-right text-gray-600">{getPercentage(summaryData.electricalCost)}%</td>
            </tr>
            <tr className="border-b hover:bg-orange-50 transition">
              <td className="px-6 py-4 text-sm text-gray-700 font-medium">Plumbing</td>
              <td className="px-6 py-4 text-sm text-right font-semibold text-orange-600">Tk {summaryData.plumbingCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 text-sm text-right text-gray-600">{getPercentage(summaryData.plumbingCost)}%</td>
            </tr>
            <tr className="bg-gradient-to-r from-blue-50 to-blue-100 font-bold">
              <td className="px-6 py-4 text-sm font-bold text-gray-900">TOTAL</td>
              <td className="px-6 py-4 text-sm text-right font-bold text-blue-700 text-lg">Tk {grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 text-sm text-right font-bold text-gray-800">100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Export Button */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition">
          Download Summary
        </button>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default Summary;
