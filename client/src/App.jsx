import { useState, useEffect } from 'react'

function App() {
  const [tests, setTests] = useState({
    frontend: { status: 'checking', message: 'Checking...' },
    backend: { status: 'checking', message: 'Checking...' },
    database: { status: 'checking', message: 'Checking...' },
    users: { status: 'checking', message: 'Checking...', data: [] }
  })

  useEffect(() => {
    runAllTests()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const runAllTests = async () => {
    // Test 1: Frontend
    setTests(prev => ({
      ...prev,
      frontend: { status: 'success', message: 'Frontend is running!' }
    }))

    // Test 2: Backend Connection
    try {
      const response = await fetch('/api/test')
      const data = await response.json()
      
      setTests(prev => ({
        ...prev,
        backend: { 
          status: 'success', 
          message: `Backend connected! ${data.message}` 
        }
      }))

      // Test 3: Database Connection
      testDatabase()
    } catch (error) {
      setTests(prev => ({
        ...prev,
        backend: { 
          status: 'error', 
          message: `Backend error: ${error.message}` 
        },
        database: { 
          status: 'error', 
          message: 'Cannot test database (backend not connected)' 
        }
      }))
    }
  }

  const testDatabase = async () => {
    try {
      const response = await fetch('/api/test/database')
      const data = await response.json()
      
      if (data.success) {
        setTests(prev => ({
          ...prev,
          database: { 
            status: 'success', 
            message: `Database connected! Found ${data.tableCount} tables` 
          },
          users: {
            status: 'success',
            message: `Found ${data.users.length} users in database`,
            data: data.users
          }
        }))
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      setTests(prev => ({
        ...prev,
        database: { 
          status: 'error', 
          message: `Database error: ${error.message}` 
        }
      }))
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'bg-green-50 border-green-500 shadow-green-100'
      case 'error': return 'bg-red-50 border-red-500 shadow-red-100'
      default: return 'bg-yellow-50 border-yellow-500 shadow-yellow-100'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return '✅'
      case 'error': return '❌'
      default: return '⏳'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'success': return 'text-green-800'
      case 'error': return 'text-red-800'
      default: return 'text-yellow-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4 flex justify-center items-center">
      <div className="max-w-5xl w-full space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center border border-gray-100">
          <div className="mb-4">
            <span className="text-6xl">🏊‍♂️</span>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            La Piscina Resort
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Integrated Management System - Connection Test
          </p>
          <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frontend Test */}
          <div className={`border-l-4 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${getStatusColor(tests.frontend.status)}`}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{getStatusIcon(tests.frontend.status)}</span>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${getStatusText(tests.frontend.status)}`}>
                  Frontend (React + Vite + Tailwind)
                </h3>
                <p className={`mt-2 ${getStatusText(tests.frontend.status)}`}>
                  {tests.frontend.message}
                </p>
              </div>
            </div>
          </div>

          {/* Backend Test */}
          <div className={`border-l-4 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${getStatusColor(tests.backend.status)}`}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{getStatusIcon(tests.backend.status)}</span>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${getStatusText(tests.backend.status)}`}>
                  Backend (Node.js + Express)
                </h3>
                <p className={`mt-2 ${getStatusText(tests.backend.status)}`}>
                  {tests.backend.message}
                </p>
              </div>
            </div>
          </div>

          {/* Database Test */}
          <div className={`border-l-4 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${getStatusColor(tests.database.status)}`}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{getStatusIcon(tests.database.status)}</span>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${getStatusText(tests.database.status)}`}>
                  Database (MySQL via XAMPP)
                </h3>
                <p className={`mt-2 ${getStatusText(tests.database.status)}`}>
                  {tests.database.message}
                </p>
              </div>
            </div>
          </div>

          {/* Users Test */}
          <div className={`border-l-4 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${getStatusColor(tests.users.status)}`}>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{getStatusIcon(tests.users.status)}</span>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${getStatusText(tests.users.status)}`}>
                  Database Query Test
                </h3>
                <p className={`mt-2 ${getStatusText(tests.users.status)}`}>
                  {tests.users.message}
                </p>
              </div>
            </div>

            {/* User List */}
            {tests.users.data.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h4 className="font-bold text-gray-800 mb-4 text-lg">Sample Users from Database:</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {tests.users.data.map((user, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                      <p className="text-sm font-medium">
                        <span className="text-gray-600">Email:</span> <span className="text-gray-900">{user.email}</span>
                      </p>
                      <p className="text-sm font-medium mt-1">
                        <span className="text-gray-600">Name:</span> <span className="text-gray-900">{user.first_name} {user.last_name}</span>
                      </p>
                      <p className="text-sm font-medium mt-1">
                        <span className="text-gray-600">Role:</span> 
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'receptionist' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <button 
            onClick={runAllTests}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 Run Tests Again
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📋 What This Tests:
          </h3>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-green-500 font-bold text-xl">✓</span>
              <span className="font-medium"><strong>Frontend:</strong> React app is running with Tailwind CSS</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-green-500 font-bold text-xl">✓</span>
              <span className="font-medium"><strong>Backend:</strong> Express server is running and responding to API calls</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-green-500 font-bold text-xl">✓</span>
              <span className="font-medium"><strong>Database:</strong> MySQL connection is active and tables exist</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-green-500 font-bold text-xl">✓</span>
              <span className="font-medium"><strong>Query:</strong> Can retrieve data from users table</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
