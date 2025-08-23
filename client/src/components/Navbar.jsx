import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-xl font-bold">SkillSync</button>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-gray-700 hover:text-black">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-black">Dashboard</Link>
              <Link to="/sessions" className="text-gray-700 hover:text-black">Sessions</Link>
              {(user.roles||[]).includes('admin') && (
                <Link to="/admin" className="text-gray-700 hover:text-black">Admin</Link>
              )}
              <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
              <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

