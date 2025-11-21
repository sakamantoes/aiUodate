import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Health Manager</h1>
            </div>
          
            <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white text-sm"
            >
                Logout
            </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Welcome Back</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{user?.name}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Condition: <span className="font-medium">{user?.condition}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Medication Management */}
            <Link to="/medications" className="transform hover:scale-105 transition duration-200">
              <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Medication Manager</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">Manage Medications</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Set reminders and track your medication schedule
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Health Tips */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Daily Tip</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">Stay Hydrated</div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Drinking enough water helps your body process medications effectively.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Features Section */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900">Smart Reminders</h3>
                <p className="text-gray-600 mt-2">
                  Receive personalized medication reminders with motivational messages tailored to your journey.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900">Progress Tracking</h3>
                <p className="text-gray-600 mt-2">
                  Monitor your adherence and health progress with intelligent feedback and insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;