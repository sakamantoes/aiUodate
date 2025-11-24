import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Medications() {
  const { user, logout } = useAuth();
  const [medications, setMedications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    reminderTime: '09:00'
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    const API_URL = "http://localhost:5000"
    try {
      const response = await axios.get(`${API_URL}/api/medications/user/${user.id}`);
      setMedications(response.data);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  const handleSubmit = async (e) => {
    const API_URL = "http://localhost:5000"
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/medications`, {
        ...formData,
        userId: user.id
      });
      setShowForm(false);
      setFormData({
        name: '',
        dosage: '',
        frequency: 'daily',
        reminderTime: '09:00'
      });
      fetchMedications();
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  const handleDelete = async (id) => {
    const API_URL = "http://localhost:5000"
    try {
      await axios.delete(`${API_URL}/api/medications/${id}`);
      fetchMedications();
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h1 className="ml-3 text-2xl font-bold text-gray-900">Health Manager</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-blue-600 hover:text-blue-500">
                Dashboard
              </Link>
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Medication Management</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Add Medication
            </button>
          </div>

          {/* Add Medication Form */}
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Add New Medication</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Medication Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dosage</label>
                    <input
                      type="text"
                      name="dosage"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.dosage}
                      onChange={handleChange}
                      placeholder="e.g., 500mg, 1 tablet"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Frequency</label>
                    <select
                      name="frequency"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.frequency}
                      onChange={handleChange}
                    >
                      <option value="daily">Daily</option>
                      <option value="twice-daily">Twice Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="as-needed">As Needed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reminder Time</label>
                    <input
                      type="time"
                      name="reminderTime"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.reminderTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Add Medication
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Medications List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {medications.map((medication) => (
                <li key={medication.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                        <p className="text-sm text-gray-600">
                          {medication.dosage} • {medication.frequency} • {medication.reminderTime}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(medication.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-md text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {medications.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No medications</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first medication.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Medications;