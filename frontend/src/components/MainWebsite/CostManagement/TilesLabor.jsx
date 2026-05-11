import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

const TilesLabor = () => {
  const [tilesLabor, setTilesLabor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    date: '',
    paid_amount: '',
  });
  
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTilesLabor();
  }, []);

  const fetchTilesLabor = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/tiles-labor`);
      setTilesLabor(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tiles labor data');
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
    if (!formData.date || !formData.paid_amount) {
      setError('Please fill all required fields');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/tiles-labor/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE}/tiles-labor`, formData);
      }
      
      setFormData({ date: '', paid_amount: '' });
      setShowForm(false);
      fetchTilesLabor();
      setError('');
    } catch (err) {
      setError(editingId ? 'Failed to update entry' : 'Failed to add entry');
      console.error(err);
    }
  };

  const handleEdit = (entry) => {
    setFormData({
      date: entry.date,
      paid_amount: entry.paid_amount,
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await axios.delete(`${API_BASE}/tiles-labor/${id}`);
      fetchTilesLabor();
      setError('');
    } catch (err) {
      setError('Failed to delete entry');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({ date: '', paid_amount: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const totalPaid = tilesLabor.reduce((sum, e) => sum + parseFloat(e.paid_amount || 0), 0);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading tiles labor data...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {editingId ? 'Edit Tiles Labor Entry' : 'Add Tiles Labor Entry'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <input
              type="number"
              name="paid_amount"
              value={formData.paid_amount}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paid Amount"
              step="0.01"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddEntry}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-md transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center gap-2 transition"
        >
          <PlusIcon className="w-5 h-5" />
          Add Entry
        </button>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Paid Amount</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tilesLabor.map(entry => (
              <tr key={entry.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-700">
                  {new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-3 text-sm font-semibold text-blue-600">
                  Tk {parseFloat(entry.paid_amount).toFixed(2)}
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tilesLabor.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No tiles labor entries added yet.
          </div>
        )}
      </div>

      {/* Total Section */}
      {tilesLabor.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-300 p-6 shadow-md">
          <div className="text-right">
            <p className="text-gray-700 text-sm mb-2 font-medium">Total Paid (Tiles Labor)</p>
            <p className="text-4xl font-bold text-blue-700">Tk {totalPaid.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TilesLabor;
