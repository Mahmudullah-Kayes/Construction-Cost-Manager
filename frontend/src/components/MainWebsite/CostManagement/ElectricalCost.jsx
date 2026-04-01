import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

const ElectricalCost = () => {
  const [electricalEntries, setElectricalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    name: '',
    note: '',
  });
  
  const [editingId, setEditingId] = useState(null);

  // Fetch electrical costs on mount
  useEffect(() => {
    fetchElectricalCosts();
  }, []);

  const fetchElectricalCosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/electrical-costs`);
      setElectricalEntries(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch electrical costs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEntry = async () => {
    if (!formData.date || !formData.amount) {
      setError('Please fill all required fields');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/electrical-costs/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE}/electrical-costs`, formData);
      }
      
      setFormData({ date: '', amount: '', name: '', note: '' });
      fetchElectricalCosts();
      setError('');
    } catch (err) {
      setError(editingId ? 'Failed to update electrical cost' : 'Failed to add electrical cost');
      console.error(err);
    }
  };

  const handleEdit = (entry) => {
    setFormData({
      date: entry.date,
      amount: entry.amount,
      name: entry.name || '',
      note: entry.note || '',
    });
    setEditingId(entry.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this electrical cost?')) return;

    try {
      await axios.delete(`${API_BASE}/electrical-costs/${id}`);
      fetchElectricalCosts();
      setError('');
    } catch (err) {
      setError('Failed to delete electrical cost');
      console.error(err);
    }
  };

  const totalElectrical = electricalEntries.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading electrical costs...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Electrical Cost Entry</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Date"
          />
          
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cost Name"
          />
          
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
          />
        </div>

        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Note (optional)"
        />

        <button
          onClick={handleAddEntry}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md flex items-center justify-center gap-2 transition"
        >
          <PlusIcon className="w-5 h-5" />
          {editingId ? 'Update Electrical Cost' : 'Add Electrical Cost'}
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cost Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Note</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {electricalEntries.map(entry => (
              <tr key={entry.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-700">{new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{entry.name}</td>
                <td className="px-6 py-3 text-sm text-gray-700">Tk {parseFloat(entry.amount) % 1 === 0 ? parseFloat(entry.amount) : parseFloat(entry.amount).toFixed(2)}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{entry.note}</td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {electricalEntries.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No electrical costs added yet. Add one to get started.
          </div>
        )}
      </div>

      {/* Total Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-300 p-6 shadow-md">
        <div className="text-right">
          <p className="text-gray-700 text-sm mb-2 font-medium">Total Electrical Cost</p>
          <p className="text-4xl font-bold text-yellow-700">Tk {totalElectrical % 1 === 0 ? totalElectrical : totalElectrical.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ElectricalCost;
