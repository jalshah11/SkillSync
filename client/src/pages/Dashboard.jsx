import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

export default function Dashboard() {
  const { user, loading, refresh } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [teachSkills, setTeachSkills] = useState('')
  const [learnSkills, setLearnSkills] = useState('')
  const [saving, setSaving] = useState(false)
  const [matches, setMatches] = useState([])

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [loading, user, navigate])

  useEffect(() => {
    if (user) {
      const hasAnySkills = (user.teachSkills && user.teachSkills.length) || (user.learnSkills && user.learnSkills.length)
      if (!hasAnySkills) {
        navigate('/onboarding')
        return
      }
      setName(user.name || '')
      setBio(user.bio || '')
      setTeachSkills((user.teachSkills || []).join(', '))
      setLearnSkills((user.learnSkills || []).join(', '))
      loadMatches()
    }
  }, [user])

  async function loadMatches() {
    try {
      const res = await api.get('match/find').json()
      setMatches(res.matches || [])
    } catch { setMatches([]) }
  }

  async function saveProfile(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const body = {
        name,
        bio,
        teachSkills: teachSkills.split(',').map(s => s.trim()).filter(Boolean),
        learnSkills: learnSkills.split(',').map(s => s.trim()).filter(Boolean),
      }
      await api.put('users/me', { json: body }).json()
      await refresh()
      await loadMatches()
    } finally { setSaving(false) }
  }

  async function requestSession(mentorId, skill) {
    try {
      await api.post('sessions', { json: { mentorId, skill } }).json()
      navigate('/sessions')
    } catch (e) {
      // no-op for now
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!user) return null

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={() => navigate('/')} className="text-blue-600">Home</button>
      </div>

      <form onSubmit={saveProfile} className="bg-white rounded shadow p-4 space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="w-full border rounded p-2" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea className="w-full border rounded p-2" rows={3} value={bio} onChange={e => setBio(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teach Skills (comma-separated)</label>
            <input className="w-full border rounded p-2" value={teachSkills} onChange={e => setTeachSkills(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Learn Skills (comma-separated)</label>
            <input className="w-full border rounded p-2" value={learnSkills} onChange={e => setLearnSkills(e.target.value)} />
          </div>
        </div>
        <button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
      </form>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Matches</h2>
        {matches.length === 0 ? (
          <p className="text-gray-600">No matches yet. Update your skills to discover peers.</p>
        ) : (
          <ul className="space-y-3">
            {matches.map(m => (
              <li key={m._id} className="flex items-start justify-between border rounded p-3">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-gray-600">Teaches: {(m.teachSkills||[]).join(', ')}</p>
                  <p className="text-sm text-gray-600">Learns: {(m.learnSkills||[]).join(', ')}</p>
                </div>
                <div className="flex items-center gap-3">
                  {(m.teachSkills||[]).slice(0,1).map(skill => (
                    <button key={skill} onClick={() => requestSession(m._id, skill)} className="text-blue-600 hover:underline">Request {skill}</button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

