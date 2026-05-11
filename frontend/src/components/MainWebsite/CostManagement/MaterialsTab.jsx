import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

const PRESET_MATERIALS = [
  'সিমেন্ট',
  'লাল বালি',
  'ইট',
  'পাথর',
  'সাদা বালু',
  'রড',
  'Plumbing Material',
  'Electrical Material',
  'Color',
  'Tiles',
];

// --- Custom Material Name Dropdown ---
const MaterialDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (value && !PRESET_MATERIALS.includes(value)) {
      setIsCustom(true);
      setCustomValue(value);
    } else if (!value) {
      setIsCustom(false);
      setCustomValue('');
    }
  }, [value]);

  const handleSelect = (material) => {
    setIsCustom(false);
    setCustomValue('');
    onChange(material);
    setOpen(false);
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    onChange(customValue);
    setOpen(false);
  };

  const handleCustomInput = (e) => {
    setCustomValue(e.target.value);
    onChange(e.target.value);
  };

  const displayLabel = isCustom
    ? (customValue || 'Custom...')
    : (value || 'Select Material');

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 border rounded-md text-sm transition
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${value ? 'border-gray-300 text-gray-800' : 'border-gray-300 text-gray-400'}
          bg-white hover:border-blue-400`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDownIcon className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <ul className="max-h-56 overflow-y-auto divide-y divide-gray-50">
            {PRESET_MATERIALS.map((mat) => (
              <li key={mat}>
                <button
                  type="button"
                  onClick={() => handleSelect(mat)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition
                    ${value === mat && !isCustom ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <span>{mat}</span>
                  {value === mat && !isCustom && <CheckIcon className="w-4 h-4 text-blue-500" />}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 p-2 bg-gray-50">
            <p className="text-xs text-gray-500 mb-1.5 px-1 font-medium">Custom Material</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customValue}
                onChange={handleCustomInput}
                onClick={(e) => e.stopPropagation()}
                placeholder="Type custom name..."
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleCustomSelect}
                disabled={!customValue.trim()}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Use
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
const MaterialsTab = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filterPreset, setFilterPreset] = useState('');

  const [formData, setFormData] = useState({
    date: '',
    name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    note: '',
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/materials`);
      setMaterials(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch materials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNameChange = (val) => {
    setFormData(prev => ({ ...prev, name: val }));
  };

  const handleAddMaterial = async () => {
    if (!formData.date || !formData.name || !formData.quantity || !formData.price) {
      setError('Please fill all required fields');
      return;
    }
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/materials/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE}/materials`, formData);
      }
      setFormData({ date: '', name: '', quantity: '', unit: 'kg', price: '', note: '' });
      fetchMaterials();
      setError('');
    } catch (err) {
      setError(editingId ? 'Failed to update material' : 'Failed to add material');
      console.error(err);
    }
  };

  const handleEdit = (material) => {
    setFormData({
      date: material.date,
      name: material.name,
      quantity: material.quantity,
      unit: material.unit || 'kg',
      price: material.price,
      note: material.note || '',
    });
    setEditingId(material.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await axios.delete(`${API_BASE}/materials/${id}`);
      fetchMaterials();
      setError('');
    } catch (err) {
      setError('Failed to delete material');
      console.error(err);
    }
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesText = m.name.toLowerCase().includes(filterText.toLowerCase());
    const matchesPreset = filterPreset === '' || m.name === filterPreset;
    return matchesText && matchesPreset;
  });

  const totalPrice = filteredMaterials.reduce((sum, m) => sum + parseFloat(m.price), 0);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading materials...</div>;
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
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          {editingId ? 'Edit Material Entry' : 'Add New Material Entry'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <MaterialDropdown value={formData.name} onChange={handleNameChange} />

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Quantity"
          />

          <select
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="kg">kg</option>
            <option value="pcs">pcs</option>
            <option value="bag">bag</option>
            <option value="m">m</option>
            <option value="ft">ft</option>
            <option value="truck">truck</option>
            <option value="ton">ton</option>
          </select>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Price (Tk)"
          />
        </div>

        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-sm"
          placeholder="Note (optional)"
        />

        <div className="flex gap-3">
          <button
            onClick={handleAddMaterial}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center gap-2 transition text-sm font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            {editingId ? 'Update Material' : 'Add Material'}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({ date: '', name: '', quantity: '', unit: 'kg', price: '', note: '' });
              }}
              className="px-5 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search materials..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <select
            value={filterPreset}
            onChange={(e) => setFilterPreset(e.target.value)}
            className="sm:w-52 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
          >
            <option value="">All Materials</option>
            {PRESET_MATERIALS.map((mat) => (
              <option key={mat} value={mat}>{mat}</option>
            ))}
          </select>

          {(filterText || filterPreset) && (
            <button
              onClick={() => { setFilterText(''); setFilterPreset(''); }}
              className="px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Clear
            </button>
          )}
        </div>

        {(filterText || filterPreset) && (
          <p className="mt-2 text-xs text-gray-500">
            Showing {filteredMaterials.length} of {materials.length} entries
          </p>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Material Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Note</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map(material => (
              <tr key={material.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-700">
                  {new Date(material.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700">{material.name}</td>
                <td className="px-6 py-3 text-sm text-gray-700">
                  {parseFloat(material.quantity) % 1 === 0
                    ? parseFloat(material.quantity)
                    : parseFloat(material.quantity).toFixed(2)}{' '}
                  {material.unit}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700">
                  Tk {parseFloat(material.price) % 1 === 0
                    ? parseFloat(material.price)
                    : parseFloat(material.price).toFixed(2)}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">{material.note}</td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(material)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
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

        {filteredMaterials.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            {materials.length === 0
              ? 'No materials added yet. Add one to get started.'
              : 'No materials match your filter.'}
          </div>
        )}
      </div>

      {/* Total Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-300 p-6 shadow-md">
        <div className="text-right">
          <p className="text-gray-700 text-sm mb-2 font-medium">
            {(filterText || filterPreset) ? 'Filtered Material Cost' : 'Total Material Cost'}
          </p>
          <p className="text-4xl font-bold text-blue-700">
            Tk {totalPrice % 1 === 0 ? totalPrice : totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaterialsTab;