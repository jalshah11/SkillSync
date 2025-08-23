import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Admin() {
  const { user, loading } = useAuth()
  const [users, setUsers] = useState([])
  const [sessions, setSessions] = useState([])

  async function load() {
    try {
      const u = await api.get('admin/users').json()
      const s = await api.get('admin/sessions').json()
      setUsers(u.users || [])
      setSessions(s.sessions || [])
    } catch {}
  }

  async function toggleAdmin(id) {
    await api.post(`admin/users/${id}/toggle-admin`).json()
    await load()
  }

  useEffect(() => { if (!loading) load() }, [loading])

  if (loading) return <div className="p-6">Loading...</div>
  if (!user || !(user.roles||[]).includes('admin')) return <div className="p-6">Forbidden</div>

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <section className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Roles</th>
                <th className="text-left p-2">Completed</th>
                <th className="text-left p-2">Badges</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{(u.roles||[]).join(', ')}</td>
                  <td className="p-2">{u.completedSessions||0}</td>
                  <td className="p-2">{(u.badges||[]).join(', ')}</td>
                  <td className="p-2">
                    <button onClick={() => toggleAdmin(u._id)} className="px-3 py-1 bg-gray-800 text-white rounded">Toggle Admin</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Sessions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2">Skill</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Mentor</th>
                <th className="text-left p-2">Learner</th>
                <th className="text-left p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s._id} className="border-t">
                  <td className="p-2">{s.skill}</td>
                  <td className="p-2">{s.status}</td>
                  <td className="p-2">{s.mentor?.name}</td>
                  <td className="p-2">{s.learner?.name}</td>
                  <td className="p-2">{new Date(s.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}