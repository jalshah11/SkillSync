import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Sessions() {
  const { user, loading } = useAuth()
  const [sessions, setSessions] = useState([])

  async function load() {
    try {
      const res = await api.get('sessions').json()
      setSessions(res.sessions || [])
    } catch { setSessions([]) }
  }

  async function accept(id) {
    await api.post(`sessions/${id}/accept`).json()
    await load()
  }
  async function decline(id) {
    await api.post(`sessions/${id}/decline`).json()
    await load()
  }
  async function complete(id) {
    await api.post(`sessions/${id}/complete`).json()
    await load()
  }
  async function generateCert(id) {
    await api.post(`sessions/${id}/certificate`).json()
    await load()
  }

  useEffect(() => { if (!loading) load() }, [loading])

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Sessions</h1>
      {sessions.length === 0 ? (
        <p className="text-gray-600">No sessions yet.</p>
      ) : (
        <ul className="space-y-3">
          {sessions.map(s => (
            <li key={s._id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{s.skill} • {s.status}</p>
                <p className="text-sm text-gray-600">Mentor: {s.mentor?.name} • Learner: {s.learner?.name}</p>
                {s.certificateUrl && (
                  <a href={s.certificateUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">Download Certificate</a>
                )}
                {(s.status === 'accepted' || s.status === 'completed') && (
                  <div>
                    <a href={`/api/calendar/sessions/${s._id}.ics`} className="text-sm text-blue-600 hover:underline">Add to Calendar (.ics)</a>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {user && s.status === 'pending' && String(s.mentor?._id) === String(user.id) && (
                  <>
                    <button onClick={() => accept(s._id)} className="px-3 py-1 bg-green-600 text-white rounded">Accept</button>
                    <button onClick={() => decline(s._id)} className="px-3 py-1 bg-red-600 text-white rounded">Decline</button>
                  </>
                )}
                {s.status === 'accepted' && (
                  <>
                    <Link to={`/sessions/${s._id}/chat`} className="px-3 py-1 bg-blue-600 text-white rounded">Open Chat</Link>
                    <button onClick={() => complete(s._id)} className="px-3 py-1 bg-gray-700 text-white rounded">Mark Complete</button>
                  </>
                )}
                {s.status === 'completed' && !s.certificateUrl && (
                  <button onClick={() => generateCert(s._id)} className="px-3 py-1 bg-purple-600 text-white rounded">Generate Certificate</button>
                )}
                {s.status === 'completed' && s.certificateUrl && (
                  <a href={s.certificateUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-purple-700 text-white rounded">Download Certificate</a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}