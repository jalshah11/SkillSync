import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import { useToast } from '../context/ToastContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { show } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [googleToken, setGoogleToken] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      show('Logged in', 'success')
    } catch (err) {
      setError('Login failed')
      show('Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function loginWithGoogle() {
    try {
      await api.post('auth/google', { json: { idToken: googleToken } }).json()
      show('Logged in with Google', 'success')
      navigate('/dashboard')
    } catch {
      setError('Google login failed')
      show('Google login failed', 'error')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="w-full border rounded p-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input className="w-full border rounded p-2" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-6 space-y-2">
        <label className="block text-sm font-medium">Google ID Token (for demo)</label>
        <input className="w-full border rounded p-2" placeholder="Paste Google ID token" value={googleToken} onChange={e=>setGoogleToken(e.target.value)} />
        <button onClick={loginWithGoogle} className="w-full bg-red-600 text-white py-2 rounded">Login with Google</button>
      </div>
      <p className="mt-4 text-sm">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
    </div>
  )
}

