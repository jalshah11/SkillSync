import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { AuthProvider } from '../context/AuthContext.jsx'

export default function Layout() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-6xl mx-auto p-6">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  )
}

